import sharp from 'sharp';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export async function generateImageThumbnail(
  inputBuffer: Buffer,
  options: { width?: number; height?: number; quality?: number } = {}
): Promise<Buffer> {
  const { width = 400, height = 400, quality = 80 } = options;
  
  return sharp(inputBuffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality })
    .toBuffer();
}

export async function generateBlurredPreview(
  inputBuffer: Buffer,
  options: { width?: number; height?: number; blur?: number } = {}
): Promise<Buffer> {
  const { width = 800, height = 600, blur = 50 } = options;
  
  return sharp(inputBuffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .blur(blur)
    .webp({ quality: 30 })
    .toBuffer();
}

export async function generateVideoThumbnail(
  videoBuffer: Buffer,
  options: { time?: string; width?: number; height?: number } = {}
): Promise<Buffer> {
  const { time = '00:00:01', width = 400, height = 400 } = options;
  
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `video-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`);
  const outputPath = path.join(tempDir, `thumb-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`);
  
  try {
    await fs.writeFile(inputPath, videoBuffer);
    
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputPath,
        '-ss', time,
        '-vframes', '1',
        '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-f', 'webp',
        '-y', outputPath,
      ]);
      
      ffmpeg.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`FFmpeg exited with code ${code}`));
      });
      
      ffmpeg.on('error', reject);
    });
    
    const thumbnail = await fs.readFile(outputPath);
    return thumbnail;
  } finally {
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {}),
    ]);
  }
}

export async function getVideoMetadata(videoBuffer: Buffer): Promise<{
  duration: number;
  width: number;
  height: number;
}> {
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `video-meta-${Date.now()}.mp4`);
  
  try {
    await fs.writeFile(inputPath, videoBuffer);
    
    return await new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height,duration',
        '-of', 'json',
        inputPath,
      ]);
      
      let stdout = '';
      ffprobe.stdout.on('data', (data) => { stdout += data.toString(); });
      
      ffprobe.on('close', (code) => {
        if (code === 0) {
          try {
            const data = JSON.parse(stdout);
            const stream = data.streams[0];
            resolve({
              duration: parseFloat(stream.duration) || 0,
              width: stream.width || 0,
              height: stream.height || 0,
            });
          } catch {
            reject(new Error('Failed to parse ffprobe output'));
          }
        } else {
          reject(new Error(`ffprobe exited with code ${code}`));
        }
      });
      
      ffprobe.on('error', reject);
    });
  } finally {
    await fs.unlink(inputPath).catch(() => {});
  }
}

export async function optimizeImage(
  inputBuffer: Buffer,
  options: { maxWidth?: number; maxHeight?: number; quality?: number; format?: 'webp' | 'avif' } = {}
): Promise<Buffer> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 85, format = 'webp' } = options;
  
  const pipeline = sharp(inputBuffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  
  if (format === 'webp') {
    return pipeline.webp({ quality }).toBuffer();
  } else {
    return pipeline.avif({ quality }).toBuffer();
  }
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