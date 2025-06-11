
import type { EnvironmentScene, LightingPreset, VisualEffect, EnvironmentSceneConfig, LightingPresetConfig } from './types';

// Environment scene objects with all required properties
export const ENVIRONMENT_SCENES: EnvironmentSceneConfig[] = [
  {
    id: 'studio',
    name: 'Studio',
    gradient: 'from-gray-900 to-gray-700',
    icon: '🎬',
    backgroundImage: '/studio-bg.jpg',
    description: 'Professional studio environment'
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-green-900 to-green-700',
    icon: '🌲',
    backgroundImage: '/forest-bg.jpg',
    description: 'Natural forest setting'
  },
  {
    id: 'mountain',
    name: 'Mountain',
    gradient: 'from-blue-900 to-gray-700',
    icon: '⛰️',
    backgroundImage: '/mountain-bg.jpg',
    description: 'Majestic mountain landscape'
  },
  {
    id: 'cavern',
    name: 'Cavern',
    gradient: 'from-purple-900 to-gray-800',
    icon: '🕳️',
    backgroundImage: '/cavern-bg.jpg',
    description: 'Mysterious underground cavern'
  },
  {
    id: 'metropolis',
    name: 'Metropolis',
    gradient: 'from-cyan-900 to-gray-800',
    icon: '🏙️',
    backgroundImage: '/city-bg.jpg',
    description: 'Urban cityscape environment'
  }
];

// Lighting preset objects with all required properties
export const LIGHTING_PRESETS: LightingPresetConfig[] = [
  {
    id: 'studio',
    name: 'Studio',
    description: 'Balanced studio lighting'
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Soft natural lighting'
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic lighting'
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle diffused lighting'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bright colorful lighting'
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
