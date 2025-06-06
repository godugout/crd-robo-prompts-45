
import { useCallback } from 'react';
import { useEffectConfigurations } from './useEffectConfigurations';

export const useEffectOperations = (
  handleEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void,
  resetSingleEffect: (effectId: string) => void,
  resetEffectValues: () => void,
  clearPresetState: () => void,
  isApplyingPreset: boolean
) => {
  const { ENHANCED_VISUAL_EFFECTS } = useEffectConfigurations();

  const handleEffectChangeWithPresetClear = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    // Clear preset state when manual changes are made (unless currently applying a preset)
    if (!isApplyingPreset) {
      clearPresetState();
    }
    
    handleEffectChange(effectId, parameterId, value);
  }, [handleEffectChange, clearPresetState, isApplyingPreset]);

  const resetEffect = useCallback((effectId: string) => {
    resetSingleEffect(effectId);
  }, [resetSingleEffect]);

  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting all effects');
    resetEffectValues();
  }, [resetEffectValues]);

  return {
    handleEffectChange: handleEffectChangeWithPresetClear,
    resetEffect,
    resetAllEffects
  };
};
