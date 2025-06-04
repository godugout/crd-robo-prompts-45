
import type { EffectValues, VisualEffectConfig } from '../hooks/useEnhancedCardEffects';

export const initializeEffectValues = (effects: VisualEffectConfig[]): EffectValues => {
  const initialValues: EffectValues = {};
  effects.forEach(effect => {
    initialValues[effect.id] = {};
    effect.parameters.forEach(param => {
      initialValues[effect.id][param.id] = param.defaultValue;
    });
  });
  return initialValues;
};

export const resetEffectToDefaults = (effect: VisualEffectConfig): Record<string, any> => {
  const resetValues: Record<string, any> = {};
  effect.parameters.forEach(param => {
    resetValues[param.id] = param.defaultValue;
  });
  return resetValues;
};

export const getEffectByCategory = (effects: VisualEffectConfig[], category: string): VisualEffectConfig[] => {
  return effects.filter(effect => effect.category === category);
};

export const getEffectById = (effects: VisualEffectConfig[], id: string): VisualEffectConfig | undefined => {
  return effects.find(effect => effect.id === id);
};
