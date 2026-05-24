export type Tier = 'SILVER' | 'GOLD' | 'DIAMOND';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  accentColor: string;
  bgGradient: string;
  category: 'F&B' | 'Retail' | 'Supermarket';
  points: number;
  nextTierPoints: number;
  currentTier: Tier;
  pointsHistory: PointsHistoryItem[];
  benefits: string[];
}

export interface PointsHistoryItem {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  date: string;
}

export interface RewardItem {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  pointsRequired: number;
  category: 'F&B' | 'Shopping' | 'Entertainment' | 'All';
  image: string;
  expiryDays: number;
}

export interface IntegrationSource {
  id: string;
  name: string;
  type: 'bank' | 'wallet';
  logo: string;
  connected: boolean;
  syncing: boolean;
  lastSynced?: string;
}

export interface Transaction {
  id: string;
  brandName: string;
  brandLogo: string;
  amount: number;
  pointsReceived: number;
  date: string;
  time: string;
  type: 'earn' | 'redeem';
}

export interface CRMAutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'active' | 'inactive';
  timesTriggered: number;
}

export interface MerchantSettings {
  pointsToCashRate: number;
  silverThreshold: number;
  goldThreshold: number;
  diamondThreshold: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  vipCode: string;
  address: string;
  occupation?: string;
  isAdmin?: boolean;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'info';
}
