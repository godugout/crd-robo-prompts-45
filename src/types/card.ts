
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity: CardRarity;
  tags: string[];
  created_at: string;
  creator_id: string;
  is_public: boolean;
}
