'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useUserData } from '@/lib/hooks/useUserData';
import IntegrationsScreen from '@/components/user/IntegrationsScreen';
import { IntegrationSource } from '@/lib/types';

export default function IntegrationsPage() {
  const { user } = useAuth();
  const { integrations, transactions, loading, saveIntegrations } = useUserData(user?.id ?? null);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" /></div>;

  const handleToggle = async (id: string, connected: boolean) => {
    const updated = integrations.map((i): IntegrationSource =>
      i.id === id
        ? { ...i, connected: !connected, syncing: false, lastSynced: !connected ? 'Just now' : undefined }
        : i
    );
    await saveIntegrations(updated);
  };

  return <IntegrationsScreen integrations={integrations} transactions={transactions} onToggleIntegration={handleToggle} />;
}
