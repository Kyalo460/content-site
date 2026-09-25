import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MediaDetail from '@/components/media/MediaDetail';
import { auth } from '@/lib/auth';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const media = await prisma.media.findUnique({
    where: { id },
    select: { title: true, description: true, thumbnailUrl: true, type: true, collection: { select: { name: true } } },
  });

  if (!media) return { title: 'Media Not Found' };

  return {
    title: media.title,
    description: media.description || `View ${media.title} on Shirlene`,
    openGraph: {
      title: media.title,
      description: media.description || '',
      images: media.thumbnailUrl ? [media.thumbnailUrl] : [],
      type: 'website',
    },
  };
}

export default async function MediaPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      collection: { select: { name: true, slug: true } },
    },
  });

  if (!media || !media.isPublished) {
    notFound();
  }

  let hasAccess = false;
  if (!media.isPremium) {
    hasAccess = true;
  } else if (session?.user?.id) {
    const entitlement = await prisma.entitlement.findUnique({
      where: {
        customerId_mediaId: {
          customerId: session.user.id,
          mediaId: media.id,
        },
      },
    });
    hasAccess = !!entitlement;
  }

  return (
    <MediaDetail
      media={{
        ...media,
        duration: media.duration || undefined,
      }}
      hasAccess={hasAccess}
      isLoading={false}
    />
  );
}