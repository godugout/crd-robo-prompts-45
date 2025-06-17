
// Standard card dimensions and utilities
export const CARD_DIMENSIONS = {
  // Standard trading card size in inches
  WIDTH_INCHES: 2.5,
  HEIGHT_INCHES: 3.5,
  
  // Convert to pixels at 96 DPI (web standard)
  WIDTH_PX: 240,  // 2.5 * 96
  HEIGHT_PX: 336, // 3.5 * 96
  
  // Aspect ratio
  ASPECT_RATIO: 2.5 / 3.5, // 0.714
} as const;

export type CardOrientation = 'portrait' | 'landscape';

export interface CardDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export const getCardDimensions = (orientation: CardOrientation): CardDimensions => {
  if (orientation === 'portrait') {
    return {
      width: CARD_DIMENSIONS.WIDTH_PX,
      height: CARD_DIMENSIONS.HEIGHT_PX,
      aspectRatio: CARD_DIMENSIONS.ASPECT_RATIO,
    };
  } else {
    return {
      width: CARD_DIMENSIONS.HEIGHT_PX,
      height: CARD_DIMENSIONS.WIDTH_PX,
      aspectRatio: 1 / CARD_DIMENSIONS.ASPECT_RATIO,
    };
  }
};

export const formatDimensions = (orientation: CardOrientation): string => {
  return orientation === 'portrait' ? '2.5" × 3.5"' : '3.5" × 2.5"';
};
