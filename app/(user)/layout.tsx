'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { User, Wallet, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import InstallPrompt from '@/components/ui/InstallPrompt';
import ServiceWorkerRegistrar from '@/components/ui/ServiceWorkerRegistrar';

const NAV_ITEMS = [
  { href: '/profile', label: 'Profile', icon: User, id: 'nav-user' },
  { href: '/dashboard', label: 'My Wallet', icon: Wallet, id: 'nav-brand' },
  { href: '/integrations', label: 'Record', icon: Clock, id: 'nav-recording' },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      <ServiceWorkerRegistrar />

      {/* Mobile phone frame wrapper — keeps mobile-first feel on desktop */}
      <div className="w-full max-w-[430px] min-h-screen bg-slate-50 relative flex flex-col shadow-2xl">
        {/* Status bar */}
        <div className="px-5 py-2 flex items-center justify-between text-[10px] font-mono text-slate-600 font-bold bg-white border-b border-slate-100 pt-safe">
          <span>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-slate-300 rounded-sm p-0.5 flex items-center bg-white">
              <div className="h-full w-4 bg-emerald-500 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div id="user-scroll-view" className="flex-1 overflow-y-auto scrollbar-none pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 z-40 pb-safe">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/brand'));
            return (
              <Link
                key={item.href}
                id={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center w-24 h-12 rounded-xl transition-colors touch-target ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <InstallPrompt />
    </div>
  );
}
