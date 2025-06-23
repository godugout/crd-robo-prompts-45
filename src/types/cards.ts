
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type CardVisibility = 'private' | 'public' | 'shared';

export interface CreatorAttribution {
  creator_name?: string;
  creator_id?: string;
  collaboration_type?: 'solo' | 'collaboration' | 'commission';
  additional_credits?: Array<{
    name: string;
    role: string;
  }>;
}

export interface PublishingOptions {
  marketplace_listing: boolean;
  crd_catalog_inclusion: boolean;
  print_available: boolean;
  pricing?: {
    base_price?: number;
    print_price?: number;
    currency: string;
  };
  distribution?: {
    limited_edition: boolean;
    edition_size?: number;
  };
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: CardRarity;
  tags: string[];
  creator_id: string;
  creator_name?: string;
  created_at: string;
  updated_at: string;
  collection_id?: string;
  team_id?: string;
  user_id?: string;
  price?: number;
  edition_size: number;
  verification_status?: 'pending' | 'verified' | 'rejected';
  print_metadata: Record<string, any>;
  template_id?: string;
  creator_attribution: CreatorAttribution;
  publishing_options: PublishingOptions;
  print_available?: boolean;
  crd_catalog_inclusion?: boolean;
  marketplace_listing?: boolean;
  shop_id?: string;
  design_metadata: Record<string, any>;
  is_public?: boolean;
  visibility: CardVisibility;
}

export interface CardFilters {
  search?: string;
  rarity?: CardRarity[];
  price_min?: number;
  price_max?: number;
  creator_id?: string;
  tags?: string[];
  is_featured?: boolean;
  collection_id?: string;
  visibility?: CardVisibility;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
}

export interface PaginatedCards {
  cards: Card[];
  total: number;
  hasMore: boolean;
}

export const RARITY_COLORS = {
  common: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    glow: '#6b7280'
  },
  uncommon: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    glow: '#10b981'
  },
  rare: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    glow: '#3b82f6'
  },
  epic: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    glow: '#8b5cf6'
  },
  legendary: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    glow: '#f59e0b'
  },
  mythic: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    glow: '#ef4444'
  }
};
