'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag } from 'lucide-react';
import { Brand, RewardItem } from '@/lib/types';
import Image from 'next/image';

interface RewardCenterProps {
  rewards: RewardItem[];
  brands: Brand[];
  onRedeemReward: (reward: RewardItem) => Promise<{ success: boolean; message: string }>;
}

export default function RewardCenter({ rewards, brands, onRedeemReward }: RewardCenterProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'F&B' | 'Shopping'>('All');
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string; success: boolean } | null>(null);

  const filtered = activeFilter === 'All' ? rewards : rewards.filter(r => r.category === activeFilter);

  const handleRedeem = async (reward: RewardItem) => {
    setRedeeming(reward.id);
    const result = await onRedeemReward(reward);
    setFeedback({ id: reward.id, message: result.message, success: result.success });
    setTimeout(() => setFeedback(null), 3000);
    setRedeeming(null);
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-1.5">
        {(['All', 'F&B', 'Shopping'] as const).map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${activeFilter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'text-slate-500 border-slate-200 bg-white hover:border-indigo-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Rewards grid */}
      <div className="space-y-3">
        {filtered.map((reward) => {
          const brand = brands.find(b => b.id === reward.brandId);
          const canAfford = brand ? brand.points >= reward.pointsRequired : false;
          const isRedeeming = redeeming === reward.id;
          const fb = feedback?.id === reward.id ? feedback : null;

          return (
            <motion.div key={reward.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex gap-3 p-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                  <Image src={reward.image} alt={reward.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{reward.brandLogo}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{reward.brandName}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{reward.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5"><Tag className="w-2.5 h-2.5" />{reward.pointsRequired} pts</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />Exp: {reward.expiryDays}d</span>
                  </div>
                  {fb && (
                    <p className={`text-[10px] font-semibold ${fb.success ? 'text-emerald-600' : 'text-rose-600'}`}>{fb.message}</p>
                  )}
                </div>
              </div>
              <div className="px-3 pb-3">
                <button
                  id={`btn-redeem-${reward.id}`}
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford || isRedeeming}
                  className={`w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${canAfford ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  {isRedeeming ? 'Processing...' : canAfford ? `Redeem — ${reward.pointsRequired} PTS` : `Need ${brand ? reward.pointsRequired - brand.points : reward.pointsRequired} more PTS`}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
