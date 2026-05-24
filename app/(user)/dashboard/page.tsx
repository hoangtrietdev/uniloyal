'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserData } from '@/lib/hooks/useUserData';
import { Brand, Transaction, RewardItem } from '@/lib/types';
import { INITIAL_REWARDS } from '@/lib/data';
import CustomerDashboard from '@/components/user/CustomerDashboard';
import BrandDetail from '@/components/user/BrandDetail';
import RewardCenter from '@/components/user/RewardCenter';
import { NotificationWrapper } from '@/components/ui/Notification';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { brands, transactions, profile, loading, saveBrands, saveTransaction } = useUserData(user?.id ?? null);

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [nfcActive, setNfcActive] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleNfcTrigger = async () => {
    const targetBrandId = 'highlands';
    const bonus = 25;

    const updatedBrands = brands.map((b) => {
      if (b.id === targetBrandId) {
        const newPts = b.points + bonus;
        // CRM rule check
        if (b.currentTier !== 'DIAMOND' && newPts >= b.nextTierPoints) {
          showNotification('🚀 CRM Triggered: Tier upgrade rewards issued!', 'success');
        }
        return {
          ...b,
          points: newPts,
          pointsHistory: [
            { id: `ps_${Date.now()}`, type: 'earn' as const, amount: bonus, description: 'NFC tap-to-earn contactless credit', date: new Date().toISOString().split('T')[0] },
            ...b.pointsHistory,
          ],
        };
      }
      return b;
    });

    await saveBrands(updatedBrands);

    const newTx: Transaction = {
      id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
      brandName: 'Highlands Coffee',
      brandLogo: '☕',
      amount: 0,
      pointsReceived: bonus,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      type: 'earn',
    };
    await saveTransaction(newTx);
    showNotification('📡 NFC Connection Successful! +25 Highlands Coffee points.');
  };

  const handleRedeemReward = async (reward: RewardItem) => {
    const relatedBrand = brands.find((b) => b.id === reward.brandId);
    if (!relatedBrand) return { success: false, message: 'Brand not found.' };
    if (relatedBrand.points < reward.pointsRequired) {
      return { success: false, message: `Insufficient points. You have ${relatedBrand.points} pts.` };
    }

    const updatedBrands = brands.map((b) => {
      if (b.id === reward.brandId) {
        return {
          ...b,
          points: b.points - reward.pointsRequired,
          pointsHistory: [
            { id: `ps_${Date.now()}`, type: 'redeem' as const, amount: -reward.pointsRequired, description: `Redeemed: ${reward.title}`, date: new Date().toISOString().split('T')[0] },
            ...b.pointsHistory,
          ],
        };
      }
      return b;
    });

    await saveBrands(updatedBrands);
    const tx: Transaction = {
      id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
      brandName: reward.brandName,
      brandLogo: reward.brandLogo,
      amount: 0,
      pointsReceived: reward.pointsRequired,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      type: 'redeem',
    };
    await saveTransaction(tx);
    showNotification(`🎟️ Voucher for ${reward.brandName} generated!`);
    return { success: true, message: `Redeemed "${reward.title}" successfully!` };
  };

  const handleQuickAddBrand = () => {
    showNotification('🔍 Searching regional partners...', 'info');
    setTimeout(() => showNotification('✅ Brand membership detected!'), 1200);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const userProfile = profile ?? {
    id: user?.id ?? '',
    name: user?.name ?? 'UniLoyal Member',
    email: user?.email ?? '',
    phone: '',
    avatar: user?.avatar ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    memberSince: new Date().toISOString().split('T')[0],
    vipCode: 'UL-0000-GOLD',
    address: '',
  };

  return (
    <div className="relative">
      <div className="px-4 pt-3 pb-4 space-y-4">
        {selectedBrand ? (
          <BrandDetail
            brand={brands.find((b) => b.id === selectedBrand.id) || selectedBrand}
            onBack={() => setSelectedBrand(null)}
            onNavigateToRewards={() => setShowRewards(true)}
          />
        ) : (
          <CustomerDashboard
            brands={brands}
            onSelectBrand={setSelectedBrand}
            transactions={transactions}
            onTriggerNfc={handleNfcTrigger}
            nfcActive={nfcActive}
            setNfcActive={setNfcActive}
            onQuickAddBrand={handleQuickAddBrand}
            user={userProfile}
          />
        )}
      </div>

      {/* Rewards modal */}
      <AnimatePresence>
        {showRewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex flex-col justify-end pointer-events-auto rounded-[32px] overflow-hidden"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full bg-slate-50 border-t border-slate-200 rounded-t-2xl max-h-[85%] overflow-y-auto p-4 space-y-4 pb-12 shadow-2xl scrollbar-none"
            >
              <div className="flex items-center justify-between sticky top-0 bg-slate-50 z-30 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 pt-1">
                  <Gift className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-bold uppercase text-slate-800 tracking-wider">Claim Brand Perks</span>
                </div>
                <button
                  id="btn-close-rewards-modal"
                  onClick={() => setShowRewards(false)}
                  className="w-6 h-6 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs cursor-pointer"
                >✕</button>
              </div>
              <RewardCenter rewards={INITIAL_REWARDS} brands={brands} onRedeemReward={handleRedeemReward} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationWrapper notification={notification} />
    </div>
  );
}
