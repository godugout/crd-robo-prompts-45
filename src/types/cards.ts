
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type CardType = 'athlete' | 'fantasy' | 'sci_fi' | 'vehicle' | 'spell' | 'artifact';

export interface CardStats {
  power?: number;
  toughness?: number;
  mana_cost?: Record<string, number>;
  abilities: string[];
}

export interface Card {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  card_type: CardType;
  
  // Game mechanics
  power?: number;
  toughness?: number;
  mana_cost?: Record<string, number>;
  abilities: string[];
  
  // Metadata
  rarity: CardRarity;
  set_id?: string;
  serial_number?: number;
  total_supply: number;
  
  // Creator info
  creator_id?: string;
  royalty_percentage: number;
  
  // Market data
  base_price: number;
  current_market_value: number;
  
  // Additional metadata
  tags: string[];
  is_public: boolean;
  is_featured: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Computed fields
  is_favorited?: boolean;
  creator_name?: string;
  set_name?: string;
}

export interface CardSet {
  id: string;
  name: string;
  description?: string;
  release_date?: string;
  total_cards: number;
  is_active: boolean;
  created_at: string;
}

export interface CardFavorite {
  id: string;
  user_id: string;
  card_id: string;
  created_at: string;
}

export interface CardFilters {
  search?: string;
  rarity?: CardRarity[];
  card_type?: CardType[];
  creator_id?: string;
  set_id?: string;
  price_min?: number;
  price_max?: number;
  power_min?: number;
  power_max?: number;
  is_featured?: boolean;
  tags?: string[];
  sort_by?: 'name' | 'created_at' | 'current_market_value' | 'rarity';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PaginatedCards {
  cards: Card[];
  total: number;
  hasMore: boolean;
}

// Rarity color mappings
export const RARITY_COLORS: Record<CardRarity, { bg: string; text: string; border: string; glow: string }> = {
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

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  athlete: 'Athlete',
  fantasy: 'Fantasy',
  sci_fi: 'Sci-Fi',
  vehicle: 'Vehicle',
  spell: 'Spell',
  artifact: 'Artifact'
};
