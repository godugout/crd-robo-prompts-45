
import type { EnvironmentScene, LightingPreset, VisualEffect } from './types';

// Environment scene objects with all required properties
export const ENVIRONMENT_SCENES: Array<{
  id: EnvironmentScene;
  name: string;
  gradient: string;
  backgroundImage?: string;
  icon: string;
}> = [
  {
    id: 'studio',
    name: 'Studio',
    gradient: 'from-gray-900 to-gray-700',
    icon: '🎬',
    backgroundImage: '/studio-bg.jpg'
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-green-900 to-green-700',
    icon: '🌲',
    backgroundImage: '/forest-bg.jpg'
  },
  {
    id: 'mountain',
    name: 'Mountain',
    gradient: 'from-blue-900 to-gray-700',
    icon: '⛰️',
    backgroundImage: '/mountain-bg.jpg'
  },
  {
    id: 'cavern',
    name: 'Cavern',
    gradient: 'from-purple-900 to-gray-800',
    icon: '🕳️',
    backgroundImage: '/cavern-bg.jpg'
  },
  {
    id: 'metropolis',
    name: 'Metropolis',
    gradient: 'from-cyan-900 to-gray-800',
    icon: '🏙️',
    backgroundImage: '/city-bg.jpg'
  }
];

// Lighting preset objects with all required properties
export const LIGHTING_PRESETS: Array<{
  id: LightingPreset;
  name: string;
  description: string;
}> = [
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
