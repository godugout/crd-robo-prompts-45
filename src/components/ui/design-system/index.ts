
// Cardshow Design System - Main Export
export { cardshowColors, colors } from './colors';
export { designTokens, componentTokens } from './design-tokens';
export { CRDTokenDisplay, currencyUtils } from './currency';
export { SemanticCard, SemanticButton, ContextIndicator } from './semantic-components';

// Legacy exports - keeping for compatibility
export { CRDInput } from './Input';
export { CRDButton } from './Button';
export { Typography, Heading, AccentText } from './Typography';
export { PSDCard } from './PSDCard';
export { PSDButton } from './PSDButton';
export { psdTokens } from './psd-tokens';

// Type exports
export type { 
  ColorKey, 
  BrandColor, 
  NeutralColor, 
  CardshowColor, 
  SemanticColor 
} from './colors';
export type { DesignToken, ComponentToken } from './design-tokens';
export type { LayerCategoryType } from './psd-tokens';

// Import cardshowColors for utility functions
import { cardshowColors } from './colors';

// Design system utilities
export const getContextColor = (context: 'collections' | 'cards' | 'shops' | 'currency') => {
  const contextMap = {
    collections: cardshowColors.semantic.collections,
    cards: cardshowColors.semantic.cards,
    shops: cardshowColors.semantic.shops,
    currency: cardshowColors.semantic.currency
  };
  return contextMap[context];
};

export const getBackgroundColor = (level: 'default' | 'elevated' | 'surface') => {
  return cardshowColors.background[level];
};
