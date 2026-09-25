import { prisma } from '@/lib/prisma';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Image,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [
    mediaCount,
    collectionCount,
    recentMedia,
  ] = await Promise.all([
    prisma.media.count({ where: { isPublished: true } }),
    prisma.collection.count({ where: { isPublished: true } }),
    prisma.media.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { collection: true },
    }),
  ]);

  const stats = [
    {
      name: 'Media Published',
      value: mediaCount.toString(),
      change: `+${recentMedia.length} recent`,
      icon: Image,
      color: 'text-rose-600 bg-rose-100',
      trend: 'up' as const,
    },
    {
      name: 'Collections',
      value: collectionCount.toString(),
      change: 'Active',
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      trend: 'up' as const,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-charcoal-900 mb-2">
          Dashboard
        </h1>
        <p className="text-body-lg text-charcoal-500">
          Overview of your creator platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-charcoal-500 mb-1">{stat.name}</p>
                <p className="font-display text-display-sm text-charcoal-900">{stat.value}</p>
              </div>
              <div className={cn('p-3 rounded-xl', stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={cn(
                'text-body-sm font-medium',
                stat.trend === 'up' ? 'text-green-600' : 'text-rose-600'
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-white rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-heading-lg text-charcoal-900">
            Recent Media
          </h2>
          <Link
            href="/admin/dashboard/media/new"
            className="btn-primary text-sm"
          >
            <Image className="w-4 h-4" />
            Add Media
          </Link>
        </div>
        <div className="space-y-4">
          {recentMedia.length === 0 ? (
            <p className="text-body text-charcoal-500 text-center py-8">No media uploaded yet</p>
          ) : (
            recentMedia.map((media) => (
              <div key={media.id} className="flex items-center gap-4 p-4 bg-cream-50 rounded-xl">
                <div className="w-16 h-16 rounded-xl bg-cream-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {media.thumbnailUrl ? (
                    <img src={media.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Image className="w-6 h-6 text-charcoal-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal-900 truncate">{media.title}</p>
                  <p className="text-body-sm text-charcoal-500">
                    {media.collection?.name || 'No collection'} • {formatRelativeTime(media.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-caption font-medium',
                    media.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
                  )}>
                    {media.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}