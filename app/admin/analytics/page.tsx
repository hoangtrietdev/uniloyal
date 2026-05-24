'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Star, ArrowUpRight, BarChart3, Zap } from 'lucide-react';
import { getAllTransactions } from '@/lib/firebase/firestore';
import { Transaction } from '@/lib/types';
import { INITIAL_BRANDS } from '@/lib/data';

export default function AdminAnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTransactions().then((txs) => {
      setTransactions(txs);
      setLoading(false);
    });
  }, []);

  const totalPts = INITIAL_BRANDS.reduce((a, b) => a + b.points, 0);

  const stats = [
    { label: 'Total Members', value: '18,429', change: '+12.4%', icon: <Users className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50' },
    { label: 'Points Issued', value: `${(totalPts / 1000).toFixed(1)}K`, change: '+8.2%', icon: <Star className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Active Campaigns', value: '7', change: '+2', icon: <Zap className="w-4 h-4 text-violet-600" />, bg: 'bg-violet-50' },
    { label: 'Revenue Impact', value: '₫1.2B', change: '+18.7%', icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Analytics Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">Real-time loyalty program performance</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>{stat.icon}</div>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />{stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Brand breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Brand Points Distribution</h3>
        </div>
        <div className="space-y-3">
          {INITIAL_BRANDS.map((brand) => {
            const pct = Math.round((brand.points / totalPts) * 100);
            return (
              <div key={brand.id}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">{brand.logo} {brand.name}</span>
                  <span className="font-bold text-slate-600">{brand.points} pts · {pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.1 }} className="h-full rounded-full" style={{ backgroundColor: brand.accentColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent transactions from all users */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">All User Activity</h3>
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" /></div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No transactions recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xl">{tx.brandLogo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{tx.brandName}</p>
                  <p className="text-[10px] text-slate-400">{tx.date} {tx.time}</p>
                </div>
                <div className="text-right">
                  {tx.amount > 0 && <p className="text-[10px] text-slate-500">{tx.amount.toLocaleString()}₫</p>}
                  <p className={`text-xs font-bold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'earn' ? '+' : ''}{tx.pointsReceived} PTS
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
