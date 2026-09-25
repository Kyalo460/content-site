'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Image, FolderKanban, Edit, Globe } from 'lucide-react';
import Link from 'next/link';

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    coverImage?: string | null;
    sortOrder: number;
    isPublished: boolean;
    _count: { media: number };
    media: Array<{ thumbnailUrl?: string | null }>;
  };
  index: number;
}

export default function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <motion.article
      key={collection.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card bg-white"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-cream-100">
        {collection.coverImage ? (
          <img src={collection.coverImage} alt="" className="w-full h-full object-cover" />
        ) : collection.media[0]?.thumbnailUrl ? (
          <img src={collection.media[0].thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-12 h-12 text-charcoal-300" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={cn(
            'px-2 py-1 rounded-full text-caption font-medium',
            collection.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
          )}>
            {collection.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-heading-md text-charcoal-900 mb-1">
          {collection.name}
        </h3>
        <p className="text-body-sm text-charcoal-500 mb-3 line-clamp-2">
          {collection.description || 'No description'}
        </p>
        <div className="flex items-center justify-between text-body-sm text-charcoal-500 mb-4">
          <span>{collection._count.media} media items</span>
          <span>Order: {collection.sortOrder}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/dashboard/collections/${collection.id}/edit`} className="btn-outline flex-1 justify-center text-sm">
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <Link href={`/collections/${collection.slug}`} target="_blank" className="btn-ghost flex-1 justify-center text-sm">
            <Globe className="w-4 h-4" />
            View
          </Link>
        </div>
      </div>
    </motion.article>
  );
}