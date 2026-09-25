import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  image?: string | null;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function Hero({
  title,
  subtitle,
  image,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {image && (
        <div className="absolute inset-0 -z-10">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/80 via-charcoal-950/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent" />
        </div>
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-mesh" />

      <div className="container-custom relative py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-cream-100 text-body-sm font-medium tracking-wide">
              PREMIUM CREATOR PLATFORM
            </span>
          </div>

          <h1
            id="hero-title"
            className="font-display text-display-xl lg:text-display-2xl font-medium text-white mb-6 animate-fade-in-up delay-100 text-balance"
          >
            {title}
          </h1>

          {subtitle && (
            <p className="text-cream-200 text-body-lg lg:text-display-sm mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200 text-balance leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              href={ctaHref}
              className="btn-gold text-lg px-10 py-4 group"
            >
              {ctaText}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            {secondaryCtaText && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                target={secondaryCtaHref.startsWith('http') ? '_blank' : undefined}
                rel={secondaryCtaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={cn(
                  'btn bg-white/10 backdrop-blur-xl border border-white/20 text-cream-100 hover:bg-white/20',
                  'text-lg px-10 py-4'
                )}
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>

          <div className="mt-16 animate-fade-in-up delay-400">
            <div className="flex items-center justify-center gap-8 text-cream-400/50 text-body-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse-soft" />
                Exclusive Content
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-soft delay-200" />
                Secure Payments
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft delay-400" />
                Direct Access
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up delay-500">
        <div className="flex flex-col items-center gap-2 text-cream-400/50">
          <span className="text-caption tracking-widest uppercase">Scroll to explore</span>
          <svg
            className="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}