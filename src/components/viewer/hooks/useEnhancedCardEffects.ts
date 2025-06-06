
import { useEffectConfigurations } from './useEffectConfigurations';
import { useEffectValues } from './useEffectValues';
import { useEffectPresets } from './useEffectPresets';
import { useEffectOperations } from './useEffectOperations';

// Re-export types for backward compatibility
export type { EffectParameter, VisualEffectConfig } from './useEffectConfigurations';
export type { EffectValues } from './useEffectValues';

// Re-export constants for backward compatibility
export { ENHANCED_VISUAL_EFFECTS } from './useEffectConfigurations';

export const useEnhancedCardEffects = () => {
  const { defaultEffectValues } = useEffectConfigurations();
  
  const {
    effectValues,
    handleEffectChange: baseHandleEffectChange,
    resetEffectValues,
    resetSingleEffect,
    setEffectValues
  } = useEffectValues();

  const {
    presetState,
    applyPreset,
    clearPresetState,
    isApplyingPreset
  } = useEffectPresets(defaultEffectValues, setEffectValues);

  const {
    handleEffectChange,
    resetEffect,
    resetAllEffects
  } = useEffectOperations(
    baseHandleEffectChange,
    resetSingleEffect,
    resetEffectValues,
    clearPresetState,
    isApplyingPreset
  );

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    presetState,
    isApplyingPreset
  };
};
