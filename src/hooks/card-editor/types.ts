
export interface CardData {
  id?: string;
  title: string;
  description?: string;
  creator_id?: string;
  design_metadata?: Record<string, any>;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: 'common' | 'rare' | 'legendary';
  tags?: string[];
  is_public?: boolean;
  template_id?: string;
  shop_id?: string;
  collection_id?: string;
  team_id?: string;
  creator_attribution?: Record<string, any>;
  publishing_options?: Record<string, any>;
  verification_status?: string;
  print_metadata?: Record<string, any>;
}
