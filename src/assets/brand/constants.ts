
// Brand Constants
export const BRAND_COLORS = {
  primary: '#4ade80', // Extracted from your logo green
  secondary: '#22c55e',
  accent: '#16a34a',
  text: '#1f2937',
} as const;

export const LOGO_SIZES = {
  xs: { width: 20, height: 20 },
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 40, height: 40 },
  xl: { width: 48, height: 48 },
} as const;

// Logo Usage Guidelines
export const LOGO_GUIDELINES = {
  minSize: 16,
  clearSpace: 8,
  maxWidth: 200,
  aspectRatio: '1:1',
} as const;
