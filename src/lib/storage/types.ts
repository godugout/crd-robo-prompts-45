
export interface LocalCard {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  design_metadata: Record<string, any>;
  rarity: string;
  tags: string[];
  template_id?: string;
  creator_attribution: {
    collaboration_type: string;
    [key: string]: any;
  };
  publishing_options: {
    marketplace_listing: boolean;
    crd_catalog_inclusion: boolean;
    print_available: boolean;
    pricing: {
      currency: string;
      [key: string]: any;
    };
    distribution: {
      limited_edition: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  };
  print_metadata: Record<string, any>;
  is_public: boolean;
  lastModified: number;
  needsSync: boolean;
  isLocal: boolean;
}
