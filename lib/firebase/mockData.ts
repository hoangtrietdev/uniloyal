import { INITIAL_BRANDS, INITIAL_CRM_RULES, INITIAL_INTEGRATIONS, INITIAL_TRANSACTIONS, DEFAULT_MERCHANT_SETTINGS } from '../data';
import { UserProfile } from '../types';

export const LOCAL_SESSION_KEY = 'uniloyal.supabase.mock-session';

export interface MockAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: 'user-1',
    email: 'user1@uniloyal.local',
    password: 'user123',
    name: 'User One',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    isAdmin: false,
  },
  {
    id: 'admin-1',
    email: 'admin1@uniloyal.local',
    password: 'admin123',
    name: 'Admin One',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    isAdmin: true,
  },
];

export function buildMockProfile(account: MockAccount): UserProfile {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: '',
    avatar: account.avatar,
    memberSince: account.isAdmin ? '2025-11-01' : '2026-01-12',
    vipCode: account.isAdmin ? 'UL-9001-ADMIN' : 'UL-2048-GOLD',
    address: '',
    occupation: account.isAdmin ? 'Operations Manager' : 'Member',
    isAdmin: account.isAdmin,
  };
}

export function createMockUserRecord(account: MockAccount) {
  return {
    profile: buildMockProfile(account),
    brands: JSON.parse(JSON.stringify(INITIAL_BRANDS)),
    transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)),
    integrations: JSON.parse(JSON.stringify(INITIAL_INTEGRATIONS)),
  };
}

export function createMockMerchantState() {
  return {
    settings: JSON.parse(JSON.stringify(DEFAULT_MERCHANT_SETTINGS)),
    crmRules: JSON.parse(JSON.stringify(INITIAL_CRM_RULES)),
  };
}
