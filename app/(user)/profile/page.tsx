'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useUserData } from '@/lib/hooks/useUserData';
import UserProfileScreen from '@/components/user/UserProfileScreen';
import { UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, saveProfile } = useUserData(user?.id ?? null);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" /></div>;

  const userProfile: UserProfile = profile ?? {
    id: user?.id ?? '',
    name: user?.name ?? 'UniLoyal Member',
    email: user?.email ?? '',
    phone: '',
    avatar: user?.avatar ?? '',
    memberSince: new Date().toISOString().split('T')[0],
    vipCode: 'UL-0000-GOLD',
    address: '',
  };

  const handleUpdateUser = async (updated: UserProfile) => {
    await saveProfile(updated);
  };

  return <UserProfileScreen user={userProfile} onUpdateUser={handleUpdateUser} />;
}
