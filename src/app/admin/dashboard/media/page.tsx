import { prisma } from '@/lib/prisma';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Globe,
  Globe2,
  Image as ImageIcon,
  Film,
} from 'lucide-react';

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    include: { collection: true },
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-display-lg text-charcoal-900 mb-2">
            Media Library
          </h1>
          <p className="text-body-lg text-charcoal-500">
            Manage all your content
          </p>
        </div>
        <Link href="/admin/dashboard/media/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Upload Media
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Media</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Collection</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-4 text-left text-caption font-medium text-charcoal-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-caption font-medium text-charcoal-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {media.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-charcoal-500">
                    <div className="flex flex-col items-center gap-4">
                      <ImageIcon className="w-12 h-12 text-cream-300" />
                      <p className="text-body">No media uploaded yet</p>
                      <Link href="/admin/dashboard/media/new" className="btn-primary">
                        <Plus className="w-4 h-4" />
                        Upload First Media
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                media.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-cream-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.thumbnailUrl ? (
                            <Image src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          ) : item.type === 'VIDEO' ? (
                            <Film className="w-6 h-6 text-charcoal-300" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-charcoal-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal-900 truncate max-w-xs">{item.title}</p>
                          <p className="text-body-sm text-charcoal-500">{item.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.collection ? (
                        <Link href={`/admin/dashboard/collections/${item.collection.id}`} className="text-body-sm text-rose-600 hover:text-rose-700 font-medium">
                          {item.collection.name}
                        </Link>
                      ) : (
                        <span className="text-body-sm text-charcoal-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-caption font-medium',
                        item.type === 'IMAGE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      )}>
                        {item.type === 'IMAGE' ? <ImageIcon className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-caption font-medium',
                        item.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      )}>
                        {item.isPublished ? <Globe className="w-3 h-3" /> : <Globe2 className="w-3 h-3" />}
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-caption font-medium',
                        item.isPremium ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700'
                      )}>
                        {item.isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        {item.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-charcoal-500">
                      {formatRelativeTime(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/dashboard/media/${item.id}`} className="p-2 rounded-xl text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition-colors" aria-label="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/dashboard/media/${item.id}/edit`} className="p-2 rounded-xl text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition-colors" aria-label="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-xl text-charcoal-400 hover:bg-rose-50 hover:text-rose-600 transition-colors" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}