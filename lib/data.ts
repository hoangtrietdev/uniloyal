import { Brand, RewardItem, IntegrationSource, Transaction, CRMAutomationRule, MerchantSettings } from './types';

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'highlands',
    name: 'Highlands Coffee',
    logo: '☕',
    accentColor: '#9C1C26',
    bgGradient: 'from-[#801018] to-[#9C1C26]',
    category: 'F&B',
    points: 420,
    nextTierPoints: 500,
    currentTier: 'GOLD',
    benefits: [
      'Free size upgrade for dynamic hours (2PM-5PM)',
      '10% direct discount on premium espresso lines',
      'Exclusive invitation to premium packaging previews',
      'Double points on birthday week (x2 accumulation)'
    ],
    pointsHistory: [
      { id: 'h1', type: 'earn', amount: 35, description: 'Phin Sữa Đá Premium purchase', date: '2026-05-21' },
      { id: 'h2', type: 'earn', amount: 48, description: 'Freeze Trà Xanh delivery large', date: '2026-05-18' },
      { id: 'h3', type: 'redeem', amount: -50, description: 'Redeemed Free Croissant Butter', date: '2026-05-15' },
      { id: 'h4', type: 'earn', amount: 200, description: 'Welcome Tier Golden bonus points', date: '2026-05-10' }
    ]
  },
  {
    id: 'phuclong',
    name: 'Phúc Long Tea & Coffee',
    logo: '🍃',
    accentColor: '#0E5A34',
    bgGradient: 'from-[#0A3D23] to-[#0E5A34]',
    category: 'F&B',
    points: 850,
    nextTierPoints: 1000,
    currentTier: 'GOLD',
    benefits: [
      'Free toppings on any Signature Tea order',
      'Priority express queue check tại quầy Premium locations',
      'Early access to seasonal autumn beverages',
      'Exclusive voucher 50,000 VND on monthly milestone tier'
    ],
    pointsHistory: [
      { id: 'p1', type: 'earn', amount: 45, description: 'Trà Sữa Phúc Long Extra Pearl', date: '2026-05-22' },
      { id: 'p2', type: 'earn', amount: 80, description: 'Lục Trà Đào large family order', date: '2026-05-19' },
      { id: 'p3', type: 'earn', amount: 120, description: 'Oolong Tea box merchandise gifting', date: '2026-05-14' }
    ]
  },
  {
    id: 'uniqlo',
    name: 'UNIQLO Vietnam',
    logo: '🟥',
    accentColor: '#EE1C25',
    bgGradient: 'from-[#990C11] to-[#EE1C25]',
    category: 'Retail',
    points: 1250,
    nextTierPoints: 1500,
    currentTier: 'DIAMOND',
    benefits: [
      'Free customized embroidery tailoring service offline',
      'Complimentary home delivery on high value orders',
      'Access to exclusive designer collab slots 24h early',
      'Direct 15% VIP discount coupon on monthly shopping spree'
    ],
    pointsHistory: [
      { id: 'u1', type: 'earn', amount: 250, description: 'AIRism Jacket & Linen Shirt set pack', date: '2026-05-20' },
      { id: 'u2', type: 'earn', amount: 600, description: 'Selvedge Slim Fit Denim Collection', date: '2026-05-10' },
      { id: 'u3', type: 'redeem', amount: -300, description: 'Redeemed Shopping Voucher 150K', date: '2026-05-02' }
    ]
  },
  {
    id: 'starbucks',
    name: 'Starbucks Vietnam',
    logo: '💚',
    accentColor: '#00704A',
    bgGradient: 'from-[#004D33] to-[#00704A]',
    category: 'F&B',
    points: 150,
    nextTierPoints: 300,
    currentTier: 'SILVER',
    benefits: [
      'Free beverage on earning cumulative milestones',
      'Birthday reward special customized cake selection',
      'Access to Star member exclusive tumbler merchandise'
    ],
    pointsHistory: [
      { id: 's1', type: 'earn', amount: 50, description: 'Cold Brew Oatmilk Latte Grande', date: '2026-05-22' },
      { id: 's2', type: 'earn', amount: 100, description: 'Summer Glass Mug design limited edition', date: '2026-05-17' }
    ]
  },
  {
    id: 'zara',
    name: 'ZARA Saigon Centre',
    logo: '🖤',
    accentColor: '#1A1A1A',
    bgGradient: 'from-[#0F0F0F] to-[#2B2B2B]',
    category: 'Retail',
    points: 380,
    nextTierPoints: 500,
    currentTier: 'SILVER',
    benefits: [
      'Free standard shipping on all online application lookbooks',
      'Priority fitting rooms checkout skip hours',
      'Access to seasonal clearance secret catalog collections'
    ],
    pointsHistory: [
      { id: 'z1', type: 'earn', amount: 180, description: 'Fitted Blazer Charcoal Grey Line', date: '2026-05-15' },
      { id: 'z2', type: 'earn', amount: 200, description: 'Summer Knit Top & Accessories bundle', date: '2026-05-09' }
    ]
  },
  {
    id: 'annam',
    name: 'Annam Gourmet Market',
    logo: '🧀',
    accentColor: '#6C8E3F',
    bgGradient: 'from-[#4D662D] to-[#6C8E3F]',
    category: 'Supermarket',
    points: 890,
    nextTierPoints: 1000,
    currentTier: 'GOLD',
    benefits: [
      '5% direct checkout on gourmet wine and local cheeses',
      'Exclusive invitations to monthly cheese tasting rooms',
      'Free organic packaging and home delivery selection'
    ],
    pointsHistory: [
      { id: 'a1', type: 'earn', amount: 140, description: 'Artisanal Sourdough & Camembert import', date: '2026-05-21' },
      { id: 'a2', type: 'earn', amount: 450, description: 'New Zealand Sirloin & Red Wine basket', date: '2026-05-12' },
      { id: 'a3', type: 'redeem', amount: -100, description: 'Redeemed Organic Honey Discount', date: '2026-05-05' }
    ]
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew_hl_1', brandId: 'highlands', brandName: 'Highlands Coffee', brandLogo: '☕',
    title: 'Free Large Freeze Green Tea Upgrade', pointsRequired: 100, category: 'F&B',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200', expiryDays: 30
  },
  {
    id: 'rew_hl_2', brandId: 'highlands', brandName: 'Highlands Coffee', brandLogo: '☕',
    title: 'Discount Voucher 50K for bills from 150K+', pointsRequired: 250, category: 'F&B',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200', expiryDays: 45
  },
  {
    id: 'rew_pl_1', brandId: 'phuclong', brandName: 'Phúc Long Tea & Coffee', brandLogo: '🍃',
    title: 'Signature Peach Milk Tea (Large Size)', pointsRequired: 150, category: 'F&B',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=200', expiryDays: 14
  },
  {
    id: 'rew_pl_2', brandId: 'phuclong', brandName: 'Phúc Long Tea & Coffee', brandLogo: '🍃',
    title: 'Free Special Golden Pearl Topping', pointsRequired: 40, category: 'F&B',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=200', expiryDays: 60
  },
  {
    id: 'rew_uq_1', brandId: 'uniqlo', brandName: 'UNIQLO Vietnam', brandLogo: '🟥',
    title: 'UNIQLO Shopping Coupon worth 100,000 VND', pointsRequired: 500, category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=200', expiryDays: 90
  },
  {
    id: 'rew_uq_2', brandId: 'uniqlo', brandName: 'UNIQLO Vietnam', brandLogo: '🟥',
    title: 'Premium Canvas Minimalist Tote Bag 2026', pointsRequired: 400, category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200', expiryDays: 120
  },
  {
    id: 'rew_sb_1', brandId: 'starbucks', brandName: 'Starbucks Vietnam', brandLogo: '💚',
    title: 'Starbucks Reusable Thermo Cup (Green Signature)', pointsRequired: 300, category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=200', expiryDays: 30
  },
  {
    id: 'rew_zr_1', brandId: 'zara', brandName: 'ZARA Saigon Centre', brandLogo: '🖤',
    title: 'E-Voucher 200,000 VND applicable checkout store', pointsRequired: 400, category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200', expiryDays: 30
  },
  {
    id: 'rew_am_1', brandId: 'annam', brandName: 'Annam Gourmet Market', brandLogo: '🧀',
    title: 'Fresh Imported Strawberries Tray 500g', pointsRequired: 350, category: 'F&B',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=200', expiryDays: 7
  }
];

