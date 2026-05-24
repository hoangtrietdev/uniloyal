'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Trash2, Power, PowerOff, Bot } from 'lucide-react';
import { CRMAutomationRule } from '@/lib/types';
import { subscribeToCRMRules, addCRMRule, updateCRMRule, deleteCRMRule } from '@/lib/firebase/firestore';
import { INITIAL_CRM_RULES } from '@/lib/data';
import { groq, GROQ_MODEL } from '@/lib/groq';

export default function AdminCRMPage() {
  const [rules, setRules] = useState<CRMAutomationRule[]>(INITIAL_CRM_RULES);
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', trigger: '', condition: '', action: '' });
  const [adding, setAdding] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    void subscribeToCRMRules((firestoreRules) => {
      if (firestoreRules.length > 0) setRules(firestoreRules);
    }).then((dispose) => {
      unsubscribe = dispose;
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = async (rule: CRMAutomationRule) => {
    const newStatus = rule.status === 'active' ? 'inactive' : 'active';
    setRules(prev => prev.map(r => r.id === rule.id ? { ...r, status: newStatus } : r));
    await updateCRMRule(rule.id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    await deleteCRMRule(id);
  };

  const handleAdd = async () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) return;
    setAdding(true);
    const rule: Omit<CRMAutomationRule, 'id'> = { ...newRule, status: 'active', timesTriggered: 0 };
    await addCRMRule(rule);
    setNewRule({ name: '', trigger: '', condition: '', action: '' });
    setShowAdd(false);
    setAdding(false);
  };

  const handleAISuggest = async () => {
    setLoadingAI(true);
    try {
      if (!groq) {
        setAiSuggestion('💡 AI suggestion (GROQ_API_KEY not set): "Re-engage customers who haven\'t visited in 14 days with a 20% discount voucher for their favourite brand."');
        return;
      }
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are a CRM automation expert for a loyalty program. Suggest ONE concise, specific, actionable CRM automation rule in 1-2 sentences. Format as: Rule Name: [name] | Trigger: [event] | Action: [action].' },
          { role: 'user', content: 'Suggest a new CRM automation rule for a coffee + retail loyalty program in Vietnam.' },
        ],
        max_tokens: 150,
      });
      setAiSuggestion('💡 ' + (completion.choices[0]?.message?.content ?? 'Could not generate suggestion.'));
    } catch {
      setAiSuggestion('💡 AI unavailable. Try: "Send a weekend F&B double-points push to Gold-tier customers who haven\'t visited in 7 days."');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">CRM Automation</h2>
          <p className="text-sm text-slate-500 mt-0.5">Automated loyalty engagement rules</p>
        </div>
        <button
          id="btn-add-crm-rule"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Rule
        </button>
      </div>

      {/* AI suggestion */}
      <div className="bg-linear-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Rule Advisor (Groq)</h3>
          </div>
          <button id="btn-ai-suggest" onClick={handleAISuggest} disabled={loadingAI} className="text-[10px] font-bold text-violet-600 hover:text-violet-700 bg-white border border-violet-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
            {loadingAI ? 'Thinking...' : '✨ Suggest Rule'}
          </button>
        </div>
        {aiSuggestion && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-slate-700 leading-relaxed bg-white/60 rounded-xl p-3 border border-violet-100 font-medium">
            {aiSuggestion}
          </motion.div>
        )}
        {!aiSuggestion && <p className="text-[10px] text-slate-400">Click &quot;Suggest Rule&quot; to get an AI-powered CRM rule recommendation.</p>}
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        <AnimatePresence>
          {rules.map((rule, i) => (
            <motion.div key={rule.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${rule.status === 'active' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                    <Zap className={`w-4 h-4 ${rule.status === 'active' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">{rule.name}</p>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${rule.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {rule.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1"><span className="font-bold text-slate-600">Trigger:</span> {rule.trigger}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5"><span className="font-bold text-slate-600">Condition:</span> {rule.condition}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5"><span className="font-bold text-slate-600">Action:</span> {rule.action}</p>
                    <p className="text-[10px] text-indigo-600 font-bold mt-1">🔁 Triggered {rule.timesTriggered}× total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button id={`btn-toggle-crm-${rule.id}`} onClick={() => handleToggle(rule)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${rule.status === 'active' ? 'bg-emerald-50 hover:bg-rose-50 text-emerald-600 hover:text-rose-600' : 'bg-slate-100 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'}`}>
                    {rule.status === 'active' ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                  </button>
                  <button id={`btn-delete-crm-${rule.id}`} onClick={() => handleDelete(rule.id)} className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add rule modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900">New CRM Automation Rule</h3>
              {[
                { key: 'name', label: 'Rule Name', placeholder: 'e.g., Re-engage Inactive Customers' },
                { key: 'trigger', label: 'Trigger Event', placeholder: 'e.g., CUSTOMER_INACTIVE_30_DAYS' },
                { key: 'condition', label: 'Condition', placeholder: 'e.g., IF Tier = GOLD & DaysInactive >= 30' },
                { key: 'action', label: 'Action', placeholder: 'e.g., SEND_VOUCHER_50K' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                  <input
                    id={`input-crm-${field.key}`}
                    value={newRule[field.key as keyof typeof newRule]}
                    onChange={(e) => setNewRule(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button id="btn-confirm-add-rule" onClick={handleAdd} disabled={adding} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                  {adding ? 'Adding...' : 'Add Rule'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
