'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, ChevronRight, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Brand, Transaction, UserProfile } from '@/lib/types';
import Image from 'next/image';

interface CustomerDashboardProps {
  brands: Brand[];
  onSelectBrand: (brand: Brand) => void;
  transactions: Transaction[];
  onTriggerNfc: () => void;
  nfcActive: boolean;
  setNfcActive: (active: boolean) => void;
  onQuickAddBrand: () => void;
  user: UserProfile;
}

export default function CustomerDashboard({
  brands, onSelectBrand, transactions, onTriggerNfc, nfcActive, setNfcActive, onQuickAddBrand, user
}: CustomerDashboardProps) {
  const [nfcStage, setNfcStage] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [nfcSelectedBrand, setNfcSelectedBrand] = useState('highlands');

  const handleNfcTap = () => {
    setNfcStage('scanning');
    setNfcActive(true);
    setTimeout(() => {
      setNfcStage('success');
      onTriggerNfc();
      setTimeout(() => { setNfcStage('idle'); setNfcActive(false); }, 2500);
    }, 2000);
  };

  const totalPoints = brands.reduce((acc, b) => acc + b.points, 0);

  return (
    <div className="space-y-5 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              id="dashboard-user-avatar"
              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'}
              alt={user.name}
              width={48} height={48}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">WELCOME BACK,</p>
            <h2 id="dashboard-user-name" className="text-sm font-bold text-slate-900 flex items-center gap-1 uppercase">
              {user.name} <span className="text-amber-500">✨</span>
            </h2>
          </div>
        </div>
        <button
          id="btn-quick-nfc"
          onClick={handleNfcTap}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all font-bold text-[11px] uppercase tracking-wider active:scale-95 cursor-pointer shadow-sm"
        >
          <Wifi className="w-3.5 h-3.5 animate-pulse" />
          TAP NFC
        </button>
      </div>

      {/* Total points summary */}
      <div className="bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Total UniLoyal Points</p>
        <p className="text-3xl font-black tracking-tight mt-1">{totalPoints.toLocaleString()} <span className="text-base font-semibold text-indigo-300">PTS</span></p>
        <p className="text-[10px] text-indigo-300 mt-1 font-medium">{brands.length} active cards · {user.vipCode}</p>
      </div>

      {/* Brand wallet */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">My Brand Wallet</h3>
            <span className="text-xs font-bold text-slate-400">({brands.length})</span>
          </div>
          <button
            id="btn-add-brand-card"
            onClick={onQuickAddBrand}
            className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold uppercase flex items-center gap-1 border border-indigo-100/50 rounded-full px-3 py-1.5 bg-indigo-50/50 hover:bg-indigo-100 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD CARD
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {brands.map((brand) => {
            const progress = Math.min((brand.points / brand.nextTierPoints) * 100, 100);
            return (
              <motion.div
                id={`brand-card-${brand.id}`}
                key={brand.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectBrand(brand)}
                className="relative overflow-hidden rounded-[20px] border border-slate-100/80 bg-white hover:border-slate-200 cursor-pointer shadow-sm transition-all p-4"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-b ${brand.bgGradient} opacity-[0.04] rounded-full filter blur-xl`} />
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[20px]" style={{ backgroundColor: brand.accentColor }} />
                <div className="pl-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-lg border border-slate-200">
                        {brand.logo}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{brand.name}</h4>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{brand.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">{brand.points}</span>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">pts</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] mb-1 text-slate-500">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: brand.accentColor }} />
                        <span>Tier: <span className="font-bold" style={{ color: brand.accentColor }}>{brand.currentTier}</span></span>
                      </div>
                      <span>{brand.points}/{brand.nextTierPoints} PTS</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: brand.accentColor }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-500 truncate max-w-[220px] italic">🏷️ {brand.benefits[0]}</span>
                    <span className="text-indigo-600 font-bold flex items-center gap-0.5 uppercase text-[9px]">Detail <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${tx.type === 'earn' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  {tx.type === 'earn' ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{tx.brandName}</p>
                  <p className="text-[10px] text-slate-400">{tx.date} · {tx.time}</p>
                </div>
                <span className={`text-xs font-bold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'earn' ? '+' : ''}{tx.pointsReceived} PTS
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFC overlay */}
      <AnimatePresence>
        {nfcActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] backdrop-blur-md bg-slate-900/60 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-center space-y-6"
            >
              <div className="relative flex flex-col items-center py-4">
                <div className="absolute w-44 h-44 rounded-full border border-indigo-500/10 animate-ping" />
                <div className="absolute w-32 h-32 rounded-full border border-indigo-500/20 animate-pulse" />
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md transition-all duration-500 ${nfcStage === 'success' ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                  {nfcStage === 'success' ? '✅' : '📡'}
                </div>
              </div>
              {nfcStage === 'scanning' ? (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">Contactless Sensing...</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Touch near POS terminal to earn points.</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-left">
                    <label className="text-[10px] text-slate-400 font-bold block mb-2 uppercase">Select Brand:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {brands.slice(0, 3).map((b) => (
                        <button key={b.id} onClick={() => setNfcSelectedBrand(b.id)} className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 border transition-all ${nfcSelectedBrand === b.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-600'}`}>
                          <span className="text-sm">{b.logo}</span>
                          <span className="text-[9px] truncate w-full text-center font-semibold">{b.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">+25 PTS ACCUMULATED</span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">NFC Check-in Successful!</h3>
                  <p className="text-xs text-slate-500">Points added to <span className="text-indigo-600 font-bold">{brands.find(b => b.id === nfcSelectedBrand)?.name || 'Highlands'}</span>.</p>
                </motion.div>
              )}
              <button onClick={() => { setNfcStage('idle'); setNfcActive(false); }} className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-semibold cursor-pointer">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
