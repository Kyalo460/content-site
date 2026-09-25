'use client';

import { MessageSquare, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWhatsAppUrl } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

interface WhatsAppButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'floating';
  showLabel?: boolean;
}

export default async function WhatsAppButton({
  className,
  size = 'md',
  variant = 'primary',
  showLabel = true,
}: WhatsAppButtonProps) {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  });

  if (!settings?.whatsappNumber) return null;

  const url = getWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage || undefined);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const variantClasses = {
    primary: 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50',
    floating: 'fixed bottom-6 right-6 z-50 bg-green-500 text-white shadow-xl shadow-green-500/30 rounded-full px-5 py-3 animate-pulse-soft hover:shadow-green-500/50',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out-expo',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label="Contact Shirlene on WhatsApp"
    >
      <MessageSquare className="w-5 h-5 flex-shrink-0" />
      {showLabel && <span>WhatsApp</span>}
      <ExternalLink className="w-4 h-4 flex-shrink-0" />
    </a>
  );
}