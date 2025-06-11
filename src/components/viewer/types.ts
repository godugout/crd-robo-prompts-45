
export type EnvironmentScene = 'studio' | 'forest' | 'mountain' | 'cavern' | 'metropolis';
export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'soft' | 'vibrant';

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  clearcoat: number;
  transmission: number;
  reflectivity: number;
}

// Unified EffectValues interface - compatible with all components
export interface EffectValues {
  [key: string]: { 
    intensity: number;
    [key: string]: any;
  };
  holographic?: { intensity: number; [key: string]: any };
  foilspray?: { intensity: number; [key: string]: any };
  prizm?: { intensity: number; [key: string]: any };
  chrome?: { intensity: number; [key: string]: any };
  crystal?: { intensity: number; [key: string]: any };
  gold?: { intensity: number; [key: string]: any };
}

// Main Card data interface - aligned with useCardEditor
export interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[]; // Required to match useCardEditor
  visibility: 'public' | 'private' | 'shared'; // Match useCardEditor exactly
  is_public: boolean;
  template_id?: string;
  collection_id?: string;
  team_id?: string;
  creator_attribution: {
    creator_name?: string;
    creator_id?: string;
  };
  publishing_options: {
    marketplace_listing: boolean;
    crd_catalog_inclusion: boolean;
    print_available: boolean;
    pricing: { currency: string };
    distribution: { limited_edition: boolean };
  };
  design_metadata: Record<string, any>;
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

// Visual effect interface
export interface VisualEffect {
  id: string;
  name: string;
  category: string;
  description: string;
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

// Environment scene object interface - with all properties needed
export interface EnvironmentSceneConfig {
  id: EnvironmentScene;
  name: string;
  gradient: string;
  backgroundImage?: string;
  icon: string;
  description: string;
  lighting?: {
    color: { r: number; g: number; b: number };
    intensity: number;
  };
}

// Lighting preset object interface - with all properties needed
export interface LightingPresetConfig {
  id: LightingPreset;
  name: string;
  description: string;
  brightness?: number;
  contrast?: number;
  temperature?: number;
}

// Conversion functions
export const convertToViewerCardData = (card: any): CardData => {
  return {
    id: card.id || '',
    title: card.title || 'Untitled Card',
    description: card.description,
    image_url: card.image_url,
    rarity: card.rarity || 'common',
    tags: card.tags || [], // Ensure tags is always an array
    visibility: card.visibility === 'unlisted' ? 'public' : (card.visibility || 'public'), // Convert unlisted to public
    is_public: card.is_public !== false,
    template_id: card.template_id,
    collection_id: card.collection_id,
    team_id: card.team_id,
    creator_attribution: {
      creator_name: card.creator_name || card.creator_attribution?.creator_name,
      creator_id: card.creator_id || card.creator_attribution?.creator_id
    },
    publishing_options: card.publishing_options || {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    },
    design_metadata: card.design_metadata || {}
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

// Helper functions to get scene and lighting data with proper name properties
export const getEnvironmentSceneConfig = (scene: EnvironmentScene): EnvironmentSceneConfig => {
  const scenes: EnvironmentSceneConfig[] = [
    {
      id: 'studio',
      name: 'Studio',
      gradient: 'from-gray-900 to-gray-700',
      icon: '🎬',
      backgroundImage: '/studio-bg.jpg',
      description: 'Professional studio environment',
      lighting: { color: { r: 255, g: 255, b: 255 }, intensity: 1.0 }
    },
    {
      id: 'forest',
      name: 'Forest',
      gradient: 'from-green-900 to-green-700',
      icon: '🌲',
      backgroundImage: '/forest-bg.jpg',
      description: 'Natural forest setting',
      lighting: { color: { r: 200, g: 255, b: 200 }, intensity: 0.8 }
    },
    {
      id: 'mountain',
      name: 'Mountain',
      gradient: 'from-blue-900 to-gray-700',
      icon: '⛰️',
      backgroundImage: '/mountain-bg.jpg',
      description: 'Majestic mountain landscape',
      lighting: { color: { r: 200, g: 220, b: 255 }, intensity: 0.9 }
    },
    {
      id: 'cavern',
      name: 'Cavern',
      gradient: 'from-purple-900 to-gray-800',
      icon: '🕳️',
      backgroundImage: '/cavern-bg.jpg',
      description: 'Mysterious underground cavern',
      lighting: { color: { r: 180, g: 150, b: 220 }, intensity: 0.6 }
    },
    {
      id: 'metropolis',
      name: 'Metropolis',
      gradient: 'from-cyan-900 to-gray-800',
      icon: '🏙️',
      backgroundImage: '/city-bg.jpg',
      description: 'Urban cityscape environment',
      lighting: { color: { r: 150, g: 200, b: 255 }, intensity: 1.1 }
    }
  ];
  return scenes.find(s => s.id === scene) || scenes[0];
};

export const getLightingPresetConfig = (preset: LightingPreset): LightingPresetConfig => {
  const presets: LightingPresetConfig[] = [
    {
      id: 'studio',
      name: 'Studio',
      description: 'Balanced studio lighting',
      brightness: 100,
      contrast: 50,
      temperature: 5500
    },
    {
      id: 'natural',
      name: 'Natural',
      description: 'Soft natural lighting',
      brightness: 80,
      contrast: 30,
      temperature: 6500
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      description: 'High contrast dramatic lighting',
      brightness: 120,
      contrast: 80,
      temperature: 4500
    },
    {
      id: 'soft',
      name: 'Soft',
      description: 'Gentle diffused lighting',
      brightness: 70,
      contrast: 20,
      temperature: 7000
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Bright colorful lighting',
      brightness: 140,
      contrast: 60,
      temperature: 5000
    }
  ];
  return presets.find(p => p.id === preset) || presets[0];
};

// Helper functions to get name properties for scene and lighting
export const getEnvironmentSceneName = (scene: EnvironmentScene): string => {
  return getEnvironmentSceneConfig(scene).name;
};

export const getLightingPresetName = (preset: LightingPreset): string => {
  return getLightingPresetConfig(preset).name;
};
