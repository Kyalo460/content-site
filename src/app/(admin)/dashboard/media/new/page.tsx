'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaFormData {
  title: string;
  description: string;
  collectionId: string;
  file: File | null;
}

interface MediaFormErrors {
  title?: boolean;
  file?: boolean;
}

const collections = [
  { id: 'intimate-moments', name: 'Intimate Moments' },
  { id: 'behind-scenes', name: 'Behind the Scenes' },
  { id: 'video-diaries', name: 'Video Diaries' },
];

export default function NewMediaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<MediaFormData>({
    title: '',
    description: '',
    collectionId: '',
    file: null,
  });
  const [errors, setErrors] = useState<MediaFormErrors>({});

  const validateForm = () => {
    const newErrors: MediaFormErrors = {};
    if (!formData.title.trim()) newErrors.title = true;
    if (!formData.file) newErrors.file = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload an image (JPG, PNG, WebP) or video (MP4, WebM).');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB.');
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('collectionId', formData.collectionId);
      if (formData.file) form.append('file', formData.file);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/dashboard/media/${data.id}`);
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.message || 'Upload failed');
      }
    } catch {
      alert('An error occurred during upload');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-charcoal-900 mb-2">
          Upload New Media
        </h1>
        <p className="text-body-lg text-charcoal-500">
          Add images or videos to your library
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8 space-y-6" noValidate>
        <div
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 transition-colors relative cursor-pointer',
            dragActive && 'border-rose-500 bg-rose-50',
            !dragActive && 'border-cream-300 hover:border-rose-400'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />

          {preview ? (
            <div className="relative">
              {formData.file?.type.startsWith('video/') ? (
                <video src={preview} className="w-full max-h-64 rounded-xl object-cover" controls />
              ) : (
                <img src={preview} alt="Preview" className="w-full max-h-64 rounded-xl object-cover" />
              )}
              <button
                type="button"
                onClick={() => { setFormData(prev => ({ ...prev, file: null })); setPreview(null); }}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center',
                dragActive ? 'bg-rose-100 text-rose-600' : 'bg-cream-100 text-charcoal-300'
              )}>
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="font-medium text-charcoal-900">Drag & drop or click to upload</p>
                <p className="text-body-sm text-charcoal-500 mt-1">
                  Images (JPG, PNG, WebP) or Videos (MP4, WebM) • Max 50MB
                </p>
              </div>
            </div>
          )}
        </div>

        {errors.file && (
          <p className="text-body-sm text-rose-600">Please select a file to upload</p>
        )}

        <div>
          <label htmlFor="title" className="label">Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={cn('input', errors.title && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20')}
            placeholder="Enter media title"
            required
            disabled={isLoading}
          />
          {errors.title && <p className="mt-1 text-body-sm text-rose-600">Title is required</p>}
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="input min-h-[100px] resize-y"
            placeholder="Optional description..."
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="collectionId" className="label">Collection</label>
          <select
            id="collectionId"
            value={formData.collectionId}
            onChange={(e) => setFormData(prev => ({ ...prev, collectionId: e.target.value }))}
            className="input"
            disabled={isLoading}
          >
            <option value="">Select a collection (optional)</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-cream-200">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 py-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </span>
            ) : (
              'Upload Media'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline flex-1 py-3"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}