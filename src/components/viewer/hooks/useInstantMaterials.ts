
import { useMemo, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import { useMaterialCache } from './useMaterialCache';
import { CARD_BACK_MATERIALS, type CardBackMaterial } from './useDynamicCardBackMaterials';

export const useInstantMaterials = (effectValues: EffectValues) => {
  const { getCachedMaterial, cacheMaterial, isCached } = useMaterialCache();

  // Get material with instant CSS or compute if needed
  const getMaterialWithCSS = useMemo(() => {
    if (!effectValues) {
      return {
        material: CARD_BACK_MATERIALS.default,
        css: null,
        isInstant: true
      };
    }

    // Check cache first
    const cachedCSS = getCachedMaterial(effectValues);
    if (cachedCSS) {
      // Find the material based on active effects
      const material = computeMaterial(effectValues);
      return {
        material,
        css: cachedCSS,
        isInstant: true
      };
    }

    // Compute material and cache it
    const material = computeMaterial(effectValues);
    
    // Cache in background
    setTimeout(() => {
      cacheMaterial(effectValues, material);
    }, 0);

    return {
      material,
      css: null,
      isInstant: isCached(effectValues)
    };
  }, [effectValues, getCachedMaterial, cacheMaterial, isCached]);

  // Compute material selection (same logic as original)
  const computeMaterial = useCallback((effects: EffectValues): CardBackMaterial => {
    const effectIntensities = Object.entries(effects).map(([effectId, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      return { effectId, intensity };
    }).filter(({ intensity }) => intensity > 0);

    if (effectIntensities.length === 0) {
      return CARD_BACK_MATERIALS.default;
    }

    const dominantEffect = effectIntensities.reduce((max, current) => 
      current.intensity > max.intensity ? current : max
    );

    const materialMapping: Record<string, string> = {
      holographic: 'holographic',
      crystal: 'crystal',
      chrome: 'chrome',
      brushedmetal: 'chrome',
      gold: 'gold',
      vintage: 'vintage',
      prizm: 'prizm',
      interference: 'ice',
      foilspray: 'starlight'
    };

    const materialId = materialMapping[dominantEffect.effectId] || 'default';
    return CARD_BACK_MATERIALS[materialId];
  }, []);

  // Generate instant CSS styles
  const generateInstantCSS = useCallback((material: CardBackMaterial): React.CSSProperties => {
    return {
      background: material.background,
      borderColor: material.borderColor,
      opacity: material.opacity,
      backdropFilter: material.blur ? `blur(${material.blur}px)` : undefined,
      boxShadow: `0 0 30px ${material.borderColor}, inset 0 0 20px rgba(255, 255, 255, 0.1)`,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' // Smooth instant transitions
    };
  }, []);

  return {
    ...getMaterialWithCSS,
    generateInstantCSS,
    isCached: isCached(effectValues)
  };
};
