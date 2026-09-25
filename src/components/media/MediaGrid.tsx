'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Lock, Image as ImageIcon, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  title: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  isPremium: boolean;
  isPublished: boolean;
  collection?: { name: string; slug: string } | null;
}

interface MediaGridProps {
  media: MediaItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] } },
};

export default function MediaGrid({ media, columns = 4, className }: MediaGridProps) {
  if (!media.length) {
    return (
      <div className="text-center py-16 text-charcoal-500">
        <p className="text-body-lg">No content available yet.</p>
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <motion.div
      className={cn('grid gap-6', gridCols[columns], className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="list"
      aria-label="Media gallery"
    >
      {media.map((item, index) => (
        <motion.article
          key={item.id}
          variants={itemVariants}
          className={cn(
            'card card-hover group relative overflow-hidden',
            !item.isPublished && 'opacity-50'
          )}
        >
          <Link
            href={`/media/${item.id}`}
            className="block focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded-2xl"
            aria-label={`View ${item.title}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
              {(item.thumbnailUrl || item.previewUrl) ? (
                <Image
                  src={item.thumbnailUrl || item.previewUrl!}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-gold-100">
                  {item.type === 'VIDEO' ? (
                    <Film className="w-12 h-12 text-rose-300" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-rose-300" />
                  )}
                </div>
              )}

              {item.isPremium && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                  <Lock className="w-10 h-10 text-white/90" aria-hidden="true" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 text-charcoal-900 shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300">
                  {item.type === 'VIDEO' ? (
                    <Play className="w-6 h-6" />
                  ) : (
                    <ImageIcon className="w-6 h-6" />
                  )}
                </div>
              </div>

              {!item.isPublished && (
                <div className="absolute top-3 left-3">
                  <span className="bg-charcoal-900/80 text-white text-caption px-2 py-1 rounded-full">
                    Draft
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              {item.collection && (
                <span className="text-caption font-medium text-rose-600 uppercase tracking-wider">
                  {item.collection.name}
                </span>
              )}
              <h3 className="font-display text-heading-sm text-charcoal-900 mt-1.5 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-body-sm text-charcoal-500">
                <span className="flex items-center gap-1">
                  {item.type === 'VIDEO' ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  {item.type}
                </span>
                {item.isPremium && (
                  <span className="flex items-center gap-1 text-rose-600 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    Premium
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </motion.div>
  );
}