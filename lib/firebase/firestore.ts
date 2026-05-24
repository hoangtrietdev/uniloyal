import {
  Brand,
  Transaction,
  UserProfile,
  MerchantSettings,
  CRMAutomationRule,
  IntegrationSource,
} from '../types';
import { INITIAL_BRANDS, INITIAL_INTEGRATIONS, INITIAL_TRANSACTIONS } from '../data';
import { getSupabaseClient } from './supabase';
import { createMockMerchantState, createMockUserRecord, MOCK_ACCOUNTS } from './mockData';
import { syncSessionUser } from './auth';

type UserRecord = {
  profile: UserProfile;
  brands: Brand[];
  transactions: Transaction[];
  integrations: IntegrationSource[];
};

export type UserDataRecord = UserRecord;

const mockUserRecords = new Map<string, UserRecord>(
  MOCK_ACCOUNTS.map((account) => [account.id, createMockUserRecord(account)] as const)
);

const mockMerchantState = createMockMerchantState();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function getFallbackUserRecord(uid: string): UserRecord {
  if (!mockUserRecords.has(uid)) {
    mockUserRecords.set(uid, {
      profile: {
        id: uid,
        name: 'UniLoyal Member',
        email: '',
        phone: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
        memberSince: new Date().toISOString().split('T')[0],
        vipCode: 'UL-0000-GOLD',
        address: '',
      },
      brands: clone(INITIAL_BRANDS),
      transactions: clone(INITIAL_TRANSACTIONS),
      integrations: clone(INITIAL_INTEGRATIONS),
    });
  }

  return mockUserRecords.get(uid)!;
}

export async function getUserDataRecord(uid: string): Promise<UserDataRecord | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id,name,email,phone,avatar,member_since,vip_code,address,occupation,is_admin,brands,transactions,integrations')
    .eq('id', uid)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    profile: {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone ?? '',
      avatar: data.avatar,
      memberSince: data.member_since,
      vipCode: data.vip_code,
      address: data.address ?? '',
      occupation: data.occupation ?? undefined,
      isAdmin: Boolean(data.is_admin),
    },
    brands: (data.brands as Brand[]) ?? clone(INITIAL_BRANDS),
    transactions: (data.transactions as Transaction[]) ?? [],
    integrations: (data.integrations as IntegrationSource[]) ?? clone(INITIAL_INTEGRATIONS),
  };
}

async function upsertRemoteUserRecord(uid: string, data: Partial<UserProfile>) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const existing = await getUserDataRecord(uid);
  const baseProfile = existing?.profile ?? {
    id: uid,
    name: 'UniLoyal Member',
    email: '',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    memberSince: new Date().toISOString().split('T')[0],
    vipCode: `UL-${Math.floor(1000 + Math.random() * 9000)}-GOLD`,
    address: '',
  };

  const profile: UserProfile = {
    ...baseProfile,
    ...data,
    id: uid,
    name: data.name ?? baseProfile.name,
    email: data.email ?? baseProfile.email,
    phone: data.phone ?? baseProfile.phone,
    avatar: data.avatar ?? baseProfile.avatar,
    memberSince: data.memberSince ?? baseProfile.memberSince,
    vipCode: data.vipCode ?? baseProfile.vipCode,
    address: data.address ?? baseProfile.address,
    occupation: data.occupation ?? baseProfile.occupation,
    isAdmin: data.isAdmin ?? baseProfile.isAdmin,
  };

  await supabase.from('user_profiles').upsert({
    id: uid,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    avatar: profile.avatar,
    member_since: profile.memberSince,
    vip_code: profile.vipCode,
    address: profile.address,
    occupation: profile.occupation ?? null,
    is_admin: Boolean(profile.isAdmin),
    brands: existing?.brands ?? clone(INITIAL_BRANDS),
    transactions: existing?.transactions ?? [],
    integrations: existing?.integrations ?? clone(INITIAL_INTEGRATIONS),
  });

  syncSessionUser({
    id: uid,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    isAdmin: Boolean(profile.isAdmin),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const remoteRecord = await getUserDataRecord(uid);
  if (remoteRecord) {
    return remoteRecord.profile;
  }

  return getFallbackUserRecord(uid).profile;
}

export async function createOrUpdateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const remoteRecord = await getUserDataRecord(uid);
  if (remoteRecord || getSupabaseClient()) {
    await upsertRemoteUserRecord(uid, data);
    return;
  }

  const record = getFallbackUserRecord(uid);
  record.profile = {
    ...record.profile,
    ...data,
    id: uid,
  };
  syncSessionUser({
    id: uid,
    name: record.profile.name,
    email: record.profile.email,
    avatar: record.profile.avatar,
    isAdmin: Boolean(record.profile.isAdmin),
  });
}

