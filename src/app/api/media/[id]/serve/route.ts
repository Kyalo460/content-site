import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSignedDownloadUrl } from '@/lib/storage';
import { logAudit, AuditActions } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const media = await prisma.media.findUnique({
      where: { id },
      select: {
        id: true,
        fileUrl: true,
        isPremium: true,
        isPublished: true,
        priceCents: true,
      },
    });

    if (!media) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }

    if (!media.isPublished) {
      if (!session?.user) {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
      }
    }

    if (media.isPremium) {
      if (!session?.user) {
        return NextResponse.json({ message: 'Premium content requires authentication' }, { status: 401 });
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
        return NextResponse.json({ message: 'Premium content requires purchase' }, { status: 403 });
      }
    }

    const signedUrl = await getSignedDownloadUrl(media.fileUrl, 3600);

    await logAudit({
      userId: session?.user?.id,
      action: 'MEDIA_ACCESS',
      entity: 'media',
      entityId: media.id,
      metadata: { isPremium: media.isPremium },
    });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json({ message: 'Failed to generate signed URL' }, { status: 500 });
  }
}