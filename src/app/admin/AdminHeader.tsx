'use client';

import { Menu, Bell, User, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  user: { name?: string | null; email: string; image?: string | null };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-cream-200">
      <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-charcoal-600 hover:bg-cream-100 transition-colors"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:flex items-center gap-4">
            <span className="text-body-sm text-charcoal-500">
              Admin Panel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-xl text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-700 transition-colors"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-cream-100 transition-colors"
              aria-label="User menu"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-gold-500 flex items-center justify-center text-white font-medium text-sm">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <span className="hidden lg:block text-body-sm font-medium text-charcoal-700">
                {user.name || 'Admin'}
              </span>
            </button>

            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-cream-200 py-2 z-50"
                role="menu"
              >
                <div className="px-4 py-3 border-b border-cream-200">
                  <p className="text-body-sm font-medium text-charcoal-900">{user.name || 'Admin'}</p>
                  <p className="text-body-sm text-charcoal-500 truncate">{user.email}</p>
                </div>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-charcoal-600 hover:bg-cream-50 hover:text-charcoal-900"
                    role="menuitem"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}