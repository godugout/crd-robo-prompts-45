
// Centralized color system for type safety and consistency
export const colors = {
  // Brand colors - Updated to match Cardshow logo
  brand: {
    orange: '#EA6E48',
    blue: '#3772FF', 
    green: '#4ade80', // Primary green from your logo
    greenSecondary: '#22c55e', // Secondary green shade
    greenAccent: '#16a34a', // Darker green accent
    purple: '#9757D7',
    gold: '#FFD700',
  },
  // Neutral colors
  neutral: {
    darkest: '#121212',
    dark: '#1A1A1A', 
    darkGray: '#23262F',
    mediumGray: '#353945',
    lightGray: '#777E90',
    white: '#FCFCFD',
  },
  // Editor specific
  editor: {
    dark: '#1a1a1a',
    darker: '#121212', 
    tool: '#2a2a2a',
    border: '#333333',
    canvas: '#2c2c2c',
  }
} as const;

export type ColorKey = keyof typeof colors;
export type BrandColor = keyof typeof colors.brand;
export type NeutralColor = keyof typeof colors.neutral;
