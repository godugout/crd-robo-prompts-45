
// Re-export types from the main types file for backwards compatibility
export type { 
  CardRarity, 
  CardVisibility, 
  CreatorAttribution, 
  PublishingOptions,
  CardData
} from '@/types/card';

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

export interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}
