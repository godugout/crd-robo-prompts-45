
import { useState, useCallback } from 'react';

export interface EffectValues {
  [effectId: string]: {
    intensity?: number;
    [key: string]: number | boolean | string | undefined;
  };
}

export const useEnhancedCardEffects = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>({
    holographic: { intensity: 0 },
    foilspray: { intensity: 0 },
    prizm: { intensity: 0 },
    chrome: { intensity: 0 },
    interference: { intensity: 0 },
    brushedmetal: { intensity: 0 },
    crystal: { intensity: 0 },
    vintage: { intensity: 0 }
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
    setEffectValues(prev => ({
      ...prev,
      [effectId]: { intensity: 0 }
    }));
  }, []);

  const resetAllEffects = useCallback(() => {
    setEffectValues({
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    });
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
