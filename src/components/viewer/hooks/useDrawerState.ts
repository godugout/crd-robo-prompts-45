
import { useState, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export const useDrawerState = () => {
  const [isOpen, setIsOpen] = useState(false);

  console.log('useDrawerState hook:', { isOpen });

  // Calculate active effects count
  const getActiveEffectsCount = useCallback((effectValues: EffectValues) => {
    const count = Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
    console.log('Active effects count:', count);
    return count;
  }, []);

  const handleSetIsOpen = useCallback((open: boolean) => {
    console.log('Setting drawer open state:', open);
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    setIsOpen: handleSetIsOpen,
    getActiveEffectsCount
  };
};
