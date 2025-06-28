
// PSD-specific design tokens for consistent theming
export const psdTokens = {
  // Layer category colors
  layerCategories: {
    background: {
      primary: '#64748b', // slate-500
      secondary: '#94a3b8', // slate-400
      accent: '#475569', // slate-600
      surface: '#f1f5f9', // slate-100
    },
    character: {
      primary: '#22c55e', // green-500 
      secondary: '#4ade80', // green-400
      accent: '#16a34a', // green-600
      surface: '#f0fdf4', // green-50
    },
    ui: {
      primary: '#3b82f6', // blue-500
      secondary: '#60a5fa', // blue-400
      accent: '#2563eb', // blue-600
      surface: '#eff6ff', // blue-50
    },
    text: {
      primary: '#eab308', // yellow-500
      secondary: '#facc15', // yellow-400
      accent: '#ca8a04', // yellow-600
      surface: '#fefce8', // yellow-50
    },
    effects: {
      primary: '#a855f7', // purple-500
      secondary: '#c084fc', // purple-400
      accent: '#9333ea', // purple-600
      surface: '#faf5ff', // purple-50
    },
  },
  
  // Spacing scale for PSD components
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px
    xl: '1.5rem',  // 24px
    '2xl': '2rem', // 32px
  },
  
  // Typography scale
  typography: {
    xs: { fontSize: '0.75rem', lineHeight: '1rem' },
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    base: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
    xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
  },
  
  // Elevation levels
  elevation: {
    low: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    high: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
} as const;

export type LayerCategoryType = keyof typeof psdTokens.layerCategories;