export async function subscribeToUserData(
  uid: string,
  callback: (data: { brands: Brand[]; transactions: Transaction[]; integrations: IntegrationSource[]; profile: UserProfile }) => void
): Promise<() => void> {
  const remoteRecord = await getUserDataRecord(uid);
  if (remoteRecord) {
    callback(remoteRecord);
    return () => undefined;
  }

  const record = getFallbackUserRecord(uid);
  callback(record);
  return () => undefined;
}

export async function updateUserBrands(uid: string, brands: Brand[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('user_profiles').update({ brands }).eq('id', uid);
    return;
  }

  getFallbackUserRecord(uid).brands = clone(brands);
}

export async function addTransaction(uid: string, tx: Transaction): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const current = await getUserDataRecord(uid);
    const transactions = [tx, ...(current?.transactions ?? [])];
    await supabase.from('user_profiles').update({ transactions }).eq('id', uid);
    return;
  }

  const record = getFallbackUserRecord(uid);
  record.transactions = [tx, ...record.transactions];
}

export async function updateIntegrations(uid: string, integrations: IntegrationSource[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('user_profiles').update({ integrations }).eq('id', uid);
    return;
  }

  getFallbackUserRecord(uid).integrations = clone(integrations);
}

export async function isUserAdmin(uid: string): Promise<boolean> {
  const remoteRecord = await getUserDataRecord(uid);
  if (remoteRecord) {
    return Boolean(remoteRecord.profile.isAdmin);
  }

  const fallback = mockUserRecords.get(uid);
  return Boolean(fallback?.profile.isAdmin);
}

export async function getMerchantSettings(): Promise<MerchantSettings> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from('merchant_settings').select('points_to_cash_rate,silver_threshold,gold_threshold,diamond_threshold').eq('id', 'uniloyal').maybeSingle();
    if (data) {
      return {
        pointsToCashRate: data.points_to_cash_rate,
        silverThreshold: data.silver_threshold,
        goldThreshold: data.gold_threshold,
        diamondThreshold: data.diamond_threshold,
      };
    }
  }

  return mockMerchantState.settings;
}

export async function saveMerchantSettings(settings: MerchantSettings): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('merchant_settings').upsert({
      id: 'uniloyal',
      points_to_cash_rate: settings.pointsToCashRate,
      silver_threshold: settings.silverThreshold,
      gold_threshold: settings.goldThreshold,
      diamond_threshold: settings.diamondThreshold,
    });
    return;
  }

  mockMerchantState.settings = clone(settings);
}

export async function subscribeToCRMRules(callback: (rules: CRMAutomationRule[]) => void): Promise<() => void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from('crm_rules').select('*').order('created_at', { ascending: true });
    callback((data ?? []).map((rule) => ({
      id: rule.id,
      name: rule.name,
      trigger: rule.trigger,
      condition: rule.condition,
      action: rule.action,
      status: rule.status,
      timesTriggered: rule.times_triggered,
    })));
    return () => undefined;
  }

  callback(mockMerchantState.crmRules);
  return () => undefined;
}

export async function addCRMRule(rule: Omit<CRMAutomationRule, 'id'>): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('crm_rules').insert({
      name: rule.name,
      trigger: rule.trigger,
      condition: rule.condition,
      action: rule.action,
      status: rule.status,
      times_triggered: rule.timesTriggered,
    });
    return;
  }

  mockMerchantState.crmRules = [
    ...mockMerchantState.crmRules,
    { ...rule, id: `crm_${Date.now()}` },
  ];
}

export async function updateCRMRule(id: string, data: Partial<CRMAutomationRule>): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('crm_rules').update({
      name: data.name,
      trigger: data.trigger,
      condition: data.condition,
      action: data.action,
      status: data.status,
      times_triggered: data.timesTriggered,
    }).eq('id', id);
    return;
  }

  mockMerchantState.crmRules = mockMerchantState.crmRules.map((rule) => (rule.id === id ? { ...rule, ...data } : rule));
}

export async function deleteCRMRule(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('crm_rules').delete().eq('id', id);
    return;
  }

  mockMerchantState.crmRules = mockMerchantState.crmRules.filter((rule) => rule.id !== id);
}

export async function getAllTransactions(): Promise<(Transaction & { userName?: string })[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from('user_profiles').select('name,transactions');
    const allTxs: (Transaction & { userName?: string })[] = [];

    (data ?? []).forEach((row) => {
      const txs = (row.transactions as Transaction[] | null | undefined) ?? [];
      txs.forEach((tx) => {
        allTxs.push({ ...tx, userName: row.name });
      });
    });

    return allTxs.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }

  const allTxs: (Transaction & { userName?: string })[] = [];
  mockUserRecords.forEach((record) => {
    record.transactions.forEach((tx) => {
      allTxs.push({ ...tx, userName: record.profile.name });
    });
  });

  return allTxs.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
