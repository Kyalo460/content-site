import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.STORAGE_PROVIDER === 'r2'
    ? `https://${process.env.AWS_S3_BUCKET}.r2.cloudflarestorage.com`
    : undefined,
});

const BUCKET = process.env.AWS_S3_BUCKET || 'shirlene-media';

export async function uploadFile(
  key: string,
  body: Buffer | Readable,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return key;
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

export function generateStorageKey(
  type: 'media' | 'thumbnail' | 'preview',
  mediaId: string,
  extension: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${type}/${mediaId}/${timestamp}-${random}.${extension}`;
}

export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
} as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateFile(file: { mimeType: string; size: number }): { valid: boolean; error?: string } {
  const allAllowed = [...ALLOWED_MIME_TYPES.image, ...ALLOWED_MIME_TYPES.video];
  
  if (!allAllowed.includes(file.mimeType as any)) {
    return { valid: false, error: 'File type not allowed. Only images and videos are permitted.' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.` };
  }
  
  return { valid: true };
}

export function getMediaType(mimeType: string): 'IMAGE' | 'VIDEO' | null {
  if (ALLOWED_MIME_TYPES.image.includes(mimeType as any)) return 'IMAGE';
  if (ALLOWED_MIME_TYPES.video.includes(mimeType as any)) return 'VIDEO';
  return null;
}

export function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
  };
  return map[mimeType] || 'bin';
}