export const INITIAL_INTEGRATIONS: IntegrationSource[] = [
  { id: 'vcb', name: 'Vietcombank (VCB DigiBank)', type: 'bank', logo: '🏦', connected: true, syncing: false, lastSynced: '5 mins ago' },
  { id: 'tcb', name: 'Techcombank (TCB Mobile)', type: 'bank', logo: '🛡️', connected: false, syncing: false },
  { id: 'bidv', name: 'BIDV SmartBanking', type: 'bank', logo: '💎', connected: false, syncing: false },
  { id: 'momo', name: 'MoMo E-Safe Wallet', type: 'wallet', logo: '🌸', connected: true, syncing: false, lastSynced: 'Just now' },
  { id: 'zalopay', name: 'ZaloPay FinTech Wallet', type: 'wallet', logo: '🔵', connected: false, syncing: false }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', brandName: 'Highlands Coffee', brandLogo: '☕', amount: 59000, pointsReceived: 6, date: '2026-05-22', time: '14:32', type: 'earn' },
  { id: 'tx2', brandName: 'Phúc Long Tea & Coffee', brandLogo: '🍃', amount: 89000, pointsReceived: 9, date: '2026-05-22', time: '11:15', type: 'earn' },
  { id: 'tx3', brandName: 'UNIQLO Vietnam', brandLogo: '🟥', amount: 1499000, pointsReceived: 150, date: '2026-05-21', time: '19:40', type: 'earn' },
  { id: 'tx4', brandName: 'Annam Gourmet Market', brandLogo: '🧀', amount: 480000, pointsReceived: 48, date: '2026-05-21', time: '16:05', type: 'earn' },
  { id: 'tx5', brandName: 'Highlands Coffee', brandLogo: '☕', amount: 0, pointsReceived: -50, date: '2026-05-20', time: '08:45', type: 'redeem' },
  { id: 'tx6', brandName: 'ZARA Saigon Centre', brandLogo: '🖤', amount: 990000, pointsReceived: 99, date: '2026-05-19', time: '15:20', type: 'earn' },
];

