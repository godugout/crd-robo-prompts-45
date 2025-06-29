
// Cardshow Design System - Design Tokens
export const designTokens = {
  // Typography System
  typography: {
    fontFamily: {
      primary: ['Inter', 'sans-serif'],
      secondary: ['Orbitron', 'monospace'], // Keep for special cases
      display: ['Dancing Script', 'cursive'] // Keep for special cases
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px', // Base size
      lg: '20px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '40px'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8
    }
  },
  
  // Spacing System
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  
  // Border Radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '9999px'
  },
  
  // Shadow System
  shadow: {
    card: '0px 4px 12px rgba(0,0,0,0.25)',
    hover: '0px 6px 20px rgba(0,0,0,0.35)',
    elevated: '0px 8px 32px rgba(0,0,0,0.4)',
    soft: '0px 2px 8px rgba(0,0,0,0.15)'
  },
  
  // Animation & Transitions
  animation: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

// Component-specific tokens
export const componentTokens = {
  card: {
    background: '#1E1E1E',
    border: '#333333',
    radius: designTokens.radius.lg,
    shadow: designTokens.shadow.card,
    hoverShadow: designTokens.shadow.hover
  },
  
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px'
    },
    padding: {
      sm: '8px 16px',
      md: '12px 24px',
      lg: '16px 32px'
    },
    radius: designTokens.radius.md
  },
  
  input: {
    height: '40px',
    padding: '12px 16px',
    radius: designTokens.radius.md,
    border: '#333333',
    background: '#1E1E1E'
  }
} as const;

export type DesignToken = typeof designTokens;
export type ComponentToken = typeof componentTokens;
