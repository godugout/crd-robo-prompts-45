
import { useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { useEnhancedCardEffects } from './useEnhancedCardEffects';

interface UseEnhancedEffectsProviderProps {
  card: CardData;
  effectValues: any;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  overallBrightness: number[];
  interactiveLighting: boolean;
}

export const useEnhancedEffectsProvider = ({
  card,
  effectValues,
  mousePosition,
  showEffects,
  overallBrightness,
  interactiveLighting
}: UseEnhancedEffectsProviderProps) => {
  
  const getEffectsWithFallback = useCallback(() => {
    try {
      const enhancedEffects = useEnhancedCardEffects({
        card,
        effectValues,
        mousePosition,
        showEffects,
        overallBrightness,
        interactiveLighting
      });
      
      console.log('Enhanced effects loaded successfully');
      return enhancedEffects;
    } catch (error) {
      console.error('Error loading enhanced effects:', error);
      
      return {
        getFrameStyles: () => ({ backgroundColor: '#333' }),
        getEnhancedEffectStyles: () => ({ opacity: 0.5 }),
        SurfaceTexture: null
      };
    }
  }, [card, effectValues, mousePosition, showEffects, overallBrightness, interactiveLighting]);

  return getEffectsWithFallback();
};
