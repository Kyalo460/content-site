import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return {
    title: 'Terms of Service',
    description: settings?.siteName + ' Terms of Service',
  };
}

export default async function TermsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });

  return (
    <div className="section bg-white">
      <div className="container-custom max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="font-display text-display-lg text-charcoal-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-body-lg text-charcoal-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <article className="prose prose-charcoal max-w-none space-y-8">
          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              By accessing and using {settings?.siteName || 'this website'}, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">2. Age Restriction</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              This website contains mature content. You must be at least 18 years of age (or the age of majority in your jurisdiction) to access this website. By using this site, you represent and warrant that you meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">3. Content License</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              All content on this website, including but not limited to images, videos, text, graphics, and logos, is the property of {settings?.siteName || 'the creator'} and is protected by copyright laws. You are granted a limited, non-exclusive, non-transferable license to view content for personal, non-commercial use only.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">4. Purchases and Payments</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              All purchases are processed through Stripe. We do not store your payment card information. Prices are in USD unless otherwise stated. Access to premium content is granted upon successful payment verification.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">5. Refund Policy</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              Due to the nature of digital content, all sales are final. However, if you experience technical issues preventing access to purchased content, please contact us within 7 days for assistance.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">6. User Conduct</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              You agree not to: (a) share, distribute, or reproduce content without permission; (b) attempt to bypass access controls; (c) use automated tools to scrape content; (d) harass or threaten other users or the creator.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">7. Termination</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              We reserve the right to terminate or suspend your access immediately, without prior notice, for any breach of these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              The website is provided "as is" and "as available" without warranties of any kind, either express or implied.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              In no event shall {settings?.siteName || 'the creator'} be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">10. Governing Law</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              These terms shall be governed by the laws of the jurisdiction where the creator operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">11. Contact Information</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              For questions about these terms, contact us at {settings?.contactEmail || 'support@shirlene.com'} or via WhatsApp.
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