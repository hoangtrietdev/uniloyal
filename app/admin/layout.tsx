'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { signOut } from '@/lib/firebase/auth';
import { BarChart3, Settings2, Zap, LogOut } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/admin/analytics', label: 'Analytics Overview', icon: BarChart3, id: 'nav-analytics' },
  { href: '/admin/loyalty', label: 'Loyalty Rule Setup', icon: Settings2, id: 'nav-loyalty' },
  { href: '/admin/crm', label: 'CRM Automation', icon: Zap, id: 'nav-crm' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/');
      } else if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
            U
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 uppercase tracking-wider">UniLoyal Admin</h1>
            <p className="text-[9px] text-slate-400 font-mono">Merchant Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">System Live</span>
          </div>
          <div className="flex items-center gap-2">
            {user.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name ?? ''} className="w-7 h-7 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
            )}
            <button
              id="btn-admin-logout"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full mx-auto" style={{ maxWidth: '1600px' }}>
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-5 space-y-6 hidden md:block" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-2 pb-5 border-b border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
              💼
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">UniLoyal Admin</h3>
              <span className="text-[9px] text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Merchant Live Node
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  id={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase transition-all text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-600" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Webhook status */}
          <div className="pt-6 border-t border-slate-200/80 space-y-2 text-[10px] text-slate-500 font-mono">
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Ingestion Webhooks</p>
            <div className="space-y-1.5 pt-1">
              {[
                { label: 'VCB API Status', status: 'Listening' },
                { label: 'MoMo Hook URL', status: 'Active' },
              ].map((w) => (
                <div key={w.label} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
                  <span>{w.label}</span>
                  <span className="text-emerald-600 font-semibold">• {w.status}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-center justify-around px-2 pb-safe h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
