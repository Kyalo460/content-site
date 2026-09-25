import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return {
    title: 'Privacy Policy',
    description: settings?.siteName + ' Privacy Policy',
  };
}

export default async function PrivacyPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });

  return (
    <div className="section bg-white">
      <div className="container-custom max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="font-display text-display-lg text-charcoal-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-body-lg text-charcoal-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <article className="prose prose-charcoal max-w-none space-y-8">
          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">1. Information We Collect</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              We collect information you provide directly: email, name, payment details (processed by Stripe), and communication preferences. We also collect usage data: IP address, browser type, pages visited, and timestamps.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-body text-charcoal-600">
              <li>Process purchases and grant content access</li>
              <li>Send order confirmations and updates</li>
              <li>Improve website experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">3. Payment Information</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              Payment processing is handled by Stripe. We never receive or store your full credit card details. Stripe provides us with a token to reference the payment method.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">4. Data Sharing</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              We do not sell your personal information. We share data only with: Stripe (payments), email service providers (transactional emails), cloud storage (content delivery), and when required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">5. Data Retention</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              We retain account data while your account is active. Purchase records are kept for 7 years for tax compliance. You may request deletion of your account at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">6. Your Rights</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              You have the right to: access your data, correct inaccuracies, request deletion, restrict processing, data portability, and object to processing. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">7. Cookies</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              We use essential cookies for authentication and session management. We do not use tracking cookies for advertising.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">8. Security</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              We implement appropriate technical measures: encryption in transit (TLS 1.2+), at rest (AES-256), secure password hashing (bcrypt), rate limiting, and regular security audits.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">9. International Transfers</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              Your data may be processed in the United States or other countries where our service providers operate. We ensure adequate protections per applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">10. Children's Privacy</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              This website is not intended for users under 18. We do not knowingly collect data from minors. If you believe a minor has provided data, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              We may update this policy. Changes will be posted here with an updated date. Continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-display text-heading-lg text-charcoal-900 mb-4">12. Contact Us</h2>
            <p className="text-body text-charcoal-600 leading-relaxed">
              Questions? Email {settings?.contactEmail || 'privacy@shirlene.com'} or use WhatsApp.
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