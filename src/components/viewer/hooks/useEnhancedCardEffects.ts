
import { useState, useCallback } from 'react';
import { ENHANCED_VISUAL_EFFECTS } from '../config/effectConfigs';
import { initializeEffectValues, resetEffectToDefaults, getEffectById } from '../utils/effectUtils';

// Re-export types and configs for backward compatibility
export type { EffectParameter, VisualEffectConfig, EffectValues } from './types/effectTypes';
export { ENHANCED_VISUAL_EFFECTS } from '../config/effectConfigs';

export const useEnhancedCardEffects = () => {
  const [effectValues, setEffectValues] = useState(() => 
    initializeEffectValues(ENHANCED_VISUAL_EFFECTS)
  );

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
    const effect = getEffectById(ENHANCED_VISUAL_EFFECTS, effectId);
    if (effect) {
      const resetValues = resetEffectToDefaults(effect);
      setEffectValues(prev => ({
        ...prev,
        [effectId]: resetValues
      }));
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    setEffectValues(initializeEffectValues(ENHANCED_VISUAL_EFFECTS));
  }, []);

  const applyPreset = useCallback((preset: typeof effectValues) => {
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
