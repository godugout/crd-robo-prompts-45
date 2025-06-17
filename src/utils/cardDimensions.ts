
// Standard card dimensions and utilities with flexible scaling support
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

export interface FlexibleCardDimensions extends CardDimensions {
  scale: number;
  actualWidth: number;
  actualHeight: number;
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

export const calculateFlexibleCardSize = (
  containerWidth: number,
  containerHeight: number,
  orientation: CardOrientation,
  maxScale: number = 3,
  minScale: number = 0.5
): FlexibleCardDimensions => {
  const baseDimensions = getCardDimensions(orientation);
  const { width: baseWidth, height: baseHeight, aspectRatio } = baseDimensions;
  
  // Calculate available space (with some padding)
  const availableWidth = containerWidth * 0.9;
  const availableHeight = containerHeight * 0.9;
  
  // Calculate scale factors for both dimensions
  const scaleByWidth = availableWidth / baseWidth;
  const scaleByHeight = availableHeight / baseHeight;
  
  // Use the smaller scale to ensure the card fits within bounds
  let optimalScale = Math.min(scaleByWidth, scaleByHeight);
  
  // Apply constraints
  optimalScale = Math.max(minScale, Math.min(maxScale, optimalScale));
  
  const scaledWidth = baseWidth * optimalScale;
  const scaledHeight = baseHeight * optimalScale;
  
  return {
    width: scaledWidth,
    height: scaledHeight,
    aspectRatio,
    scale: optimalScale,
    actualWidth: baseWidth,
    actualHeight: baseHeight,
  };
};

export const formatDimensions = (orientation: CardOrientation): string => {
  return orientation === 'portrait' ? '2.5" × 3.5"' : '3.5" × 2.5"';
};

export const formatScaledDimensions = (
  dimensions: FlexibleCardDimensions,
  orientation: CardOrientation
): string => {
  const actualSize = formatDimensions(orientation);
  const scalePercent = Math.round(dimensions.scale * 100);
  return `${actualSize} (${scalePercent}% scale)`;
};
