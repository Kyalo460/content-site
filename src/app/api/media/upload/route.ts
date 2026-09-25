import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadFile, generateStorageKey, validateFile, getMediaType, getFileExtension } from '@/lib/storage';
import { generateImageThumbnail, generateBlurredPreview, generateVideoThumbnail, getVideoMetadata, optimizeImage } from '@/lib/media';
import { logAudit, AuditActions } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const collectionId = formData.get('collectionId') as string;
    const isPremium = formData.get('isPremium') === 'true';
    const priceCents = parseInt(formData.get('priceCents') as string) || 0;

    if (!file || !title) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const validation = validateFile({ mimeType: file.type, size: file.size });
    if (!validation.valid) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const mediaType = getMediaType(file.type);
    if (!mediaType) {
      return NextResponse.json({ message: 'Unsupported file type' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mediaId = `media_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const extension = getFileExtension(file.type);

    const fileKey = generateStorageKey('media', mediaId, extension);
    await uploadFile(fileKey, buffer, file.type);

    let thumbnailUrl: string | null = null;
    let previewUrl: string | null = null;
    let width: number | undefined;
    let height: number | undefined;
    let duration: number | undefined;

    if (mediaType === 'IMAGE') {
      const optimized = await optimizeImage(buffer);
      const optimizedKey = generateStorageKey('media', mediaId, 'webp');
      await uploadFile(optimizedKey, optimized, 'image/webp');

      const thumb = await generateImageThumbnail(buffer);
      const thumbKey = generateStorageKey('thumbnail', mediaId, 'webp');
      await uploadFile(thumbKey, thumb, 'image/webp');
      thumbnailUrl = thumbKey;

      const preview = await generateBlurredPreview(buffer);
      const previewKey = generateStorageKey('preview', mediaId, 'webp');
      await uploadFile(previewKey, preview, 'image/webp');
      previewUrl = previewKey;

      const sharp = (await import('sharp')).default;
      const metadata = await sharp(buffer).metadata();
      width = metadata.width;
      height = metadata.height;
    } else {
      const thumb = await generateVideoThumbnail(buffer);
      const thumbKey = generateStorageKey('thumbnail', mediaId, 'webp');
      await uploadFile(thumbKey, thumb, 'image/webp');
      thumbnailUrl = thumbKey;

      const preview = await generateBlurredPreview(thumb);
      const previewKey = generateStorageKey('preview', mediaId, 'webp');
      await uploadFile(previewKey, preview, 'image/webp');
      previewUrl = previewKey;

      const meta = await getVideoMetadata(buffer);
      width = meta.width;
      height = meta.height;
      duration = meta.duration;
    }

    const media = await prisma.media.create({
      data: {
        id: mediaId,
        title,
        description: description || null,
        type: mediaType,
        fileUrl: fileKey,
        fileSize: buffer.length,
        mimeType: file.type,
        width,
        height,
        duration,
        thumbnailUrl,
        previewUrl,
        isPublished: false,
        isPremium,
        priceCents,
        collectionId: collectionId || null,
      },
    });

    await logAudit({
      userId: session.user.id,
      action: AuditActions.MEDIA_UPLOAD,
      entity: 'media',
      entityId: media.id,
      metadata: { title, type: mediaType, isPremium, priceCents },
    });

    return NextResponse.json({ id: media.id, message: 'Upload successful' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}