export const INITIAL_CRM_RULES: CRMAutomationRule[] = [
  { id: 'crm_1', name: 'Re-engage Inactive Customers', trigger: 'CUSTOMER_INACTIVE_30_DAYS', condition: 'IF Tier = ALL & DaysInactive >= 30', action: 'SEND_VOUCHER_50K', status: 'active', timesTriggered: 148 },
  { id: 'crm_2', name: 'Birthday Week Gift Voucher', trigger: 'CUSTOMER_BIRTHDAY_WEEK', condition: 'IF Tier = GOLD | DIAMOND', action: 'ADD_200_LOYALTY_POINTS', status: 'active', timesTriggered: 320 },
  { id: 'crm_3', name: 'Upgrade Reward Trigger', trigger: 'TIER_UPGRADE', condition: 'IF Tier upgrades to DIAMOND', action: 'SEND_E_VOUCHER_200K', status: 'active', timesTriggered: 45 },
  { id: 'crm_4', name: 'Weekend Coffee Treat Push', trigger: 'WEEKEND_RUSH_F_B', condition: 'IF Category = F&B & VisitedCount >= 5', action: 'SEND_FREE_TOPPING_ACCENT', status: 'inactive', timesTriggered: 0 }
];

export const DEFAULT_MERCHANT_SETTINGS: MerchantSettings = {
  pointsToCashRate: 10000,
  silverThreshold: 0,
  goldThreshold: 500,
  diamondThreshold: 1200
};
