
import type { EnvironmentScene, LightingPreset, VisualEffect } from './types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    description: 'Clean studio lighting',
    lighting: {
      color: '#ffffff',
      intensity: 0.9,
      elevation: 45,
      azimuth: 0
    },
    backgroundImage: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2048&h=1365&fit=crop&crop=center)',
    reflections: 'soft'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #ff0080 0%, #0080ff 100%)',
    description: 'Vibrant neon atmosphere',
    lighting: {
      color: '#ff0080',
      intensity: 1.2,
      elevation: 30,
      azimuth: 45
    },
    backgroundImage: 'url(https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=2048&h=1365&fit=crop&crop=center)',
    reflections: 'vivid'
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    icon: '🌅',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'Warm golden lighting',
    lighting: {
      color: '#ffa500',
      intensity: 0.9,
      elevation: 15,
      azimuth: 60
    },
    backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2048&h=1365&fit=crop&crop=center)',
    reflections: 'warm'
  },
  {
    id: 'twilight',
    name: 'Twilight',
    icon: '🌙',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Mystical twilight ambiance',
    lighting: {
      color: '#4a5ee8',
      intensity: 0.8,
      elevation: 60,
      azimuth: -30
    },
    backgroundImage: 'url(https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=2048&h=1365&fit=crop&crop=center)',
    reflections: 'cold'
  }
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Balanced natural lighting',
    brightness: 90,
    contrast: 90,
    shadows: 40,
    highlights: 65,
    temperature: 5500,
    position: { x: 0, y: 1, z: 1 },
    shadowSoftness: 25
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic lighting',
    brightness: 120,
    contrast: 150,
    shadows: 80,
    highlights: 90,
    temperature: 4000,
    position: { x: 1, y: 0.5, z: 0.5 },
    shadowSoftness: 10
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle diffused lighting',
    brightness: 90,
    contrast: 80,
    shadows: 30,
    highlights: 60,
    temperature: 6000,
    position: { x: 0, y: 1, z: 0 },
    shadowSoftness: 40
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Enhanced color vibrancy',
    brightness: 110,
    contrast: 130,
    shadows: 40,
    highlights: 85,
    temperature: 5800,
    position: { x: -0.5, y: 1, z: 1 },
    shadowSoftness: 25
  }
];

export const VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow holographic effect',
    category: 'prismatic'
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern',
    category: 'metallic'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Mirror-like chrome finish',
    category: 'metallic'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged patina effect',
    category: 'vintage'
  }
];
