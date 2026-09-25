import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import MediaGrid from '@/components/media/MediaGrid';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { name: true, description: true, coverImage: true },
  });

  if (!collection) return { title: 'Collection Not Found' };

  return {
    title: collection.name,
    description: collection.description || `Explore ${collection.name} collection`,
    openGraph: {
      title: collection.name,
      description: collection.description || '',
      images: collection.coverImage ? [collection.coverImage] : [],
      type: 'website',
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      media: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!collection || !collection.isPublished) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <section className="section-sm bg-white border-b border-cream-200">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-body-sm text-charcoal-500 mb-6" aria-label="Breadcrumb">
            <a href="/" className="hover:text-rose-600 transition-colors">Home</a>
            <span>/</span>
            <a href="/collections" className="hover:text-rose-600 transition-colors">Collections</a>
            <span>/</span>
            <span className="text-charcoal-900 font-medium">{collection.name}</span>
          </nav>

          <header className="max-w-3xl">
            <h1 className="font-display text-display-lg text-charcoal-900 mb-4">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-body-lg text-charcoal-500 leading-relaxed">
                {collection.description}
              </p>
            )}
          </header>
        </div>
      </section>

      <section className="section bg-cream-50" aria-labelledby="media-heading">
        <div className="container-custom">
          <h2 id="media-heading" className="sr-only">
            Media in {collection.name}
          </h2>
          <MediaGrid
            media={collection.media.map(m => ({
              ...m,
              collection: { name: collection.name, slug: collection.slug },
            }))}
            columns={4}
          />

          {!collection.media.length && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">✦</div>
              <p className="text-body-lg text-charcoal-500">
                This collection is empty. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}