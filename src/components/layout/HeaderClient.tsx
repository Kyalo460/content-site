'use client';

import Link from 'next/link';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import WhatsAppButton from './WhatsAppButton';

interface HeaderClientProps {
  session: { id?: string; email?: string; name?: string | null; role?: string; [key: string]: any } | null;
}

export default function HeaderClient({ session }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-cream-200 transition-all duration-300">
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2" aria-label="Shirlene Home">
            <span className="font-display text-2xl lg:text-3xl font-medium text-charcoal-900">
              Shirlene
            </span>
            <span className="hidden lg:inline-block w-px h-6 bg-gradient-to-b from-rose-400 to-gold-400" />
            <span className="hidden lg:inline text-gold-600 text-sm font-medium tracking-wider">
              PREMIUM
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm font-medium text-charcoal-600 hover:text-rose-600 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-rose-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <WhatsAppButton className="hidden sm:flex" />
            
            {session ? (
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  href="/admin/dashboard"
                  className="btn-secondary text-sm"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="btn-ghost text-sm">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="hidden lg:btn-primary text-sm"
              >
                <User className="w-4 h-4" />
                Admin
              </Link>
            )}

            <button
              className="lg:hidden p-2 rounded-xl text-charcoal-600 hover:bg-cream-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 border-t border-cream-200 animate-slide-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body font-medium text-charcoal-600 hover:text-rose-600 transition-colors px-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-cream-200 flex flex-col gap-3">
                <WhatsAppButton className="w-full justify-center" />
                {session ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className="btn-secondary w-full justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <form action="/api/auth/signout" method="POST">
                      <button type="submit" className="btn-ghost w-full justify-center">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    className="btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}