'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  sortOrder: number;
  isPublished: boolean;
  media?: Array<{
    id: string;
    type: 'IMAGE' | 'VIDEO';
    thumbnailUrl?: string | null;
  }>;
}

interface CollectionCardProps {
  collection: CollectionItem;
  delay?: number;
}

export default function CollectionCard({ collection, delay = 0 }: CollectionCardProps) {
  const mediaCount = collection.media?.length || 0;
  const hasImages = collection.media?.some(m => m.type === 'IMAGE') || false;
  const hasVideos = collection.media?.some(m => m.type === 'VIDEO') || false;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.19, 1, 0.22, 1] }}
      className={cn(
        'card relative overflow-hidden group',
        !collection.isPublished && 'opacity-60'
      )}
    >
      <Link
        href={`/collections/${collection.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded-2xl"
        aria-label={`View ${collection.name} collection`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
          {collection.coverImage ? (
            <Image
              src={collection.coverImage}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
            />
          ) : collection.media?.[0]?.thumbnailUrl ? (
            <Image
              src={collection.media[0].thumbnailUrl}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-cream-100 to-gold-100">
              <div className="text-6xl opacity-30">✦</div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 text-cream-200/80 text-body-sm mb-2">
              {hasImages && <ImageIcon className="w-4 h-4" />}
              {hasVideos && <Film className="w-4 h-4" />}
              <span>{mediaCount} items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display text-heading-md text-white">
                {collection.name}
              </span>
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 text-white group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {!collection.isPublished && (
            <div className="absolute top-3 left-3">
              <span className="bg-charcoal-900/80 text-white text-caption px-2 py-1 rounded-full">
                Draft
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}