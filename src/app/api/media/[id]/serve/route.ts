import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSignedDownloadUrl } from '@/lib/storage';
import { logAudit } from '@/lib/audit';

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
        isPublished: true,
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

    const signedUrl = await getSignedDownloadUrl(media.fileUrl, 3600);

    await logAudit({
      userId: session?.user?.id,
      action: 'MEDIA_ACCESS',
      entity: 'media',
      entityId: media.id,
    });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json({ message: 'Failed to generate signed URL' }, { status: 500 });
  }
}