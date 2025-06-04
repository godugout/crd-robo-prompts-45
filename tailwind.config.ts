import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // CRD Design System
        crd: {
          // Base colors
          darkest: '#121212',
          dark: '#1A1A1A',
          darkGray: '#23262F',
          mediumGray: '#353945',
          lightGray: '#777E90',
          white: '#FCFCFD',
          
          // Brand colors
          orange: '#EA6E48',
          blue: '#3772FF',
          green: '#45B26B',
          purple: '#9757D7',
          gold: '#FFD700',
        },
        // Cardshow colors to match CSS variables
        cardshow: {
          green: 'var(--cardshow-green)',
          orange: 'var(--cardshow-orange)',
          purple: 'var(--cardshow-purple)',
          blue: 'var(--cardshow-blue)',
          white: 'var(--cardshow-white)',
          lightGray: 'var(--cardshow-lightGray)',
          mediumGray: 'var(--cardshow-mediumGray)',
          darkGray: 'var(--cardshow-darkGray)',
          darkest: 'var(--cardshow-darkest)',
        },
        // Editor colors
        editor: {
          dark: 'var(--editor-dark)',
          darker: 'var(--editor-darker)',
          tool: 'var(--editor-tool)',
          border: 'var(--editor-border)',
          canvas: 'var(--editor-canvas)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        // NEW: Enhanced logo animations
        'logo-shimmer': {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        },
        'logo-glow-pulse': {
          '0%, 100%': {
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.0))'
          },
          '50%': {
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))'
          }
        },
        'gradient-shift': {
          '0%': {
            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(59, 130, 246, 0.1) 100%)'
          },
          '33%': {
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(139, 92, 246, 0.1) 100%)'
          },
          '66%': {
            background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 215, 0, 0.1) 100%)'
          },
          '100%': {
            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(59, 130, 246, 0.1) 100%)'
          }
        },
        'holographic-flow': {
          '0%': {
            transform: 'translateX(-100%) rotate(45deg)',
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(100%) rotate(45deg)',
            opacity: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        // NEW: Enhanced logo animations
        'logo-shimmer': 'logo-shimmer 3s ease-in-out infinite',
        'logo-glow-pulse': 'logo-glow-pulse 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'holographic-flow': 'holographic-flow 2s ease-in-out infinite'
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
