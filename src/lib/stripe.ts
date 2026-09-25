import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
  typescript: true,
});

export async function createCheckoutSession(params: {
  customerEmail: string;
  lineItems: Array<{
    priceData: {
      currency: string;
      unitAmount: number;
      productData: {
        name: string;
        description?: string;
        images?: string[];
        metadata?: Record<string, string>;
      };
    };
    quantity: number;
  }>;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    paymentMethodTypes: ['card'],
    customerEmail: params.customerEmail,
    lineItems: params.lineItems,
    successUrl: params.successUrl,
    cancelUrl: params.cancelUrl,
    metadata: params.metadata,
    allowPromotionCodes: true,
    billingAddressCollection: 'required',
    shippingAddressCollection: {
      allowedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI'],
    },
  });
}

export async function createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email,
    name,
    metadata: { source: 'shirlene-platform' },
  });
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function createProduct(params: {
  name: string;
  description?: string;
  images?: string[];
  metadata?: Record<string, string>;
}): Promise<Stripe.Product> {
  return stripe.products.create({
    name: params.name,
    description: params.description,
    images: params.images,
    metadata: params.metadata,
  });
}

export async function createPrice(params: {
  productId: string;
  unitAmount: number;
  currency: string;
  recurring?: { interval: 'month' | 'year' };
  metadata?: Record<string, string>;
}): Promise<Stripe.Price> {
  return stripe.prices.create({
    product: params.productId,
    unitAmount: params.unitAmount,
    currency: params.currency,
    recurring: params.recurring,
    metadata: params.metadata,
  });
}