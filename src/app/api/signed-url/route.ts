import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSignedDownloadUrl } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { mediaId } = body;

    if (!mediaId) {
      return NextResponse.json({ message: 'Media ID required' }, { status: 400 });
    }

    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      select: {
        id: true,
        fileUrl: true,
        isPremium: true,
        isPublished: true,
      },
    });

    if (!media || !media.isPublished) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }

    if (media.isPremium) {
      if (!session?.user) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
      }

      const entitlement = await prisma.entitlement.findUnique({
        where: {
          customerId_mediaId: {
            customerId: session.user.id,
            mediaId: media.id,
          },
        },
      });

      if (!entitlement) {
        return NextResponse.json({ message: 'Purchase required' }, { status: 403 });
      }
    }

    const signedUrl = await getSignedDownloadUrl(media.fileUrl, 3600);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json({ message: 'Failed to generate signed URL' }, { status: 500 });
  }
}