
export interface LocalCard {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  template_id?: string;
  design_metadata?: {
    effects?: Record<string, any>;
    crop?: any;
    processing?: any;
  };
  rarity: string;
  tags: string[];
  is_public?: boolean;
  creator_attribution: {
    collaboration_type: string;
  };
  publishing_options: {
    marketplace_listing: boolean;
    crd_catalog_inclusion: boolean;
    print_available: boolean;
    pricing: {
      currency: string;
    };
    distribution: {
      limited_edition: boolean;
    };
  };
  verification_status?: string;
  print_metadata?: any;
  created_at?: string;
  updated_at?: string;
  sync_status?: 'pending' | 'synced' | 'failed';
}
