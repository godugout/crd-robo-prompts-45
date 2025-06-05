
import { useState, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export interface FreemiumPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  effects: EffectValues;
  isPremium: boolean;
}

// Static locked presets for free users - no dynamic changes
export const FREEMIUM_PRESETS: FreemiumPreset[] = [
  {
    id: 'holographic-free',
    name: 'Holographic',
    description: 'Rainbow holographic effect',
    icon: 'Sparkles',
    isPremium: false,
    effects: {
      holographic: { intensity: 70, shiftSpeed: 100, rainbowSpread: 180, animated: true },
      chrome: { intensity: 30, sharpness: 70, highlightSize: 50 }
    }
  },
  {
    id: 'crystal-free', 
    name: 'Crystal',
    description: 'Crystal faceted surface',
    icon: 'Gem',
    isPremium: false,
    effects: {
      crystal: { intensity: 75, facets: 8, dispersion: 70, clarity: 60, sparkle: true },
      interference: { intensity: 40, frequency: 12, thickness: 3 }
    }
  },
  {
    id: 'chrome-free',
    name: 'Chrome',
    description: 'Metallic chrome finish',
    icon: 'Zap',
    isPremium: false,
    effects: {
      chrome: { intensity: 80, sharpness: 85, highlightSize: 60 },
      brushedmetal: { intensity: 30, direction: 45, grainDensity: 8 }
    }
  },
  {
    id: 'vintage-free',
    name: 'Vintage',
    description: 'Classic aged look',
    icon: 'Clock',
    isPremium: false,
    effects: {
      vintage: { intensity: 60, aging: 65, patina: '#8b7355' },
      foilspray: { intensity: 25, density: 40, direction: 90 }
    }
  },
  // Premium locked presets
  {
    id: 'golden-premium',
    name: 'Golden Luxury',
    description: 'Premium gold plating',
    icon: 'Crown',
    isPremium: true,
    effects: {
      gold: { intensity: 85, shimmerSpeed: 120, platingThickness: 7, goldTone: 'rich', reflectivity: 90, colorEnhancement: true },
      chrome: { intensity: 40, sharpness: 80, highlightSize: 50 }
    }
  },
  {
    id: 'prizm-premium',
    name: 'Prizm Elite',
    description: 'Advanced prismatic effects',
    icon: 'Diamond',
    isPremium: true,
    effects: {
      prizm: { intensity: 80, complexity: 8, colorSeparation: 90 },
      holographic: { intensity: 50, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    }
  }
];

export interface FreemiumState {
  selectedPresetId: string;
  currentEffects: EffectValues;
  isPremiumUser: boolean;
  canAccessPreset: (presetId: string) => boolean;
}

export const useFreemiumEffects = (isPremiumUser: boolean = false) => {
  const [selectedPresetId, setSelectedPresetId] = useState(FREEMIUM_PRESETS[0].id);
  
  // Get current preset
  const currentPreset = FREEMIUM_PRESETS.find(p => p.id === selectedPresetId) || FREEMIUM_PRESETS[0];
  
  // Static effects - no dynamic changes for stability
  const [currentEffects, setCurrentEffects] = useState<EffectValues>(currentPreset.effects);

  const canAccessPreset = useCallback((presetId: string) => {
    const preset = FREEMIUM_PRESETS.find(p => p.id === presetId);
    return preset ? (!preset.isPremium || isPremiumUser) : false;
  }, [isPremiumUser]);

  const selectPreset = useCallback((presetId: string) => {
    if (!canAccessPreset(presetId)) {
      console.log('🔒 Premium preset locked for free user');
      return false;
    }
    
    const preset = FREEMIUM_PRESETS.find(p => p.id === presetId);
    if (preset) {
      console.log('🎨 Applying static preset:', preset.name);
      setSelectedPresetId(presetId);
      // Atomic effect update - no race conditions
      setCurrentEffects({ ...preset.effects });
      return true;
    }
    return false;
  }, [canAccessPreset]);

  const resetToDefault = useCallback(() => {
    selectPreset(FREEMIUM_PRESETS[0].id);
  }, [selectPreset]);

  return {
    selectedPresetId,
    currentEffects,
    currentPreset,
    availablePresets: FREEMIUM_PRESETS,
    freePresets: FREEMIUM_PRESETS.filter(p => !p.isPremium),
    premiumPresets: FREEMIUM_PRESETS.filter(p => p.isPremium),
    isPremiumUser,
    canAccessPreset,
    selectPreset,
    resetToDefault
  };
};
