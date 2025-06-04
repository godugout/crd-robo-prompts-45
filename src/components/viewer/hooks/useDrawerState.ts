
import { useState, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export const useDrawerState = () => {
  const [isOpen, setIsOpen] = useState(false);

  console.log('useDrawerState hook render:', { isOpen });

  // Calculate active effects count with error handling
  const getActiveEffectsCount = useCallback((effectValues: EffectValues) => {
    try {
      if (!effectValues || typeof effectValues !== 'object') {
        console.warn('Invalid effectValues in getActiveEffectsCount:', effectValues);
        return 0;
      }

      const count = Object.values(effectValues).filter(effect => {
        if (!effect || typeof effect !== 'object') return false;
        const intensity = effect.intensity;
        return typeof intensity === 'number' && intensity > 0;
      }).length;

      console.log('Active effects count calculated:', count);
      return count;
    } catch (error) {
      console.error('Error calculating active effects count:', error);
      return 0;
    }
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
