
import type { Visibility } from '@/types/common';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';

export interface CardData {
  id?: string;
  title: string;
  description: string;
  type: string;
  series: string;
  category: string;
  rarity: CardRarity;
  tags: string[];
  image_url?: string;
  design_metadata: Record<string, any>;
  creator_id?: string;
  visibility: Visibility;
}

export interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}
