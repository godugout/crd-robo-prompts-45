
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
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
  template_id?: string;
  rarity: CardRarity;
  tags: string[];
  visibility?: CardVisibility;
  is_public?: boolean;
  design_metadata?: Record<string, any>;
  creator_attribution?: CreatorAttribution;
  publishing_options?: PublishingOptions;
  price?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// Export CardData as an alias for Card to maintain compatibility
export type CardData = Card;
