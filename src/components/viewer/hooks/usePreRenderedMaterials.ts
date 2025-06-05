
import React, { useMemo, useCallback } from 'react';
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

// Cache for pre-computed combo states
const comboCache = new Map<string, boolean>();
let currentActiveCombo = 'default';

export const usePreRenderedMaterials = (currentEffects: EffectValues) => {
  // Improved matching with tolerance for parameter variations
  const activeComboId = useMemo(() => {
    const currentSignature = createEffectSignature(currentEffects);
    
    console.log('🔍 Enhanced Effect Matching:', {
      currentEffects,
      currentSignature,
      previousActive: currentActiveCombo
    });
    
    // If no active effects, return default
    if (!currentSignature) {
      const result = 'default';
      if (currentActiveCombo !== result) {
        console.log('✅ Switching to Default (no effects)');
        currentActiveCombo = result;
      }
      return result;
    }
    
    // Find best match with tolerance
    let bestMatch = 'default';
    let bestScore = 0;
    
    for (const combo of POPULAR_COMBOS) {
      if (combo.id === 'default') continue;
      
      const score = calculateMatchScore(currentEffects, combo.effects);
      console.log(`🎯 Combo ${combo.id} match score: ${score}`);
      
      if (score > bestScore && score >= 0.8) { // 80% match threshold
        bestScore = score;
        bestMatch = combo.id;
      }
    }
    
    if (currentActiveCombo !== bestMatch) {
      console.log(`🔄 Active Combo Change: ${currentActiveCombo} → ${bestMatch} (score: ${bestScore})`);
      currentActiveCombo = bestMatch;
    }
    
    return bestMatch;
  }, [currentEffects]);

  // Create normalized effect signature
  const createEffectSignature = useCallback((effects: EffectValues): string => {
    return Object.entries(effects)
      .filter(([_, params]) => (params.intensity as number) > 0)
      .map(([id, params]) => `${id}:${Math.round(params.intensity as number)}`)
      .sort()
      .join('|');
  }, []);

  // Calculate match score between two effect sets
  const calculateMatchScore = useCallback((current: EffectValues, target: EffectValues): number => {
    const currentKeys = Object.keys(current).filter(key => (current[key].intensity as number) > 0);
    const targetKeys = Object.keys(target);
    
    if (currentKeys.length === 0 && targetKeys.length === 0) return 1;
    if (currentKeys.length === 0 || targetKeys.length === 0) return 0;
    
    // Check if effect types match
    const commonEffects = currentKeys.filter(key => targetKeys.includes(key));
    if (commonEffects.length === 0) return 0;
    
    let totalScore = 0;
    let scoreCount = 0;
    
    for (const effectKey of commonEffects) {
      const currentIntensity = current[effectKey].intensity as number;
      const targetIntensity = target[effectKey].intensity as number;
      
      // Allow 10% tolerance in intensity matching
      const intensityDiff = Math.abs(currentIntensity - targetIntensity) / Math.max(currentIntensity, targetIntensity);
      const intensityScore = Math.max(0, 1 - intensityDiff / 0.1);
      
      totalScore += intensityScore;
      scoreCount++;
    }
    
    return scoreCount > 0 ? totalScore / scoreCount : 0;
  }, []);

  const isPreRendered = useCallback((comboId: string) => {
    return POPULAR_COMBOS.some(combo => combo.id === comboId);
  }, []);

  const getComboById = useCallback((comboId: string) => {
    return POPULAR_COMBOS.find(combo => combo.id === comboId);
  }, []);

  // Cache management
  const setComboCached = useCallback((comboId: string) => {
    comboCache.set(comboId, true);
  }, []);

  const isComboCached = useCallback((comboId: string) => {
    return comboCache.has(comboId);
  }, []);

  return {
    POPULAR_COMBOS,
    activeComboId,
    isPreRendered,
    getComboById,
    setComboCached,
    isComboCached,
    currentActiveCombo
  };
};
