
import type { CardData } from '@/hooks/useCardEditor';

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
  roughness: number;
  metalness: number;
  clearcoat: number;
  reflectivity: number;
}

export interface ImmersiveCardViewerProps {
  card: CardData;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}
