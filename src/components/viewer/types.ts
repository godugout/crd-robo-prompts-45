
import type { CardData } from '@/hooks/useCardEditor';
import type { UniversalCardData } from '@/components/cards/UniversalCardDisplay';

export interface EnvironmentScene {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  description: string;
  lighting: {
    color: string;
    intensity: number;
    elevation: number;
    azimuth: number;
  };
  backgroundImage: string;
  reflections: 'soft' | 'sharp' | 'warm' | 'cold' | 'sparkle' | 'vivid';
}

export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  brightness: number;
  contrast: number;
  shadows: number;
  highlights: number;
  temperature: number;
  position: { x: number; y: number; z: number };
  shadowSoftness: number;
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  category: 'prismatic' | 'metallic' | 'surface' | 'vintage';
}

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  reflectivity: number;
  clearcoat: number;
}

// Updated interface to accept either card type
export interface ImmersiveCardViewerProps {
  card: UniversalCardData;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: UniversalCardData) => void;
  onDownload?: (card: UniversalCardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

// Helper function to convert UniversalCardData to CardData for viewer components
export const convertToViewerCardData = (card: UniversalCardData): CardData => {
  return {
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    rarity: card.rarity,
    tags: card.tags || [],
    design_metadata: {},
    visibility: 'public',
    creator_attribution: {
      creator_name: card.creator_name,
      creator_id: undefined,
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        base_price: card.price,
        currency: 'ETH'
      }
    },
    price: card.price,
    creator_id: undefined
  };
};

// Helper function to convert CardData to UniversalCardData for display components
export const convertToUniversalCardData = (card: CardData): UniversalCardData => {
  return {
    id: card.id || 'temp-' + Date.now(), // Generate temp ID if missing
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    rarity: card.rarity,
    price: card.price,
    creator_name: card.creator_attribution?.creator_name,
    creator_verified: false, // Default value
    stock: 3, // Default value
    tags: card.tags
  };
};
