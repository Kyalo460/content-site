import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { stripe, constructWebhookEvent } from '@/lib/stripe';
import { logAudit, AuditActions } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ message: 'Webhook secret not configured' }, { status: 500 });
  }

  let event;
  try {
    event = constructWebhookEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object;
        await handleCheckoutCompleted(checkoutSession);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        await handleRefund(charge);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: any) {
  const { customerId, mediaId, productId, type } = session.metadata || {};

  if (type === 'single_media' && mediaId && customerId) {
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: session.id },
    });

    if (existingOrder) return;

    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) return;

    const order = await prisma.order.create({
      data: {
        customerId,
        stripeSessionId: session.id,
        status: 'COMPLETED',
        subtotalCents: media.priceCents,
        totalCents: media.priceCents,
        currency: 'USD',
        items: {
          create: {
            productId: media.id,
            quantity: 1,
            priceCents: media.priceCents,
          },
        },
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentId: session.payment_intent,
        amountCents: media.priceCents,
        currency: 'USD',
        status: 'SUCCEEDED',
        rawWebhook: session,
      },
    });

    await prisma.entitlement.create({
      data: {
        customerId,
        mediaId: media.id,
        grantedAt: new Date(),
      },
    });

    await logAudit({
      userId: customerId,
      action: AuditActions.ORDER_COMPLETED,
      entity: 'order',
      entityId: order.id,
      metadata: { mediaId, amount: media.priceCents },
    });
  }

  if (type === 'SINGLE_ACCESS' && productId && customerId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { media: true },
    });

    if (!product) return;

    for (const media of product.media) {
      await prisma.entitlement.upsert({
        where: {
          customerId_mediaId: { customerId, mediaId: media.id },
        },
        create: { customerId, mediaId: media.id },
        update: { grantedAt: new Date() },
      });
    }
  }

  if (type === 'SUBSCRIPTION' && productId && customerId) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { media: true },
    });

    if (!product) return;

    for (const media of product.media) {
      await prisma.entitlement.upsert({
        where: {
          customerId_mediaId: { customerId, mediaId: media.id },
        },
        create: { customerId, mediaId: media.id, expiresAt },
        update: { expiresAt, grantedAt: new Date() },
      });
    }
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  const order = await prisma.order.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (order && order.status !== 'COMPLETED') {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
    });

    await prisma.payment.upsert({
      where: { stripePaymentId: paymentIntent.id },
      create: {
        orderId: order.id,
        stripePaymentId: paymentIntent.id,
        amountCents: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'SUCCEEDED',
        rawWebhook: paymentIntent,
      },
      update: { status: 'SUCCEEDED' },
    });
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const order = await prisma.order.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'FAILED' },
    });

    await prisma.payment.upsert({
      where: { stripePaymentId: paymentIntent.id },
      create: {
        orderId: order.id,
        stripePaymentId: paymentIntent.id,
        amountCents: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'FAILED',
        rawWebhook: paymentIntent,
      },
      update: { status: 'FAILED' },
    });
  }
}

async function handleRefund(charge: any) {
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentId: charge.payment_intent },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'REFUNDED' },
    });

    const order = await prisma.order.findUnique({
      where: { id: payment.orderId },
      include: { items: true },
    });

    if (order?.items[0]?.productId) {
      await prisma.entitlement.deleteMany({
        where: {
          customerId: order.customerId,
          mediaId: order.items[0].productId,
        },
      });
    }
  }
}