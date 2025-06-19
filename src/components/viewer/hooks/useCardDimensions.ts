
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { CARD_CONSTANTS } from '../constants/cardRenderer';

export const useCardDimensions = () => {
  const { viewport } = useThree();
  
  return useMemo(() => {
    const aspectRatio = CARD_CONSTANTS.ASPECT_RATIO;
    const maxWidth = viewport.width * CARD_CONSTANTS.VIEWPORT_CONSTRAINTS.MAX_WIDTH_PERCENT;
    const maxHeight = viewport.height * CARD_CONSTANTS.VIEWPORT_CONSTRAINTS.MAX_HEIGHT_PERCENT;
    
    let width, height;
    
    if (maxWidth * aspectRatio <= maxHeight) {
      width = maxWidth;
      height = maxWidth * aspectRatio;
    } else {
      height = maxHeight;
      width = maxHeight / aspectRatio;
    }
    
    return {
      width: Math.max(CARD_CONSTANTS.MIN_CARD_SIZE.WIDTH, width),
      height: Math.max(CARD_CONSTANTS.MIN_CARD_SIZE.HEIGHT, height),
      depth: CARD_CONSTANTS.THICKNESS
    };
  }, [viewport.width, viewport.height]);
};
