
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface OptimizedPreset {
  id: string;
  name: string;
  description: string;
  materialHint: string;
  effects: EffectValues;
  performanceLevel: 'low' | 'medium' | 'high';
  renderComplexity: number; // 1-10 scale
}

// Verified optimal effect configurations for authentic trading card experiences
export const OPTIMIZED_PRESETS: OptimizedPreset[] = [
  {
    id: 'holographic-rainbow',
    name: 'Holographic',
    description: 'Classic rainbow holographic with authentic shimmer',
    materialHint: 'Deep blue holographic surface with rainbow shift',
    performanceLevel: 'medium',
    renderComplexity: 6,
    effects: {
      holographic: { 
        intensity: 85, 
        shiftSpeed: 120, 
        rainbowSpread: 300, 
        animated: true 
      },
      chrome: { 
        intensity: 35, 
        sharpness: 75, 
        highlightSize: 45 
      }
    }
  },
  {
    id: 'prizm-geometric',
    name: 'Prizm',
    description: 'Geometric prismatic patterns with metallic finish',
    materialHint: 'Purple prizm surface with sharp geometric patterns',
    performanceLevel: 'medium',
    renderComplexity: 7,
    effects: {
      prizm: { 
        intensity: 75, 
        complexity: 8, 
        colorSeparation: 85 
      },
      brushedmetal: { 
        intensity: 50, 
        direction: 45, 
        grainDensity: 10 
      },
      chrome: { 
        intensity: 25, 
        sharpness: 80, 
        highlightSize: 35 
      }
    }
  },
  {
    id: 'crystal-faceted',
    name: 'Crystal',
    description: 'Multi-faceted crystal with light dispersion',
    materialHint: 'Clear crystal surface with prismatic light effects',
    performanceLevel: 'high',
    renderComplexity: 8,
    effects: {
      crystal: { 
        intensity: 80, 
        facets: 12, 
        dispersion: 90, 
        clarity: 70, 
        sparkle: true 
      },
      interference: { 
        intensity: 45, 
        frequency: 18, 
        thickness: 3.5 
      },
      chrome: { 
        intensity: 20, 
        sharpness: 90, 
        highlightSize: 30 
      }
    }
  },
  {
    id: 'vintage-patina',
    name: 'Vintage',
    description: 'Aged patina with authentic wear patterns',
    materialHint: 'Weathered bronze surface with natural aging',
    performanceLevel: 'low',
    renderComplexity: 3,
    effects: {
      vintage: { 
        intensity: 70, 
        aging: 80, 
        patina: '#8b6914' 
      },
      foilspray: { 
        intensity: 40, 
        density: 65, 
        direction: 135 
      }
    }
  },
  {
    id: 'gold-luxury',
    name: 'Golden',
    description: 'Premium gold plating with warm reflections',
    materialHint: 'Rich 24k gold surface with deep warm tones',
    performanceLevel: 'medium',
    renderComplexity: 5,
    effects: {
      gold: { 
        intensity: 80, 
        shimmerSpeed: 90, 
        platingThickness: 6, 
        goldTone: 'rich', 
        reflectivity: 85, 
        colorEnhancement: true 
      },
      chrome: { 
        intensity: 30, 
        sharpness: 70, 
        highlightSize: 40 
      },
      brushedmetal: { 
        intensity: 20, 
        direction: 90, 
        grainDensity: 6 
      }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice',
    description: 'Frozen crystal with silver highlights',
    materialHint: 'Frosted crystal with cool silver accents',
    performanceLevel: 'medium',
    renderComplexity: 6,
    effects: {
      crystal: { 
        intensity: 65, 
        facets: 10, 
        dispersion: 60, 
        clarity: 80, 
        sparkle: true 
      },
      chrome: { 
        intensity: 45, 
        sharpness: 95, 
        highlightSize: 35 
      },
      interference: { 
        intensity: 25, 
        frequency: 12, 
        thickness: 2 
      }
    }
  },
  {
    id: 'solar-burst',
    name: 'Solar',
    description: 'Radiant holographic with golden warmth',
    materialHint: 'Bright holographic surface with solar energy',
    performanceLevel: 'high',
    renderComplexity: 7,
    effects: {
      holographic: { 
        intensity: 70, 
        shiftSpeed: 160, 
        rainbowSpread: 240, 
        animated: true 
      },
      gold: { 
        intensity: 55, 
        shimmerSpeed: 110, 
        goldTone: 'rich', 
        reflectivity: 75, 
        platingThickness: 4, 
        colorEnhancement: true 
      },
      chrome: { 
        intensity: 25, 
        sharpness: 80, 
        highlightSize: 50 
      }
    }
  },
  {
    id: 'lunar-shimmer',
    name: 'Lunar',
    description: 'Subtle interference with moonlight elegance',
    materialHint: 'Soft silver surface with gentle wave patterns',
    performanceLevel: 'low',
    renderComplexity: 4,
    effects: {
      interference: { 
        intensity: 60, 
        frequency: 14, 
        thickness: 4 
      },
      vintage: { 
        intensity: 30, 
        aging: 35, 
        patina: '#c0c0c0' 
      },
      chrome: { 
        intensity: 40, 
        sharpness: 85, 
        highlightSize: 45 
      }
    }
  },
  {
    id: 'starlight-spray',
    name: 'Starlight',
    description: 'Metallic spray with cosmic sparkle',
    materialHint: 'Dark metallic surface with stellar highlights',
    performanceLevel: 'medium',
    renderComplexity: 5,
    effects: {
      foilspray: { 
        intensity: 70, 
        density: 85, 
        direction: 180 
      },
      prizm: { 
        intensity: 35, 
        complexity: 6, 
        colorSeparation: 70 
      },
      chrome: { 
        intensity: 50, 
        sharpness: 90, 
        highlightSize: 40 
      }
    }
  },
  {
    id: 'chrome-mirror',
    name: 'Chrome',
    description: 'Pure mirror chrome with brushed finish',
    materialHint: 'Polished chrome with directional brushing',
    performanceLevel: 'low',
    renderComplexity: 3,
    effects: {
      chrome: { 
        intensity: 90, 
        sharpness: 95, 
        highlightSize: 60 
      },
      brushedmetal: { 
        intensity: 45, 
        direction: 90, 
        grainDensity: 8 
      }
    }
  }
];

// Performance-based preset filtering
export const getPresetsForPerformanceLevel = (level: 'low' | 'medium' | 'high'): OptimizedPreset[] => {
  const maxComplexity = {
    low: 4,
    medium: 7,
    high: 10
  };

  return OPTIMIZED_PRESETS.filter(preset => 
    preset.renderComplexity <= maxComplexity[level]
  );
};

// Device performance detection
export const detectDevicePerformance = (): 'low' | 'medium' | 'high' => {
  // Simple heuristic based on available browser features and hardware
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) return 'low';
  
  const renderer = gl.getParameter(gl.RENDERER) || '';
  const vendor = gl.getParameter(gl.VENDOR) || '';
  
  // Check for mobile devices
  if (/mobile/i.test(navigator.userAgent)) {
    return 'low';
  }
  
  // Check for dedicated graphics
  if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Intel Iris')) {
    return 'high';
  }
  
  // Default to medium for desktop browsers
  return 'medium';
};
