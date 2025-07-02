
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type CardVisibility = 'private' | 'public' | 'shared';

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  template_data: Record<string, any>;
  is_premium: boolean;
  usage_count: number;
  tags: string[];
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  specialties: string[];
  shop_status: 'active' | 'inactive' | 'under_review';
  verification_status: 'unverified' | 'pending' | 'verified';
}

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

export interface CardData {
  id?: string;
  title: string;
  description?: string;
  rarity: CardRarity;
  tags: string[];
  image_url?: string;
  thumbnail_url?: string;
  design_metadata: Record<string, any>;
  visibility: CardVisibility;
  is_public?: boolean;
  shop_id?: string;
  template_id?: string;
  collection_id?: string;
  team_id?: string;
  creator_attribution: CreatorAttribution;
  publishing_options: PublishingOptions;
  verification_status?: 'pending' | 'verified' | 'rejected';
  print_metadata?: Record<string, any>;
}

export interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}
