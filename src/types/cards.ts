
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
  rarity: CardRarity;
  tags: string[];
  creator_id: string;
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
