
import type { EnvironmentScene, LightingPreset, VisualEffect, EnvironmentSceneConfig, LightingPresetConfig } from './types';

// Environment scene objects with all required properties
export const ENVIRONMENT_SCENES: EnvironmentSceneConfig[] = [
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

// Lighting preset objects with all required properties
export const LIGHTING_PRESETS: LightingPresetConfig[] = [
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

// Enhanced visual effects for the CompactEffectControls
export const ENHANCED_VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    category: 'prismatic',
    description: 'Dynamic rainbow shifting with prismatic effects',
    parameters: [
      {
        id: 'intensity',
        name: 'Intensity',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0
      }
    ]
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    category: 'prismatic',
    description: 'Metallic spray pattern with directional flow',
    parameters: [
      {
        id: 'intensity',
        name: 'Intensity',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0
      }
    ]
  },
  {
    id: 'prizm',
    name: 'Prizm',
    category: 'prismatic',
    description: 'Geometric prismatic patterns with color separation',
    parameters: [
      {
        id: 'intensity',
        name: 'Intensity',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0
      }
    ]
  },
  {
    id: 'chrome',
    name: 'Chrome',
    category: 'metallic',
    description: 'Metallic chrome finish with mirror-like reflections',
    parameters: [
      {
        id: 'intensity',
        name: 'Intensity',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0
      }
    ]
  },
  {
    id: 'crystal',
    name: 'Crystal',
    category: 'special',
    description: 'Crystalline faceted surface with light dispersion',
    parameters: [
      {
        id: 'intensity',
        name: 'Intensity',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0
      }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    category: 'metallic',
    description: 'Luxurious gold plating with authentic shimmer',
    parameters: [
      {
        id: 'intensity',
        name: 'Intensity',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0
      }
    ]
  }
];

// Export as VISUAL_EFFECTS for backward compatibility
export const VISUAL_EFFECTS = ENHANCED_VISUAL_EFFECTS;

// Helper functions to get scene and lighting data
export const getEnvironmentSceneConfig = (scene: EnvironmentScene): EnvironmentSceneConfig => {
  return ENVIRONMENT_SCENES.find(s => s.id === scene) || ENVIRONMENT_SCENES[0];
};

export const getLightingPresetConfig = (preset: LightingPreset): LightingPresetConfig => {
  return LIGHTING_PRESETS.find(p => p.id === preset) || LIGHTING_PRESETS[0];
};
