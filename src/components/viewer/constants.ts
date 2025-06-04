
import type { EnvironmentScene, LightingPreset, MaterialSettings } from './types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    icon: '🎬',
    description: 'Professional studio environment'
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    gradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    icon: '🌌',
    description: 'Deep space cosmic setting'
  },
  {
    id: 'warm',
    name: 'Warm',
    gradient: 'linear-gradient(135deg, #2d1b00 0%, #3d2600 50%, #4d3100 100%)',
    icon: '🔥',
    description: 'Warm ambient lighting'
  }
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    brightness: 100,
    description: 'Balanced natural lighting',
    contrast: 100,
    temperature: 5500
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    brightness: 80,
    description: 'High contrast dramatic lighting',
    contrast: 140,
    temperature: 4000
  },
  {
    id: 'soft',
    name: 'Soft',
    brightness: 120,
    description: 'Gentle soft lighting',
    contrast: 80,
    temperature: 6500
  }
];

export const DEFAULT_MATERIAL_SETTINGS: MaterialSettings = {
  roughness: 30,
  metalness: 0,
  clearcoat: 0,
  reflectivity: 20
};
