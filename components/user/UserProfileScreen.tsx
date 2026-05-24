'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit3, Check, LogOut } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export default function UserProfileScreen({ user, onUpdateUser }: UserProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone, address: user.address, occupation: user.occupation ?? '' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    const updated: UserProfile = { ...user, ...form };
    onUpdateUser(updated);
    setEditing(false);
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="space-y-5 px-4 pt-3 text-slate-800">
      {/* Avatar section */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative">
          <Image
            src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'}
            alt={user.name}
            width={72} height={72}
            className="w-18 h-18 rounded-full border-4 border-indigo-100 shadow-md object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <div className="text-center">
          <h2 className="text-base font-extrabold text-slate-900">{user.name}</h2>
          <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
          <span className="mt-1 inline-block text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{user.vipCode}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm">
          <p className="text-lg font-black text-indigo-600">Gold</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm">
          <p className="text-lg font-black text-slate-900">{user.memberSince.slice(0, 4)}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Member Since</p>
        </div>
      </div>

      {/* Profile fields */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Profile Information</p>
          <button onClick={() => setEditing(!editing)} className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            <Edit3 className="w-3 h-3" />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { icon: <User className="w-3.5 h-3.5" />, label: 'Full Name', key: 'name', value: form.name },
            { icon: <Mail className="w-3.5 h-3.5" />, label: 'Email', key: null, value: user.email },
            { icon: <Phone className="w-3.5 h-3.5" />, label: 'Phone', key: 'phone', value: form.phone },
            { icon: <MapPin className="w-3.5 h-3.5" />, label: 'Address', key: 'address', value: form.address },
            { icon: <Briefcase className="w-3.5 h-3.5" />, label: 'Occupation', key: 'occupation', value: form.occupation },
          ].map((field) => (
            <div key={field.label} className="flex items-start gap-3 px-4 py-3">
              <div className="text-indigo-500 mt-0.5 shrink-0">{field.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{field.label}</p>
                {editing && field.key ? (
                  <input
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm(prev => ({ ...prev, [field.key!]: e.target.value }))}
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{field.value || '—'}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="p-4 border-t border-slate-100">
            <button
              id="btn-save-profile"
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              {saving ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        id="btn-logout"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-2xl transition-all cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign Out
      </button>
    </div>
  );
}
