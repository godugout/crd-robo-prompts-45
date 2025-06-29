
// Professional Design Tokens - Matching Mockup Patterns
export const professionalTokens = {
  // Spacing System (Based on 8px grid)
  spacing: {
    xs: '4px',     // 0.5 * base
    sm: '8px',     // base unit
    md: '16px',    // 2 * base
    lg: '24px',    // 3 * base
    xl: '32px',    // 4 * base
    '2xl': '48px', // 6 * base
    '3xl': '64px', // 8 * base
    '4xl': '96px', // 12 * base
  },

  // Professional Typography Scale
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'monospace'],
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    }
  },

  // Professional Border Radius
  radius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Professional Shadow System
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.15)',
    base: '0 4px 6px rgba(0, 0, 0, 0.1)',
    md: '0 8px 16px rgba(0, 0, 0, 0.15)',
    lg: '0 16px 32px rgba(0, 0, 0, 0.2)',
    xl: '0 24px 48px rgba(0, 0, 0, 0.25)',
    professional: '0 8px 32px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(249, 115, 22, 0.3)',
  },

  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      base: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const;

export type ProfessionalToken = typeof professionalTokens;
