import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, FolderKanban } from 'lucide-react';
import CollectionCard from '@/components/collections/CollectionCard';

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
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))
        )}
      </div>
    </div>
  );
}