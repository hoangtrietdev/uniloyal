'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string;
  type?: 'success' | 'info';
}

export default function GlobalNotification({ message, type = 'success' }: NotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[200] p-4 rounded-xl shadow-2xl text-xs flex gap-3 text-slate-100 ${type === 'success' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-950 border border-indigo-900'}`}
    >
      <div className="w-6 h-6 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center text-xs shrink-0 animate-pulse text-white">
        ✨
      </div>
      <div>
        <p className="font-semibold text-white">UniLoyal Event</p>
        <p className="text-[11px] text-slate-300 mt-0.5">{message}</p>
      </div>
    </motion.div>
  );
}

export function NotificationWrapper({ notification }: { notification: { message: string; type: 'success' | 'info' } | null }) {
  return (
    <AnimatePresence>
      {notification && <GlobalNotification message={notification.message} type={notification.type} />}
    </AnimatePresence>
  );
}
