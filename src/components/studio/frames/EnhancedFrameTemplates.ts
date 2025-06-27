
import { EnhancedFrameTemplate } from '../../editor/frames/types';
import {
  ClassicSportsFrame,
  ModernHolographicFrame,
  VintageOrnateFrame,
  DonrussSpecialFrame,
  DonrussRookieFrame,
  ChromeEditionFrame
} from '../../editor/frames/components';

// Organized frame templates for optimal user experience
export const ENHANCED_FRAME_TEMPLATES: EnhancedFrameTemplate[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Professional',
    description: 'Traditional sports card design with premium borders',
    preview_component: ClassicSportsFrame,
    rarity: 'Common',
    visual: {
      border: { width: '4px', color: '#FFD700', gradient: true },
      borderRadius: '8px',
      shadow: true
    },
    effects: {
      metallic: false,
      holographic: false,
      crystal: false,
      animated: false
    },
    layout: {
      imageArea: { x: 8, y: 24, width: 144, height: 120 },
      titleArea: { x: 8, y: 154, width: 144, height: 24 },
      subtitleArea: { x: 8, y: 178, width: 144, height: 16 }
    }
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    category: 'Premium',
    description: 'Modern holographic design with prismatic effects',
    preview_component: ModernHolographicFrame,
    rarity: 'Epic',
    visual: {
      border: { width: '3px', color: '#8B5CF6', gradient: true },
      borderRadius: '12px',
      shadow: true
    },
    effects: {
      holographic: true,
      metallic: false,
      crystal: false,
      animated: true
    },
    layout: {
      imageArea: { x: 12, y: 28, width: 136, height: 116 },
      titleArea: { x: 12, y: 154, width: 136, height: 24 },
      subtitleArea: { x: 12, y: 178, width: 136, height: 16 }
    }
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Classic',
    description: 'Ornate vintage design with decorative elements',
    preview_component: VintageOrnateFrame,
    rarity: 'Rare',
    visual: {
      border: { width: '4px', color: '#D97706', gradient: false },
      borderRadius: '8px',
      shadow: false
    },
    effects: {
      metallic: true,
      holographic: false,
      crystal: false,
      animated: false
    },
    layout: {
      imageArea: { x: 16, y: 32, width: 128, height: 112 },
      titleArea: { x: 16, y: 154, width: 128, height: 20 },
      subtitleArea: { x: 16, y: 174, width: 128, height: 16 }
    }
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    category: 'Modern',
    description: 'Sleek chrome finish with metallic elements',
    preview_component: ChromeEditionFrame,
    rarity: 'Legendary',
    visual: {
      border: { width: '2px', color: '#9CA3AF', gradient: true },
      borderRadius: '6px',
      shadow: true
    },
    effects: {
      metallic: true,
      holographic: false,
      crystal: false,
      animated: false
    },
    layout: {
      imageArea: { x: 8, y: 20, width: 144, height: 124 },
      titleArea: { x: 8, y: 154, width: 144, height: 24 },
      subtitleArea: { x: 8, y: 178, width: 144, height: 16 }
    }
  },
  {
    id: 'donruss-special',
    name: 'Donruss Special',
    category: 'Vintage',
    description: '1987 Donruss special edition with ornate corners',
    preview_component: DonrussSpecialFrame,
    rarity: 'Rare',
    visual: {
      border: { width: '4px', color: '#DC2626', gradient: false },
      borderRadius: '8px',
      shadow: false
    },
    effects: {
      metallic: false,
      holographic: false,
      crystal: false,
      animated: false
    },
    layout: {
      imageArea: { x: 8, y: 28, width: 144, height: 120 },
      titleArea: { x: 8, y: 170, width: 144, height: 20 },
      subtitleArea: { x: 8, y: 190, width: 144, height: 16 }
    }
  },
  {
    id: 'donruss-rookie',
    name: 'Rookie Card',
    category: 'Vintage',
    description: '1987 Donruss rookie card design with red accents',
    preview_component: DonrussRookieFrame,
    rarity: 'Epic',
    visual: {
      border: { width: '4px', color: '#1E40AF', gradient: true },
      borderRadius: '8px',
      shadow: false
    },
    effects: {
      metallic: false,
      holographic: false,
      crystal: false,
      animated: false
    },
    layout: {
      imageArea: { x: 8, y: 28, width: 144, height: 120 },
      titleArea: { x: 8, y: 170, width: 144, height: 20 },
      subtitleArea: { x: 8, y: 190, width: 144, height: 16 }
    }
  }
];

export type { EnhancedFrameTemplate };
