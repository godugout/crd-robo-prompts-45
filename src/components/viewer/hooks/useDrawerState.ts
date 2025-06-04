
import { useState, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export const useDrawerState = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate active effects count
  const getActiveEffectsCount = useCallback((effectValues: EffectValues) => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  }, []);

  return {
    isOpen,
    setIsOpen,
    getActiveEffectsCount
  };
};
