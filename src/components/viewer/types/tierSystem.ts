
export type UserTier = 'rookie' | 'pro' | 'baller';

export interface TierInfo {
  id: UserTier;
  name: string;
  displayName: string;
  price: number;
  color: string;
  icon: string;
  description: string;
  features: string[];
  limitations?: string[];
}

export const TIER_SYSTEM: Record<UserTier, TierInfo> = {
  rookie: {
    id: 'rookie',
    name: 'Rookie',
    displayName: 'Rookie Collector',
    price: 0,
    color: '#6B7280',
    icon: '🌟',
    description: 'Perfect for getting started with card effects',
    features: [
      '4 basic effect presets',
      '3 daily exports',
      'Basic card flip interaction',
      'Community support'
    ],
    limitations: [
      'Watermarked exports',
      'Limited daily exports',
      'Basic presets only'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro Collector',
    price: 5,
    color: '#3B82F6',
    icon: '⚡',
    description: 'Unlock advanced effects and unlimited exports',
    features: [
      'All effect presets unlocked',
      'Unlimited exports',
      'Basic effect controls',
      'No watermarks',
      'Priority email support',
      'Export in multiple formats'
    ]
  },
  baller: {
    id: 'baller',
    name: 'Baller',
    displayName: 'Baller Collector',
    price: 20,
    color: '#F59E0B',
    icon: '👑',
    description: 'Full studio access with advanced customization',
    features: [
      'Complete Studio access',
      'Advanced effect sliders',
      'Custom preset creation',
      'Environment & lighting controls',
      'Material property adjustments',
      '4K exports & transparent backgrounds',
      'Bulk processing',
      'Commercial license',
      'Priority phone support'
    ]
  }
};

export const getTierFeatures = (tier: UserTier) => {
  return TIER_SYSTEM[tier];
};

export const canAccessFeature = (userTier: UserTier, requiredTier: UserTier): boolean => {
  const tierOrder: UserTier[] = ['rookie', 'pro', 'baller'];
  const userIndex = tierOrder.indexOf(userTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
};
