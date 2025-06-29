// Cardshow Design System - Main Export
export { cardshowColors, colors } from './colors';
export { enhancedCardshowColors, gradients } from './enhanced-colors';
export { designTokens, componentTokens } from './design-tokens';
export { professionalTokens } from './professional-tokens';
export { CRDTokenDisplay, currencyUtils } from './currency';
export { SemanticCard, SemanticButton, ContextIndicator } from './semantic-components';

// Professional Design System Components
export { 
  ProfessionalCard,
  ProfessionalButton,
  ProfessionalPanel,
  ProfessionalStat
} from './professional-components';
export {
  ProfessionalLayout,
  TwoColumnLayout,
  ThreeColumnLayout,
  ProfessionalHeader,
  ProfessionalContent
} from './professional-layout';

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
export type { 
  EnhancedSemanticColor,
  ProfessionalBackground,
  ProfessionalText
} from './enhanced-colors';
export type { DesignToken, ComponentToken } from './design-tokens';
export type { ProfessionalToken } from './professional-tokens';
export type { LayerCategoryType } from './psd-tokens';

// Import enhanced colors for utility functions
import { enhancedCardshowColors } from './enhanced-colors';

// Enhanced design system utilities
export const getProfessionalContextColor = (context: 'collections' | 'cards' | 'shops' | 'currency' | 'professional') => {
  return enhancedCardshowColors.semantic[context];
};

export const getProfessionalBackground = (level: 'primary' | 'elevated' | 'surface' | 'panel' | 'overlay' | 'glass') => {
  return enhancedCardshowColors.backgrounds[level];
};

// Legacy utilities - keeping for compatibility
export const getContextColor = (context: 'collections' | 'cards' | 'shops' | 'currency') => {
  const contextMap = {
    collections: enhancedCardshowColors.semantic.collections,
    cards: enhancedCardshowColors.semantic.cards,
    shops: enhancedCardshowColors.semantic.shops,
    currency: enhancedCardshowColors.semantic.currency
  };
  return contextMap[context];
};

export const getBackgroundColor = (level: 'default' | 'elevated' | 'surface') => {
  const backgroundMap = {
    default: enhancedCardshowColors.backgrounds.primary,
    elevated: enhancedCardshowColors.backgrounds.elevated,
    surface: enhancedCardshowColors.backgrounds.surface
  };
  return backgroundMap[level];
};
