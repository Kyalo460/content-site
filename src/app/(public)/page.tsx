import { prisma } from '@/lib/prisma';
import Hero from '@/components/ui/Hero';
import MediaGrid from '@/components/media/MediaGrid';
import CollectionCard from '@/components/collections/CollectionCard';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

export default async function HomePage() {
  const [settings, collections, featuredMedia] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.collection.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
      include: {
        _count: { select: { media: true } },
        media: {
          where: { isPublished: true },
          take: 1,
          orderBy: { sortOrder: 'asc' },
        },
      },
    }),
    prisma.media.findMany({
      where: { isPublished: true, isPremium: false },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { collection: true },
    }),
  ]);

  return (
    <div className="animate-fade-in">
      <Hero
        title={settings?.heroTitle || 'Shirlene'}
        subtitle={settings?.heroSubtitle || 'Exclusive content & intimate experiences'}
        image={settings?.heroImage}
        ctaText="Explore Collections"
        ctaHref="/collections"
        secondaryCtaText="Contact Me"
        secondaryCtaHref={settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}` : '#'}
      />

      {collections.length > 0 && (
        <section className="section bg-white" aria-labelledby="collections-heading">
          <div className="container-custom">
            <div className="flex items-end justify-between gap-4 mb-12">
              <div>
                <h2 id="collections-heading" className="font-display text-display-md text-charcoal-900">
                  Collections
                </h2>
                <p className="text-body-lg text-charcoal-500 mt-2">
                  Curated galleries of exclusive content
                </p>
              </div>
              <a
                href="/collections"
                className="btn-outline self-end"
              >
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredMedia.length > 0 && (
        <section className="section bg-cream-50" aria-labelledby="featured-heading">
          <div className="container-custom">
            <div className="flex items-end justify-between gap-4 mb-12">
              <div>
                <h2 id="featured-heading" className="font-display text-display-md text-charcoal-900">
                  Featured Content
                </h2>
                <p className="text-body-lg text-charcoal-500 mt-2">
                  Latest free previews and highlights
                </p>
              </div>
            </div>
            <MediaGrid media={featuredMedia} columns={4} />
          </div>
        </section>
      )}

      <section className="section bg-charcoal-950" aria-labelledby="cta-heading">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="cta-heading" className="font-display text-display-lg text-white mb-6">
              Want More Exclusive Access?
            </h2>
            <p className="text-cream-300 text-body-lg mb-10 max-w-xl mx-auto">
              Unlock premium content, behind-the-scenes access, and personal experiences. 
              Join the inner circle today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/collections" className="btn-gold text-lg px-10 py-4">
                Browse Premium
              </a>
              <WhatsAppButton size="lg" variant="outline" showLabel={true} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}