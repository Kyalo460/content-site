'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, X, Expand, Download, Lock, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaDetailProps {
  media: {
    id: string;
    title: string;
    description?: string | null;
    type: 'IMAGE' | 'VIDEO';
    fileUrl: string;
    thumbnailUrl?: string | null;
    previewUrl?: string | null;
    width?: number | null;
    height?: number | null;
    duration?: number | null;
    isPremium: boolean;
    priceCents: number;
    collection?: { name: string; slug: string } | null;
  };
  hasAccess: boolean;
  isLoading: boolean;
}

export default function MediaDetail({ media, hasAccess, isLoading }: MediaDetailProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  const handlePurchase = () => {
    if (media.isPremium && !hasAccess) {
      setShowPurchase(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
          <div className="aspect-[16/9] bg-cream-200 rounded-2xl" />
          <div className="h-8 bg-cream-200 rounded-xl w-1/3" />
          <div className="h-6 bg-cream-200 rounded w-1/2" />
          <div className="h-6 bg-cream-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  const isVideo = media.type === 'VIDEO';
  const contentUrl = hasAccess ? media.fileUrl : (media.previewUrl || media.thumbnailUrl);
  const isPreview = !hasAccess && media.isPremium;

  return (
    <article className="animate-fade-in">
      <nav className="section-sm bg-white border-b border-cream-200" aria-label="Breadcrumb">
        <div className="container-custom flex items-center gap-2 text-body-sm text-charcoal-500">
          <a href="/" className="hover:text-rose-600 transition-colors">Home</a>
          <span>/</span>
          <a href="/collections" className="hover:text-rose-600 transition-colors">Collections</a>
          {media.collection && (
            <>
              <span>/</span>
              <a href={`/collections/${media.collection.slug}`} className="hover:text-rose-600 transition-colors">
                {media.collection.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-charcoal-900 font-medium truncate max-w-xs">{media.title}</span>
        </div>
      </nav>

      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-cream-100 relative">
                {isVideo ? (
                  <div className="w-full h-full relative">
                    {contentUrl && (
                      <video
                        src={contentUrl}
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                        poster={media.thumbnailUrl || undefined}
                      />
                    )}
                    {isPreview && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePurchase}
                          className="btn-gold text-lg px-8 py-4 group flex items-center gap-3"
                        >
                          <Lock className="w-5 h-5" />
                          <span>Unlock Premium Content</span>
                          <span className="text-gold-500 font-medium">
                            ${(media.priceCents / 100).toFixed(2)}
                          </span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {contentUrl && (
                      <Image
                        src={contentUrl}
                        alt={media.title}
                        fill
                        className={cn('object-cover', isPreview && 'filter blur-md grayscale-25')}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        placeholder="blur"
                        blurDataURL={media.previewUrl || media.thumbnailUrl || "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="}
                      />
                    )}
                    {isPreview && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePurchase}
                          className="btn-gold text-lg px-8 py-4 group flex items-center gap-3"
                        >
                          <Lock className="w-5 h-5" />
                          <span>Unlock Premium Content</span>
                          <span className="text-gold-500 font-medium">
                            ${(media.priceCents / 100).toFixed(2)}
                          </span>
                        </motion.button>
                      </div>
                    )}
                  </>
                )}

                {isFullscreen && (
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-xl hover:bg-black/70 transition-colors"
                    aria-label="Exit fullscreen"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}

                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 text-white rounded-xl hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Enter fullscreen"
                >
                  <Expand className="w-5 h-5" />
                </button>
              </div>

              {media.description && (
                <p className="mt-6 text-body text-charcoal-600 leading-relaxed">
                  {media.description}
                </p>
              )}
            </div>

            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h1 className="font-display text-display-sm text-charcoal-900 mb-2">
                  {media.title}
                </h1>

                {media.collection && (
                  <a
                    href={`/collections/${media.collection.slug}`}
                    className="inline-flex items-center gap-1 text-body-sm text-rose-600 hover:text-rose-700 font-medium mb-4"
                  >
                    <span>{media.collection.name}</span>
                  </a>
                )}

                <div className="flex items-center gap-4 mb-6 pt-4 border-t border-cream-200">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium',
                    media.isPremium
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-green-50 text-green-700'
                  )}>
                    {media.isPremium ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Premium
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5" />
                        Free
                      </>
                    )}
                  </span>

                  <span className="text-body-sm text-charcoal-500">
                    {media.type}
                    {media.duration && ` • ${Math.floor(media.duration / 60)}:${String(Math.floor(media.duration % 60)).padStart(2, '0')}`}
                  </span>
                </div>

                {media.isPremium && !hasAccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-rose-50 to-gold-50 rounded-xl p-6 border border-rose-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                        <Lock className="w-6 h-6 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="font-display text-heading-sm text-charcoal-900">
                          Premium Content
                        </h3>
                        <p className="text-body-sm text-charcoal-500">
                          Purchase to unlock full access
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePurchase}
                      className="btn-gold w-full py-3 text-lg"
                    >
                      Purchase for ${(media.priceCents / 100).toFixed(2)}
                    </motion.button>
                  </motion.div>
                )}

                {hasAccess && media.isPremium && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-display text-heading-sm text-charcoal-900">
                          Access Granted
                        </h3>
                        <p className="text-body-sm text-charcoal-500">
                          Enjoy the full premium experience
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-cream-200">
                  <button className="btn-outline text-sm">
                    <Heart className="w-4 h-4" />
                    Favorite
                  </button>
                  <button className="btn-outline text-sm">
                    <Download className="w-4 h-4" />
                    {hasAccess ? 'Download' : 'Preview Only'}
                  </button>
                  <button className="btn-ghost text-sm">
                    Share
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h3 className="font-display text-heading-md text-charcoal-900 mb-4">
                  More from this collection
                </h3>
                <p className="text-body text-charcoal-500">
                  Explore related content in the {media.collection?.name || 'collection'}.
                </p>
                <a
                  href={media.collection ? `/collections/${media.collection.slug}` : '/collections'}
                  className="mt-4 inline-flex items-center gap-2 btn-primary"
                >
                  View Collection
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showPurchase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPurchase(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="purchase-title" className="font-display text-heading-lg text-charcoal-900">
                  Unlock Premium Content
                </h2>
                <button
                  onClick={() => setShowPurchase(false)}
                  className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="font-display text-heading-md text-charcoal-900 mb-2">
                  {media.title}
                </h3>
                <p className="text-body text-charcoal-500">
                  Purchase to unlock full access to this premium content.
                </p>
              </div>

              <div className="bg-cream-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between text-body">
                  <span className="text-charcoal-600">Premium Access</span>
                  <span className="font-display text-heading-sm text-charcoal-900 text-rose-600">
                    ${(media.priceCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <a
                href={`/checkout/${media.id}`}
                className="btn-gold w-full py-3 text-lg"
              >
                Complete Purchase
              </a>

              <p className="text-center text-caption text-charcoal-400 mt-4">
                Secure payment powered by Stripe
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}