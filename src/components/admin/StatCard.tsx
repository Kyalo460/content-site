'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  stat: {
    name: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    color: string;
    trend: 'up' | 'down';
  };
  index: number;
}

export default function StatCard({ stat, index }: StatCardProps) {
  return (
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
          {stat.icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={cn(
          'text-body-sm font-medium',
          stat.trend === 'up' ? 'text-green-600' : 'text-rose-600'
        )}>
          {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
        </span>
      </div>
    </motion.div>
  );
}