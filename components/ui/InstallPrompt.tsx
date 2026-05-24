'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');

    queueMicrotask(() => {
      setIsIOS(ios);
      setIsStandalone(standalone);
    });

    if (!standalone && !dismissed) {
      // Show after 3 seconds
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!standalone && !dismissed) setShowPrompt(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      (deferredPrompt as unknown as { prompt: () => void }).prompt();
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-[200]"
      >
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm shrink-0">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Install UniLoyal</p>
              {isIOS ? (
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Tap <Share className="w-3 h-3 inline text-blue-400" /> then <strong className="text-white">Add to Home Screen</strong> for the best experience.
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">Add to home screen for offline access & NFC tap-to-earn.</p>
              )}
            </div>
            <button onClick={handleDismiss} className="text-slate-500 hover:text-white transition-colors shrink-0 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
