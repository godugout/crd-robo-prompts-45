
export type EnvironmentScene = 'studio' | 'forest' | 'mountain' | 'cavern' | 'metropolis';
export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'soft' | 'vibrant';

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  clearcoat: number;
  transmission: number;
  reflectivity: number;
}

// Card data interfaces
export interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags?: string[];
}

export interface UniversalCardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: string;
  price?: number;
  creator_name?: string;
  creator_verified?: boolean;
  stock?: number;
  tags?: string[];
}

// ImmersiveCardViewer props interface
export interface ImmersiveCardViewerProps {
  card: UniversalCardData;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card?: UniversalCardData) => void;
  onDownload?: (card?: UniversalCardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

// Visual effect interface - match the one used in hooks
export interface VisualEffect {
  id: string;
  name: string;
  category: string;
  parameters: Array<{
    id: string;
    name: string;
    type: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue: any;
    options?: Array<{ value: string; label: string }>;
  }>;
}

// Environment scene object interface
export interface EnvironmentSceneConfig {
  id: EnvironmentScene;
  name: string;
  gradient: string;
  backgroundImage?: string;
  icon: string;
}

// Lighting preset object interface
export interface LightingPresetConfig {
  id: LightingPreset;
  name: string;
  description: string;
}

// Conversion functions
export const convertToViewerCardData = (card: any): CardData => {
  return {
    id: card.id || '',
    title: card.title || 'Untitled Card',
    description: card.description,
    image_url: card.image_url,
    rarity: card.rarity || 'common',
    tags: card.tags || []
  };
};

export const convertToUniversalCardData = (card: any): UniversalCardData => {
  return {
    id: card.id || '',
    title: card.title || 'Untitled Card',
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    rarity: card.rarity || 'common',
    price: typeof card.price === 'number' ? card.price : 0,
    creator_name: card.creator_name || card.creator_attribution?.creator_name,
    creator_verified: card.creator_verified || false,
    stock: card.stock || 0,
    tags: card.tags || []
  };
};
