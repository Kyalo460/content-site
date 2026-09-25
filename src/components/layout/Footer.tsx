import Link from 'next/link';
import { Mail, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getWhatsAppUrl } from '@/lib/utils';

export default async function Footer() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  });

  const whatsappUrl = settings?.whatsappNumber
    ? getWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage || undefined)
    : null;

  const footerLinks = [
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
    { href: settings?.termsUrl || '/legal/terms', label: 'Terms of Service', external: !!settings?.termsUrl },
    { href: settings?.privacyUrl || '/legal/privacy', label: 'Privacy Policy', external: !!settings?.privacyUrl },
    { href: settings?.refundUrl || '/legal/refund', label: 'Refund Policy', external: !!settings?.refundUrl },
  ];

  return (
    <footer className="bg-charcoal-950 text-cream-100" role="contentinfo">
      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6" aria-label="Shirlene Home">
              <span className="font-display text-3xl font-medium text-white">
                Shirlene
              </span>
              <span className="w-px h-8 bg-gradient-to-b from-rose-400 to-gold-400" />
              <span className="text-gold-400 text-sm font-medium tracking-wider">
                PREMIUM
              </span>
            </Link>
            <p className="text-cream-400 text-body leading-relaxed mb-6 max-w-xs">
              {settings?.siteDescription || 'Exclusive content and intimate experiences from Shirlene.'}
            </p>
            <div className="flex items-center gap-4">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-400 hover:text-gold-400 transition-colors p-2 rounded-xl hover:bg-white/5"
                  aria-label="Contact on WhatsApp"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
              )}
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-cream-400 hover:text-gold-400 transition-colors p-2 rounded-xl hover:bg-white/5"
                  aria-label="Email us"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-white mb-4">Explore</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-cream-400 hover:text-gold-400 transition-colors text-body-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-white mb-4">Support</h3>
            <ul className="space-y-3 text-cream-400 text-body-sm">
              <li>FAQ</li>
              <li>Contact Us</li>
              <li>Shipping Info</li>
              <li>Returns</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-white mb-4">Stay Connected</h3>
            <p className="text-cream-400 text-body-sm mb-4">
              Join our newsletter for exclusive updates and early access.
            </p>
            <form className="flex gap-2" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="flex-1 input bg-white/5 border-white/10 text-white placeholder-cream-500 focus:border-gold-500 focus:ring-gold-500/20"
                required
              />
              <button type="submit" className="btn-gold px-4" aria-label="Subscribe">
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream-500 text-body-sm">
              © {new Date().getFullYear()} Shirlene. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-cream-500 text-body-sm">
              <Heart className="w-4 h-4 text-rose-500" aria-hidden="true" />
              <span>Made with care</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}