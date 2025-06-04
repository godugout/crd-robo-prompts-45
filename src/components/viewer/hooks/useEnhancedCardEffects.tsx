import { useState, useCallback } from 'react';

export interface EffectParameter {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'color' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  options?: { value: string; label: string }[];
}

export interface VisualEffectConfig {
  id: string;
  name: string;
  description: string;
  category: 'metallic' | 'prismatic' | 'surface' | 'vintage';
  parameters: EffectParameter[];
}

export interface EffectValues {
  [effectId: string]: {
    [parameterId: string]: number | boolean | string;
  };
}

// Define all visual effects with their unique parameters - Updated with new Gold effect
export const ENHANCED_VISUAL_EFFECTS: VisualEffectConfig[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow shifting with prismatic effects',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 35 },
      { id: 'shiftSpeed', name: 'Color Shift Speed', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 60 },
      { id: 'rainbowSpread', name: 'Rainbow Spread', type: 'slider', min: 0, max: 360, step: 10, defaultValue: 120 },
      { id: 'prismaticDepth', name: 'Prismatic Depth', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 25 },
      { id: 'animated', name: 'Animated', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern with directional flow',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 25 },
      { id: 'density', name: 'Metallic Density', type: 'slider', min: 10, max: 100, step: 5, defaultValue: 35 },
      { id: 'pattern', name: 'Spray Pattern', type: 'select', defaultValue: 'radial', 
        options: [
          { value: 'radial', label: 'Radial' },
          { value: 'linear', label: 'Linear' },
          { value: 'scattered', label: 'Scattered' }
        ]
      },
      { id: 'direction', name: 'Flow Direction', type: 'slider', min: 0, max: 360, step: 15, defaultValue: 45 },
      { id: 'shimmer', name: 'Shimmer Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'prizm',
    name: 'Prizm',
    description: 'Geometric prismatic patterns with color separation',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 30 },
      { id: 'complexity', name: 'Pattern Complexity', type: 'slider', min: 1, max: 10, step: 1, defaultValue: 4 },
      { id: 'colorSeparation', name: 'Color Separation', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 40 },
      { id: 'geometricScale', name: 'Geometric Scale', type: 'slider', min: 50, max: 200, step: 10, defaultValue: 100 },
      { id: 'rotation', name: 'Pattern Rotation', type: 'slider', min: 0, max: 360, step: 15, defaultValue: 0 }
    ]
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish with mirror-like reflections',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 40 },
      { id: 'sharpness', name: 'Reflection Sharpness', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 50 },
      { id: 'distortion', name: 'Mirror Distortion', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 10 },
      { id: 'highlightSize', name: 'Highlight Size', type: 'slider', min: 10, max: 90, step: 5, defaultValue: 30 },
      { id: 'polish', name: 'Surface Polish', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 }
    ]
  },
  {
    id: 'interference',
    name: 'Interference',
    description: 'Soap bubble interference patterns',
    category: 'surface',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: 'frequency', name: 'Wave Frequency', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 6 },
      { id: 'thickness', name: 'Bubble Thickness', type: 'slider', min: 1, max: 10, step: 0.5, defaultValue: 2 },
      { id: 'colorShift', name: 'Color Shift Speed', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 20 },
      { id: 'ripples', name: 'Ripple Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'brushedmetal',
    name: 'Brushed Metal',
    description: 'Brushed metallic surface with directional grain',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 30 },
      { id: 'direction', name: 'Brush Direction', type: 'slider', min: 0, max: 180, step: 15, defaultValue: 45 },
      { id: 'grainDensity', name: 'Grain Density', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 6 },
      { id: 'metallic', name: 'Metallic Finish', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'roughness', name: 'Surface Roughness', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 35 }
    ]
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Crystalline faceted surface with light dispersion',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 35 },
      { id: 'facets', name: 'Facet Count', type: 'slider', min: 3, max: 20, step: 1, defaultValue: 6 },
      { id: 'dispersion', name: 'Light Dispersion', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 40 },
      { id: 'clarity', name: 'Crystal Clarity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'sparkle', name: 'Sparkle Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged patina with wear patterns',
    category: 'vintage',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 25 },
      { id: 'aging', name: 'Aging Level', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 30 },
      { id: 'patina', name: 'Patina Color', type: 'color', defaultValue: '#8b7355' },
      { id: 'wear', name: 'Wear Patterns', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 20 },
      { id: 'scratches', name: 'Surface Scratches', type: 'toggle', defaultValue: false }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Luxurious gold plating with authentic shimmer',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 75 },
      { id: 'shimmerSpeed', name: 'Shimmer Speed', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 80 },
      { id: 'platingThickness', name: 'Plating Thickness', type: 'slider', min: 1, max: 10, step: 0.5, defaultValue: 5 },
      { id: 'goldTone', name: 'Gold Tone', type: 'select', defaultValue: 'rich', 
        options: [
          { value: 'rich', label: 'Rich Gold' },
          { value: 'rose', label: 'Rose Gold' },
          { value: 'white', label: 'White Gold' },
          { value: 'antique', label: 'Antique Gold' }
        ]
      },
      { id: 'reflectivity', name: 'Reflectivity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 85 },
      { id: 'colorEnhancement', name: 'Yellow Enhancement', type: 'toggle', defaultValue: true }
    ]
  }
];

export const useEnhancedCardEffects = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(() => {
    const initialValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      initialValues[effect.id] = {};
      effect.parameters.forEach(param => {
        initialValues[effect.id][param.id] = param.defaultValue;
      });
    });
    return initialValues;
  });

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: value
      }
    }));
  }, []);

  const resetEffect = useCallback((effectId: string) => {
    const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
    if (effect) {
      const resetValues: Record<string, any> = {};
      effect.parameters.forEach(param => {
        resetValues[param.id] = param.defaultValue;
      });
      setEffectValues(prev => ({
        ...prev,
        [effectId]: resetValues
      }));
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    const resetValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      resetValues[effect.id] = {};
      effect.parameters.forEach(param => {
        resetValues[effect.id][param.id] = param.defaultValue;
      });
    });
    setEffectValues(resetValues);
  }, []);

  const applyPreset = useCallback((preset: EffectValues) => {
    setEffectValues(preset);
  }, []);

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset
  };
};
