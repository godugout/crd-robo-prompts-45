
import { useState, useCallback } from 'react';
import { useEffectConfigurations } from './useEffectConfigurations';
import type { EffectValues } from '../types';

export const useEffectValues = () => {
  const { defaultEffectValues } = useEffectConfigurations();
  
  // Convert defaultEffectValues to proper EffectValues format
  const convertToEffectValues = (values: Record<string, Record<string, any>>): EffectValues => {
    const converted: EffectValues = {};
    Object.entries(values).forEach(([effectId, params]) => {
      converted[effectId] = {
        ...params,
        intensity: typeof params.intensity === 'number' ? params.intensity : 0
      };
    });
    return converted;
  };
  
  const [effectValues, setEffectValues] = useState<EffectValues>(() => convertToEffectValues(defaultEffectValues));

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎛️ Effect Change:', { effectId, parameterId, value });
    
    setEffectValues(prev => {
      const newValues: EffectValues = { ...prev };
      
      // Ensure the effect exists with proper structure
      if (!newValues[effectId]) {
        newValues[effectId] = { intensity: 0 };
      }
      
      // Ensure the effect always has the intensity property
      const currentEffect = newValues[effectId];
      const updatedEffect = {
        ...currentEffect,
        [parameterId]: value,
        intensity: currentEffect.intensity || 0 // Ensure intensity is always present
      };
      
      newValues[effectId] = updatedEffect;
      return newValues;
    });
  }, []);

  const resetEffectValues = useCallback(() => {
    console.log('🔄 Resetting all effect values');
    setEffectValues(convertToEffectValues(defaultEffectValues));
  }, [defaultEffectValues]);

  const resetSingleEffect = useCallback((effectId: string) => {
    console.log('🔄 Resetting effect:', effectId);
    const { ENHANCED_VISUAL_EFFECTS } = require('./useEffectConfigurations');
    const effect = ENHANCED_VISUAL_EFFECTS.find((e: any) => e.id === effectId);
    if (effect) {
      const resetValues: Record<string, any> = { intensity: 0 };
      effect.parameters.forEach((param: any) => {
        resetValues[param.id] = param.defaultValue;
      });
      setEffectValues(prev => ({
        ...prev,
        [effectId]: {
          ...resetValues,
          intensity: 0 // Ensure intensity is always present
        }
      }));
    }
  }, []);

  return {
    effectValues,
    handleEffectChange,
    resetEffectValues,
    resetSingleEffect,
    setEffectValues: (values: EffectValues | ((prev: EffectValues) => EffectValues)) => {
      if (typeof values === 'function') {
        setEffectValues(values);
      } else {
        setEffectValues(values);
      }
    }
  };
};
