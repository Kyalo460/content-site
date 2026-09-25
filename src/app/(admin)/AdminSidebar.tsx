'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image,
  FolderKanban,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Media', href: '/admin/dashboard/media', icon: Image },
  { name: 'Collections', href: '/admin/dashboard/collections', icon: FolderKanban },
  { name: 'Products', href: '/admin/dashboard/products', icon: ShoppingBag },
  { name: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/dashboard/customers', icon: Users },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-white border-r border-cream-200 transition-all duration-300 ease-out-expo',
          collapsed ? 'w-16' : 'w-64'
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 lg:h-20 px-4 border-b border-cream-200">
            <Link href="/admin/dashboard" className="flex items-center gap-2" aria-label="Dashboard Home">
              <span className={cn(
                'font-display text-xl font-medium text-charcoal-900 transition-opacity',
                collapsed && 'opacity-0 w-0 overflow-hidden'
              )}>
                Shirlene
              </span>
              <span className={cn(
                'text-gold-600 text-xs font-medium tracking-wider transition-opacity',
                collapsed && 'opacity-0 w-0 overflow-hidden'
              )}>
                ADMIN
              </span>
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                'p-2 rounded-xl text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 transition-colors',
                collapsed && 'ml-auto'
              )}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-rose-50 text-rose-700'
                      : 'text-charcoal-600 hover:bg-cream-100 hover:text-charcoal-900',
                    collapsed && 'justify-center px-2'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span className={cn(
                    'truncate transition-opacity',
                    collapsed && 'opacity-0 w-0 overflow-hidden absolute'
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-cream-200">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-charcoal-600 hover:bg-cream-100 hover:text-charcoal-900 transition-colors',
                  collapsed && 'justify-center px-2'
                )}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className={cn(
                  'truncate transition-opacity',
                  collapsed && 'opacity-0 w-0 overflow-hidden absolute'
                )}>
                  Sign Out
                </span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div
        className={cn(
          'fixed left-0 top-0 z-30 w-full h-full bg-black/50 lg:hidden transition-opacity',
          collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={() => setCollapsed(true)}
        aria-hidden="true"
      />
    </>
  );
}