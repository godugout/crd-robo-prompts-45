
import { useState, useCallback } from 'react';
import { useEffectConfigurations } from './useEffectConfigurations';

export interface EffectValues {
  [effectId: string]: {
    [parameterId: string]: number | boolean | string;
    intensity?: number;
  };
}

export const useEffectValues = () => {
  const { defaultEffectValues } = useEffectConfigurations();
  
  const [effectValues, setEffectValues] = useState<EffectValues>(() => defaultEffectValues);

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎛️ Effect Change:', { effectId, parameterId, value });
    
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: value
      }
    }));
  }, []);

  const resetEffectValues = useCallback(() => {
    console.log('🔄 Resetting all effect values');
    setEffectValues(defaultEffectValues);
  }, [defaultEffectValues]);

  const resetSingleEffect = useCallback((effectId: string) => {
    console.log('🔄 Resetting effect:', effectId);
    const { ENHANCED_VISUAL_EFFECTS } = require('./useEffectConfigurations');
    const effect = ENHANCED_VISUAL_EFFECTS.find((e: any) => e.id === effectId);
    if (effect) {
      const resetValues: Record<string, any> = {};
      effect.parameters.forEach((param: any) => {
        resetValues[param.id] = param.defaultValue;
      });
      setEffectValues(prev => ({
        ...prev,
        [effectId]: resetValues
      }));
    }
  }, []);

  return {
    effectValues,
    handleEffectChange,
    resetEffectValues,
    resetSingleEffect,
    setEffectValues
  };
};
