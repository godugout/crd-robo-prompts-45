
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface Card {
  id: string;
  title: string; // Changed from 'name' to match database
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: string; // Simplified to string to match database
  tags: string[];
  
  // Database fields
  creator_id: string;
  created_at: string;
  updated_at: string;
  collection_id?: string;
  team_id?: string;
  user_id?: string;
  price?: number;
  edition_size: number;
  verification_status?: string;
  print_metadata?: any; // Changed from Record<string, any> to any to match Json type
  template_id?: string;
  creator_attribution?: any; // Changed from Record<string, any> to any
  publishing_options?: any; // Changed from Record<string, any> to any
  print_available?: boolean;
  crd_catalog_inclusion?: boolean;
  marketplace_listing?: boolean;
  shop_id?: string;
  design_metadata?: any; // Changed from Record<string, any> to any
  is_public?: boolean;
  
  // Computed fields for display
  creator_name?: string;
  set_name?: string;
  is_favorited?: boolean;
}

export interface CardFilters {
  search?: string;
  rarity?: string[];
  creator_id?: string;
  price_min?: number;
  price_max?: number;
  is_featured?: boolean;
  tags?: string[];
  sort_by?: 'title' | 'created_at' | 'price';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PaginatedCards {
  cards: Card[];
  total: number;
  hasMore: boolean;
}

// Simplified rarity colors for the basic rarities
export const RARITY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  common: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-300',
    border: 'border-gray-500',
    glow: 'shadow-gray-500/50'
  },
  uncommon: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500',
    glow: 'shadow-green-500/50'
  },
  rare: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500',
    glow: 'shadow-blue-500/50'
  },
  epic: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500',
    glow: 'shadow-purple-500/50'
  },
  legendary: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500',
    glow: 'shadow-orange-500/50'
  },
  mythic: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500',
    glow: 'shadow-red-500/50'
  }
};
