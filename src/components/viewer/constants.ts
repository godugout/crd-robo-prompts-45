
import type { EnvironmentScene, LightingPreset, VisualEffect } from './types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    gradient: 'from-gray-800 via-gray-700 to-gray-900',
    lighting: { ambient: 0.6, directional: 0.8, color: '#ffffff' }
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: '🏛️',
    gradient: 'from-slate-600 via-slate-500 to-slate-700',
    lighting: { ambient: 0.7, directional: 0.6, color: '#f8f9fa' }
  },
  {
    id: 'stadium',
    name: 'Stadium',
    icon: '🏟️',
    gradient: 'from-green-800 via-green-600 to-green-900',
    lighting: { ambient: 0.8, directional: 1.0, color: '#ffffff' }
  },
  {
    id: 'twilight',
    name: 'Twilight',
    icon: '🌅',
    gradient: 'from-orange-600 via-purple-600 to-blue-800',
    lighting: { ambient: 0.4, directional: 0.7, color: '#ffa500' }
  },
  {
    id: 'quarry',
    name: 'Quarry',
    icon: '⚡',
    gradient: 'from-yellow-600 via-orange-700 to-red-800',
    lighting: { ambient: 0.5, directional: 0.9, color: '#ffeb3b' }
  },
  {
    id: 'coastline',
    name: 'Coastline',
    icon: '🌊',
    gradient: 'from-blue-600 via-cyan-500 to-teal-700',
    lighting: { ambient: 0.6, directional: 0.8, color: '#87ceeb' }
  },
  {
    id: 'hillside',
    name: 'Hillside',
    icon: '🌲',
    gradient: 'from-green-700 via-emerald-600 to-forest-800',
    lighting: { ambient: 0.5, directional: 0.6, color: '#90ee90' }
  },
  {
    id: 'milkyway',
    name: 'Milky Way',
    icon: '🌌',
    gradient: 'from-indigo-900 via-purple-800 to-black',
    lighting: { ambient: 0.3, directional: 0.4, color: '#4a5568' }
  },
  {
    id: 'esplanade',
    name: 'Esplanade',
    icon: '✨',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    lighting: { ambient: 0.7, directional: 0.8, color: '#ffd700' }
  },
  {
    id: 'neonclub',
    name: 'Neon Club',
    icon: '🎭',
    gradient: 'from-pink-600 via-purple-600 to-cyan-600',
    lighting: { ambient: 0.8, directional: 1.0, color: '#ff00ff' }
  },
  {
    id: 'industrial',
    name: 'Industrial',
    icon: '🏭',
    gradient: 'from-gray-700 via-red-800 to-orange-900',
    lighting: { ambient: 0.4, directional: 0.7, color: '#ff4500' }
  }
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'studio',
    name: 'Studio',
    description: 'Multiple professional setup. Clean, balanced lighting with full clarity.',
    settings: { brightness: 120, contrast: 110, shadows: 85, highlights: 95 }
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Warm daylight with soft shadows. Golden hour outdoor lighting.',
    settings: { brightness: 100, contrast: 100, shadows: 70, highlights: 80 }
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast single source. Dark, moody with strong highlights.',
    settings: { brightness: 90, contrast: 140, shadows: 40, highlights: 120 }
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Museum display with spot lights. Even illumination from multiple angles.',
    settings: { brightness: 110, contrast: 105, shadows: 60, highlights: 85 }
  }
];

export const VISUAL_EFFECTS: VisualEffect[] = [
  { id: 'holographic', name: 'Holographic Film', description: 'Rainbow prismatic film overlay' },
  { id: 'foilspray', name: 'Foil Spray', description: 'Metallic spray treatment' },
  { id: 'prizm', name: 'Prizm Refractor', description: 'Geometric rainbow patterns' },
  { id: 'chrome', name: 'Chrome Finish', description: 'Mirror-like surface coating' },
  { id: 'interference', name: 'Interference Pattern', description: 'Soap bubble color shifting' },
  { id: 'brushedmetal', name: 'Brushed Metal', description: 'Directional metallic finish' },
  { id: 'crystal', name: 'Crystal Coating', description: 'Faceted light patterns' },
  { id: 'vintage', name: 'Vintage Classic', description: 'Aged premium look' }
];
