'use client';

import { useState, useEffect } from 'react';
import { Save, Sliders } from 'lucide-react';
import { getMerchantSettings, saveMerchantSettings } from '@/lib/firebase/firestore';
import { MerchantSettings } from '@/lib/types';
import { DEFAULT_MERCHANT_SETTINGS, INITIAL_BRANDS } from '@/lib/data';

export default function AdminLoyaltyPage() {
  const [settings, setSettings] = useState<MerchantSettings>(DEFAULT_MERCHANT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchantSettings().then((s) => { setSettings(s); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await saveMerchantSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" /></div>;

  const tiers = [
    { key: 'silverThreshold' as const, label: 'Silver Tier Threshold', color: 'text-slate-500', bg: 'bg-slate-100', desc: 'Points needed to achieve Silver status' },
    { key: 'goldThreshold' as const, label: 'Gold Tier Threshold', color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Points needed to achieve Gold status' },
    { key: 'diamondThreshold' as const, label: 'Diamond Tier Threshold', color: 'text-cyan-600', bg: 'bg-cyan-50', desc: 'Points needed to achieve Diamond status' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Loyalty Rule Setup</h2>
          <p className="text-sm text-slate-500 mt-0.5">Configure points, tiers, and merchant settings</p>
        </div>
        <button
          id="btn-save-loyalty"
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Points rate */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Points Conversion Rate</h3>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">VND per Point</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              id="input-pts-rate"
              type="number"
              value={settings.pointsToCashRate}
              onChange={(e) => setSettings(prev => ({ ...prev, pointsToCashRate: Number(e.target.value) }))}
              className="w-32 px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-500 font-medium">₫ / 1 PTS</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Example: 100 pts = {(100 * settings.pointsToCashRate).toLocaleString()} ₫ value</p>
        </div>
      </div>

      {/* Tier thresholds */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Tier Thresholds</h3>
        <div className="space-y-4">
          {tiers.map((tier) => (
            <div key={tier.key}>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{tier.label}</label>
              <p className="text-[10px] text-slate-400 mb-2">{tier.desc}</p>
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full ${tier.bg} flex items-center justify-center`}>
                  <span className={`text-xs font-black ${tier.color}`}>★</span>
                </div>
                <input
                  id={`input-tier-${tier.key}`}
                  type="number"
                  value={settings[tier.key]}
                  onChange={(e) => setSettings(prev => ({ ...prev, [tier.key]: Number(e.target.value) }))}
                  className="w-36 px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-500">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand cards status */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Brand Cards Status</h3>
        <div className="space-y-3">
          {INITIAL_BRANDS.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{brand.logo}</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{brand.name}</p>
                  <p className="text-[9px] text-slate-400">{brand.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900">{brand.points} pts</span>
                <p className="text-[9px] font-bold" style={{ color: brand.accentColor }}>{brand.currentTier}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
