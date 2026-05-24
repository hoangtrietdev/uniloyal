'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { IntegrationSource, Transaction } from '@/lib/types';

interface IntegrationsScreenProps {
  integrations: IntegrationSource[];
  onToggleIntegration: (id: string, connected: boolean) => void;
  transactions: Transaction[];
}

export default function IntegrationsScreen({ integrations, onToggleIntegration, transactions }: IntegrationsScreenProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleToggle = async (id: string, connected: boolean) => {
    setConnecting(id);
    await new Promise(r => setTimeout(r, 800));
    onToggleIntegration(id, connected);
    setConnecting(null);
  };

  const banks = integrations.filter(i => i.type === 'bank');
  const wallets = integrations.filter(i => i.type === 'wallet');

  return (
    <div className="space-y-5 px-4 pt-3 text-slate-800">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Integrations & Record</h2>
        <p className="text-[10px] text-slate-400 mt-0.5">Link your bank accounts and wallets to auto-earn points.</p>
      </div>

      {/* Banks */}
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">🏦 Bank Accounts</p>
        <div className="space-y-2">
          {banks.map((item) => (
            <IntegrationCard key={item.id} item={item} connecting={connecting === item.id} onToggle={handleToggle} />
          ))}
        </div>
      </div>

      {/* Wallets */}
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">💳 Digital Wallets</p>
        <div className="space-y-2">
          {wallets.map((item) => (
            <IntegrationCard key={item.id} item={item} connecting={connecting === item.id} onToggle={handleToggle} />
          ))}
        </div>
      </div>

      {/* Transaction ledger */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">📋 Transaction Ledger</p>
          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live
          </span>
        </div>
        <div className="space-y-1.5">
          {transactions.slice(0, 8).map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-100">
              <span className="text-base">{tx.brandLogo}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{tx.brandName}</p>
                <p className="text-[9px] text-slate-400">{tx.date} · {tx.time}</p>
              </div>
              <div className="text-right">
                {tx.amount > 0 && <p className="text-[10px] text-slate-500">{tx.amount.toLocaleString()}₫</p>}
                <p className={`text-xs font-bold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'earn' ? '+' : ''}{tx.pointsReceived} PTS
                </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No transactions yet. Link a bank account or use NFC tap!</p>
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ item, connecting, onToggle }: {
  item: IntegrationSource;
  connecting: boolean;
  onToggle: (id: string, connected: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0">{item.logo}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
        <p className={`text-[9px] font-bold flex items-center gap-1 mt-0.5 ${item.connected ? 'text-emerald-600' : 'text-slate-400'}`}>
          {item.connected ? (
            <><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" /> Connected · {item.lastSynced}</>
          ) : 'Not connected'}
        </p>
      </div>
      <button
        id={`btn-integration-${item.id}`}
        onClick={() => onToggle(item.id, item.connected)}
        disabled={connecting}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${item.connected ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'} ${connecting ? 'opacity-50' : ''}`}
      >
        {connecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : item.connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}
