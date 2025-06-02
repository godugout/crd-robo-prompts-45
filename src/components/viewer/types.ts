
import type { CardData } from '@/hooks/useCardEditor';

export interface CardEffect {
  type: 'holographic' | 'refractor' | 'foil' | 'prizm';
  intensity: number;
  color?: string;
}

export interface EnvironmentScene {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  lighting: {
    ambient: number;
    directional: number;
    color: string;
  };
}

export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  settings: {
    brightness: number;
    contrast: number;
    shadows: number;
    highlights: number;
  };
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
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
