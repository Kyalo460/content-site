import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Globe,
  Globe2,
  Image,
  FolderKanban,
} from 'lucide-react';

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { media: true } },
      media: { take: 1, orderBy: { sortOrder: 'asc' } },
    },
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-display-lg text-charcoal-900 mb-2">
            Collections
          </h1>
          <p className="text-body-lg text-charcoal-500">
            Organize your media into collections
          </p>
        </div>
        <Link href="/admin/dashboard/collections/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <FolderKanban className="w-12 h-12 text-cream-300 mx-auto mb-4" />
            <p className="text-body text-charcoal-500 mb-4">No collections yet</p>
            <Link href="/admin/dashboard/collections/new" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" />
              Create First Collection
            </Link>
          </div>
        ) : (
          collections.map((collection, index) => (
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
          ))
        )}
      </div>
    </div>
  );
}