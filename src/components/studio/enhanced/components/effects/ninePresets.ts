
export interface EffectPreset {
  id: string;
  name: string;
  category: 'Prismatic' | 'Metallic' | 'Special';
  description: string;
  visualDescription: string;
  difficulty: 'Rare' | 'Epic' | 'Legendary';
  formula: Record<string, Record<string, any>>;
  traits: {
    shimmer: number;
    depth: number;
    color: number;
    reflection: number;
  };
  previewGradient: string;
}

export const NINE_EFFECT_PRESETS: EffectPreset[] = [
  // Prismatic Category
  {
    id: 'aurora_shift',
    name: 'Aurora Shift',
    category: 'Prismatic',
    description: 'Dynamic rainbow waves with holographic brilliance',
    visualDescription: 'Flowing colors that shift like northern lights',
    difficulty: 'Legendary',
    formula: {
      holographic: { intensity: 85, shiftSpeed: 140, rainbowSpread: 200, animated: true },
      prizm: { intensity: 45, dispersion: 80 }
    },
    traits: { shimmer: 95, depth: 70, color: 100, reflection: 60 },
    previewGradient: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b)'
  },
  {
    id: 'prism_burst',
    name: 'Prism Burst',
    category: 'Prismatic',
    description: 'Explosive prismatic geometry with rainbow separation',
    visualDescription: 'Sharp geometric patterns that split light',
    difficulty: 'Epic',
    formula: {
      prizm: { intensity: 90, geometryType: 'sharp', dispersion: 95 },
      holographic: { intensity: 30, animated: false }
    },
    traits: { shimmer: 60, depth: 90, color: 95, reflection: 70 },
    previewGradient: 'conic-gradient(from 0deg, #ff0080, #00ff80, #8000ff, #ff8000)'
  },
  {
    id: 'spectral_wave',
    name: 'Spectral Wave',
    category: 'Prismatic',
    description: 'Flowing holographic waves with color separation',
    visualDescription: 'Smooth waves of shifting spectral colors',
    difficulty: 'Rare',
    formula: {
      holographic: { intensity: 65, shiftSpeed: 80, wavePattern: 'smooth' },
      foilspray: { intensity: 25, pattern: 'wave' }
    },
    traits: { shimmer: 80, depth: 50, color: 85, reflection: 45 },
    previewGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },

  // Metallic Category
  {
    id: 'liquid_chrome',
    name: 'Liquid Chrome',
    category: 'Metallic',
    description: 'Mirror-perfect chrome with liquid metal flow',
    visualDescription: 'Like molten chrome with perfect reflections',
    difficulty: 'Legendary',
    formula: {
      chrome: { intensity: 95, sharpness: 90, reflectivity: 100 },
      crystal: { intensity: 20, clarity: 95 }
    },
    traits: { shimmer: 50, depth: 85, color: 20, reflection: 100 },
    previewGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'golden_sovereign',
    name: 'Golden Sovereign',
    category: 'Metallic',
    description: 'Royal gold plating with authentic shimmer',
    visualDescription: 'Luxurious gold with deep, rich warmth',
    difficulty: 'Epic',
    formula: {
      gold: { intensity: 90, goldTone: 'rich', shimmerSpeed: 120, colorEnhancement: true },
      foilspray: { intensity: 35, pattern: 'radial' }
    },
    traits: { shimmer: 85, depth: 70, color: 90, reflection: 75 },
    previewGradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
  },
  {
    id: 'steel_reflection',
    name: 'Steel Reflection',
    category: 'Metallic',
    description: 'Brushed steel with directional highlights',
    visualDescription: 'Industrial steel with linear brush patterns',
    difficulty: 'Rare',
    formula: {
      chrome: { intensity: 60, pattern: 'brushed', direction: 45 },
      crystal: { intensity: 15, facets: 8 }
    },
    traits: { shimmer: 40, depth: 60, color: 30, reflection: 80 },
    previewGradient: 'linear-gradient(45deg, #c9d6ff 0%, #e2e2e2 100%)'
  },

  // Special Category
  {
    id: 'crystal_fractal',
    name: 'Crystal Fractal',
    category: 'Special',
    description: 'Multifaceted crystal with light dispersion',
    visualDescription: 'Like looking through a perfect diamond',
    difficulty: 'Legendary',
    formula: {
      crystal: { intensity: 95, facets: 16, dispersion: 90, clarity: 85, sparkle: true },
      holographic: { intensity: 25, animated: false }
    },
    traits: { shimmer: 90, depth: 95, color: 70, reflection: 85 },
    previewGradient: 'radial-gradient(circle, #74b9ff 0%, #0984e3 100%)'
  },
  {
    id: 'foil_tempest',
    name: 'Foil Tempest',
    category: 'Special',
    description: 'Chaotic foil spray with energy patterns',
    visualDescription: 'Wild metallic sprays with electric energy',
    difficulty: 'Epic',
    formula: {
      foilspray: { intensity: 85, pattern: 'chaotic', density: 90 },
      prizm: { intensity: 40, dispersion: 60 }
    },
    traits: { shimmer: 95, depth: 60, color: 65, reflection: 70 },
    previewGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    id: 'vintage_patina',
    name: 'Vintage Patina',
    category: 'Special',
    description: 'Aged copper with weathered character',
    visualDescription: 'Classic patinated metal with history',
    difficulty: 'Rare',
    formula: {
      gold: { intensity: 45, goldTone: 'aged', patina: true },
      crystal: { intensity: 10, weathering: 30 }
    },
    traits: { shimmer: 30, depth: 75, color: 85, reflection: 40 },
    previewGradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
  }
];

// Helper function to get preset by ID
export const getPresetById = (id: string): EffectPreset | undefined => {
  return NINE_EFFECT_PRESETS.find(preset => preset.id === id);
};

// Helper function to get presets by category
export const getPresetsByCategory = (category: EffectPreset['category']): EffectPreset[] => {
  return NINE_EFFECT_PRESETS.filter(preset => preset.category === category);
};
