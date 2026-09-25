import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return {
    title: 'Refund Policy',
    description: settings?.siteName + ' Refund Policy',
  };
}

export default async function RefundPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });

  return (
    <div className="section bg-white">
      <div className="container-custom max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="font-display text-display-lg text-charcoal-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-body-lg text-charcoal-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <article className="prose prose-charcoal max-w-none space-y-8">
          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">Digital Content Policy</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              Due to the nature of digital content (images, videos, downloadable files), all purchases are <strong className="text-charcoal-900">final and non-refundable</strong> once access has been granted. This policy protects the intellectual property and exclusive nature of the content.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">Exceptions</h2>
            <p className="text-body text-charcoal-600 leading-relaxed mb-4">
              We may consider refunds in the following limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-3 text-body text-charcoal-600">
              <li><strong>Technical failure:</strong> Content cannot be accessed due to platform errors (not user device issues)</li>
              <li><strong>Duplicate charge:</strong> You were charged multiple times for the same purchase</li>
              <li><strong>Content not as described:</strong> The delivered content materially differs from the preview/description</li>
              <li><strong>Unauthorized transaction:</strong> The purchase was made without your authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">Refund Request Process</h2>
            <ol className="list-decimal list-inside space-y-3 text-body text-charcoal-600">
              <li>Contact us within <strong>7 days</strong> of purchase at {settings?.contactEmail || 'support@shirlene.com'}</li>
              <li>Include: Order ID, email used, reason for request, and any supporting evidence</li>
              <li>We will review within 5 business days</li>
              <li>If approved, refund processed to original payment method within 5-10 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">Subscription Cancellations</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              For subscription products, you may cancel at any time. Cancellation prevents future charges but does not refund the current period. Access continues until the period ends.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">Chargebacks</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              Filing a chargeback without contacting us first may result in permanent account suspension and loss of access to all purchased content. Please contact us to resolve issues first.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">Consumer Rights</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              This policy does not affect your statutory rights under applicable consumer protection laws (e.g., EU 14-day withdrawal right for digital content not yet downloaded, where applicable).
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">Contact</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              For refund inquiries: {settings?.contactEmail || 'refunds@shirlene.com'} or WhatsApp.
            </p>
          </section>
        </article>

        <div className="mt-12 text-center">
          <a href="/" className="btn-outline">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}