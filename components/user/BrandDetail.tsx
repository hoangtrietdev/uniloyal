'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, ChevronRight, Award, Clock, Check } from 'lucide-react';
import { Brand } from '@/lib/types';

interface BrandDetailProps {
  brand: Brand;
  onBack: () => void;
  onNavigateToRewards: () => void;
}

export default function BrandDetail({ brand, onBack, onNavigateToRewards }: BrandDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const progress = Math.min((brand.points / brand.nextTierPoints) * 100, 100);

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-3 pt-1">
        <button id="btn-back-brand" onClick={onBack} className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
          <ArrowLeft className="w-4 h-4 text-slate-700" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl">{brand.logo}</div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">{brand.name}</h2>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{brand.category}</span>
          </div>
        </div>
      </div>

      {/* Points card */}
      <div className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg" style={{ background: `linear-gradient(135deg, ${brand.accentColor}dd, ${brand.accentColor})` }}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Current Balance</p>
        <p className="text-4xl font-black tracking-tight mt-1">{brand.points} <span className="text-xl opacity-60">PTS</span></p>
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-bold mb-1.5 opacity-70">
            <span>Tier: <span className="text-white uppercase">{brand.currentTier}</span></span>
            <span>{brand.points}/{brand.nextTierPoints} to next tier</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        {(['overview', 'history'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab === 'overview' ? '✨ Benefits' : '📋 History'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="space-y-2">
            {brand.benefits.map((benefit, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-indigo-600" />
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{benefit}</p>
              </motion.div>
            ))}
          </div>
          <button
            id="btn-go-to-rewards"
            onClick={onNavigateToRewards}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all active:scale-[0.98] shadow-md shadow-indigo-200 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            Redeem Points for Rewards
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-2">
          {brand.pointsHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No history yet</div>
          ) : (
            brand.pointsHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.type === 'earn' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <Award className={`w-4 h-4 ${item.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.description}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock className="w-2.5 h-2.5" />{item.date}</p>
                </div>
                <span className={`text-xs font-bold ${item.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.amount > 0 ? '+' : ''}{item.amount} PTS
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
