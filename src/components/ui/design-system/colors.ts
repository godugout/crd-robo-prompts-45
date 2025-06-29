// Comprehensive Cardshow Design System - Color Tokens
export const cardshowColors = {
  // Primary Brand Colors - Semantic Roles
  primary: {
    green: '#22C55E',    // Collections
    orange: '#F97316',   // Cards
    blue: '#3B82F6',     // Shops/Marketplace
    coin: '#FACC15'      // Currency (CRD Token)
  },
  
  // Extended Color Palette
  extended: {
    // Blue variations
    'blue-600': '#0063f7',
    'blue-500': '#0083c9',
    'blue-400': '#009ff5',
    'blue-300': '#53bdf5',
    'blue-200': '#5b8def',
    'blue-100': '#3e7bfa',
    
    // Green variations
    'green-500': '#06c270',
    'green-400': '#1fc16b',
    'green-300': '#39d98a',
    'green-200': '#57eba1',
    'green-100': '#84ebb4',
    
    // Purple variations
    'purple-600': '#2a008c',
    'purple-500': '#3c00c6',
    'purple-400': '#4d00ff',
    'purple-300': '#8855ff',
    
    // Gray scale
    'gray-900': '#1c1c1c',
    'gray-800': '#1f1f1f',
    'gray-700': '#28293d',
    'gray-600': '#2d3339',
    'gray-500': '#333333',
    'gray-400': '#404040',
    'gray-300': '#4a4a4a',
    'gray-200': '#555770',
    'gray-100': '#606060'
  },
  
  // Background System
  background: {
    default: '#12151C',    // Default background
    elevated: '#1E1E1E',   // Elevated cards
    surface: '#F5F5F5'     // Surface sections
  },
  
  // Semantic Context Colors
  semantic: {
    collections: '#22C55E',  // Green for collections
    cards: '#F97316',        // Orange for cards
    shops: '#3B82F6',        // Blue for shops/marketplace
    currency: '#FACC15',     // Gold for CRD tokens
    success: '#22C55E',
    warning: '#F97316',
    error: '#EF4444',
    info: '#3B82F6'
  }
} as const;

// Legacy compatibility - keeping old colors for gradual migration
export const colors = {
  brand: {
    orange: cardshowColors.primary.orange,
    blue: cardshowColors.primary.blue,
    green: cardshowColors.primary.green,
    greenSecondary: cardshowColors.extended['green-400'],
    greenAccent: cardshowColors.extended['green-500'],
    purple: cardshowColors.extended['purple-400'],
    gold: cardshowColors.primary.coin,
  },
  neutral: {
    darkest: cardshowColors.background.default,
    dark: cardshowColors.extended['gray-900'],
    darkGray: cardshowColors.extended['gray-700'],
    mediumGray: cardshowColors.extended['gray-500'],
    lightGray: cardshowColors.extended['gray-200'],
    white: '#FCFCFD',
  },
  editor: {
    dark: cardshowColors.extended['gray-800'],
    darker: cardshowColors.background.default,
    tool: cardshowColors.extended['gray-600'],
    border: cardshowColors.extended['gray-500'],
    canvas: cardshowColors.extended['gray-700'],
  }
} as const;

export type ColorKey = keyof typeof colors;
export type BrandColor = keyof typeof colors.brand;
export type NeutralColor = keyof typeof colors.neutral;
export type CardshowColor = keyof typeof cardshowColors.primary;
export type SemanticColor = keyof typeof cardshowColors.semantic;
