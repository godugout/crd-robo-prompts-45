
import { useState, useCallback } from 'react';

export interface EffectValues {
  holographic?: { intensity: number };
  foilspray?: { intensity: number };
  prizm?: { intensity: number };
  chrome?: { intensity: number };
  crystal?: { intensity: number };
  gold?: { intensity: number };
}

export const useEnhancedCardEffects = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>({
    holographic: { intensity: 0 },
    foilspray: { intensity: 0 },
    prizm: { intensity: 0 },
    chrome: { intensity: 0 },
    crystal: { intensity: 0 },
    gold: { intensity: 0 }
  });

  const [presetState, setPresetState] = useState<string>('custom');

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: value
      }
    }));
    setPresetState('custom');
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
      crystal: { intensity: 0 },
      gold: { intensity: 0 }
    });
    setPresetState('custom');
  }, []);

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    presetState
  };
};
