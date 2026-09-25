import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { productId, mediaId } = body;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (mediaId) {
      const media = await prisma.media.findUnique({
        where: { id: mediaId },
        select: { id: true, title: true, priceCents: true, thumbnailUrl: true },
      });

      if (!media || !media.isPremium) {
        return NextResponse.json({ message: 'Invalid media' }, { status: 400 });
      }

      let customerId: string | undefined;
      let customerEmail: string;

      if (session?.user) {
        let customer = await prisma.customer.findUnique({
          where: { id: session.user.id },
        });

        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.name || undefined,
            },
          });
        }
        customerId = customer.id;
        customerEmail = customer.email;
      } else {
        return NextResponse.json({ message: 'Authentication required for media purchase' }, { status: 401 });
      }

      const checkoutSession = await createCheckoutSession({
        customerEmail,
        lineItems: [{
          priceData: {
            currency: 'USD',
            unitAmount: media.priceCents,
            productData: {
              name: media.title,
              description: `Access to premium media: ${media.title}`,
              images: media.thumbnailUrl ? [media.thumbnailUrl] : [],
              metadata: { mediaId: media.id, type: 'single_media' },
            },
          },
          quantity: 1,
        }],
        successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/media/${mediaId}`,
        metadata: {
          customerId: customerId || '',
          mediaId: media.id,
          type: 'single_media',
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { media: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json({ message: 'Invalid product' }, { status: 400 });
      }

      let customerEmail = body.customerEmail;
      let customerName = body.customerName;

      if (session?.user) {
        let customer = await prisma.customer.findUnique({
          where: { id: session.user.id },
        });

        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.name || undefined,
            },
          });
        }
        customerEmail = customer.email;
        customerName = customer.name || customerName;
      }

      if (!customerEmail) {
        return NextResponse.json({ message: 'Customer email required' }, { status: 400 });
      }

      const lineItems = product.media.length > 0
        ? product.media.map(m => ({
            priceData: {
              currency: product.currency.toLowerCase(),
              unitAmount: product.priceCents,
              productData: {
                name: m.title,
                description: `Access to: ${m.title}`,
                images: m.thumbnailUrl ? [m.thumbnailUrl] : [],
                metadata: { mediaId: m.id, productId: product.id },
              },
            },
            quantity: 1,
          }))
        : [{
            priceData: {
              currency: product.currency.toLowerCase(),
              unitAmount: product.priceCents,
              productData: {
                name: product.name,
                description: product.description || undefined,
                metadata: { productId: product.id },
              },
            },
            quantity: 1,
          }];

      const checkoutSession = await createCheckoutSession({
        customerEmail,
        lineItems,
        successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/checkout/${productId}`,
        metadata: {
          productId: product.id,
          customerEmail,
          customerName: customerName || '',
          type: product.type,
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    return NextResponse.json({ message: 'Product ID or Media ID required' }, { status: 400 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ message: 'Failed to create checkout session' }, { status: 500 });
  }
}