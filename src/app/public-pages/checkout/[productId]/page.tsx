import { prisma } from '@/prisma';
import { createCheckoutSession } from '@/lib/stripe';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { name: true, description: true, priceCents: true },
  });

  if (!product) return { title: 'Checkout' };

  return {
    title: `Checkout - ${product.name}`,
    description: product.description || `Purchase ${product.name}`,
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      media: { where: { isPublished: true }, take: 5 },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="section bg-cream-50 min-h-[calc(100vh-200px)] flex items-center">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-display-md text-charcoal-900 mb-4">
              Complete Your Purchase
            </h1>
            <p className="text-body-lg text-charcoal-500">
              Secure checkout powered by Stripe
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="mb-8 p-6 bg-cream-50 rounded-xl">
              <h2 className="font-display text-heading-lg text-charcoal-900 mb-2">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-body text-charcoal-600 mb-4">
                  {product.description}
                </p>
              )}
              <div className="flex items-baseline gap-4">
                <span className="font-display text-display-sm text-rose-600">
                  ${(product.priceCents / 100).toFixed(2)}
                </span>
                <span className="text-body-sm text-charcoal-500">
                  {product.type === 'SUBSCRIPTION' ? '/month' : 'one-time'}
                </span>
              </div>
            </div>

            <form id="checkout-form" className="space-y-6">
              <div>
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="name" className="label">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <button
                type="submit"
                className="btn-gold w-full py-4 text-lg"
                disabled
              >
                Redirecting to Stripe...
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-4 text-body-sm text-charcoal-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure SSL Encryption
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Stripe Protected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}