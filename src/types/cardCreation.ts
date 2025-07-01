
export interface UnifiedCardData {
  id?: string;
  title: string;
  description: string;
  frame: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effects: {
    holographic: number;
    metallic: number;
    chrome: number;
    particles: boolean;
  };
  image_url?: string;
  thumbnail_url?: string;
}
