
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  template_id?: string;
  rarity: CardRarity;
  created_at: string;
  updated_at: string;
  user_id?: string;
}
