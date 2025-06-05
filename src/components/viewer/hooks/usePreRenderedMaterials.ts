
import { useMemo, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import { CARD_BACK_MATERIALS, type CardBackMaterial } from './useDynamicCardBackMaterials';

// Popular effect combinations for pre-rendering
export const POPULAR_COMBOS: Array<{ id: string; name: string; effects: EffectValues; material: CardBackMaterial }> = [
  {
    id: 'holographic-burst',
    name: 'Holographic',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      chrome: { intensity: 45, sharpness: 80, highlightSize: 60 }
    },
    material: CARD_BACK_MATERIALS.holographic
  },
  {
    id: 'metallic-prizm',
    name: 'Prizm',
    effects: {
      prizm: { intensity: 70, complexity: 7, colorSeparation: 80 },
      brushedmetal: { intensity: 55, direction: 45, grainDensity: 12 }
    },
    material: CARD_BACK_MATERIALS.prizm
  },
  {
    id: 'crystal-interference',
    name: 'Crystal',
    effects: {
      crystal: { intensity: 80, facets: 12, dispersion: 85, clarity: 60, sparkle: true },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    },
    material: CARD_BACK_MATERIALS.crystal
  },
  {
    id: 'vintage-foil',
    name: 'Vintage',
    effects: {
      vintage: { intensity: 65, aging: 70, patina: '#8b6914' },
      foilspray: { intensity: 50, density: 60, direction: 90 }
    },
    material: CARD_BACK_MATERIALS.vintage
  },
  {
    id: 'golden-fire',
    name: 'Golden',
    effects: {
      gold: { intensity: 75, shimmerSpeed: 80, platingThickness: 5, goldTone: 'rich', reflectivity: 85, colorEnhancement: true },
      chrome: { intensity: 40, sharpness: 60, highlightSize: 50 }
    },
    material: CARD_BACK_MATERIALS.gold
  },
  {
    id: 'ice-crystal',
    name: 'Ice',
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 70, clarity: 60, sparkle: true },
      chrome: { intensity: 35, sharpness: 90, highlightSize: 40 }
    },
    material: CARD_BACK_MATERIALS.ice
  },
  {
    id: 'solar-flare',
    name: 'Solar',
    effects: {
      holographic: { intensity: 60, shiftSpeed: 180, rainbowSpread: 200, animated: true },
      gold: { intensity: 45, shimmerSpeed: 100, goldTone: 'rich', reflectivity: 70, platingThickness: 5, colorEnhancement: true }
    },
    material: CARD_BACK_MATERIALS.starlight
  },
  {
    id: 'starlight-spray',
    name: 'Starlight',
    effects: {
      foilspray: { intensity: 65, density: 80, direction: 135 },
      prizm: { intensity: 40, complexity: 5, colorSeparation: 60 }
    },
    material: CARD_BACK_MATERIALS.starlight
  },
  {
    id: 'default',
    name: 'Default',
    effects: {},
    material: CARD_BACK_MATERIALS.default
  }
];

export const usePreRenderedMaterials = (currentEffects: EffectValues) => {
  // Find which combo matches current effects
  const activeComboId = useMemo(() => {
    const effectsSignature = Object.entries(currentEffects)
      .filter(([_, params]) => (params.intensity as number) > 0)
      .map(([id, params]) => `${id}:${params.intensity}`)
      .sort()
      .join('|');
    
    if (!effectsSignature) return 'default';
    
    const matchingCombo = POPULAR_COMBOS.find(combo => {
      const comboSignature = Object.entries(combo.effects)
        .filter(([_, params]) => (params.intensity as number) > 0)
        .map(([id, params]) => `${id}:${params.intensity}`)
        .sort()
        .join('|');
      
      return comboSignature === effectsSignature;
    });
    
    return matchingCombo?.id || 'default';
  }, [currentEffects]);

  const isPreRendered = useCallback((comboId: string) => {
    return POPULAR_COMBOS.some(combo => combo.id === comboId);
  }, []);

  const getComboById = useCallback((comboId: string) => {
    return POPULAR_COMBOS.find(combo => combo.id === comboId);
  }, []);

  return {
    POPULAR_COMBOS,
    activeComboId,
    isPreRendered,
    getComboById
  };
};
