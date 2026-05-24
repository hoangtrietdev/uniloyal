'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { signInWithCredentials } from '@/lib/firebase/auth';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Sparkles, ShieldCheck, Mail, Lock } from 'lucide-react';

export default function UserLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('user1@uniloyal.local');
  const [password, setPassword] = useState('user123');

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        router.replace('/admin/analytics');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, isAdmin, loading, router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithCredentials(email, password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setError(errorMessage);
      setSigningIn(false);
    }
  };

  const handleQuickLogin = async (accountType: 'user' | 'admin') => {
    setSigningIn(true);
    setError(null);
    try {
      if (accountType === 'admin') {
        await signInWithCredentials('admin1@uniloyal.local', 'admin123');
      } else {
        await signInWithCredentials('user1@uniloyal.local', 'user123');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setError(errorMessage);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-2xl mx-auto shadow-2xl shadow-indigo-900/50 mb-4">
            U
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            UniLoyal <span className="text-indigo-400">Wallet</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Omni-channel loyalty ecosystem</p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { icon: <Wifi className="w-3 h-3" />, label: 'NFC Tap-to-Earn' },
            { icon: <Sparkles className="w-3 h-3" />, label: 'AI Rewards' },
            { icon: <ShieldCheck className="w-3 h-3" />, label: 'Secure' },
          ].map((f) => (
            <span key={f.label} className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        {/* Sign-in card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
          <p className="text-xs text-slate-400 text-center font-medium">
            Sign in to access your loyalty wallet with Supabase Postgres
          </p>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <Mail className="w-3 h-3" /> Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="user1@uniloyal.local"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <Lock className="w-3 h-3" /> Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="user123"
                autoComplete="current-password"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              disabled={signingIn}
              className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-200 transition hover:bg-indigo-500/20 disabled:opacity-60"
            >
              Demo User 1
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={signingIn}
              className="rounded-2xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-60"
            >
              Demo Admin 1
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/50 rounded-xl text-xs text-rose-400 font-medium text-center">
              {error}
            </div>
          )}

          <button
            id="btn-google-signin"
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {signingIn ? (
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {signingIn ? 'Signing in...' : 'Continue with Supabase'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">secure</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            🔒 Protected by Supabase credentials and Postgres-backed mock accounts.
          </p>
        </div>

      </motion.div>
    </main>
  );
}
