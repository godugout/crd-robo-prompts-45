
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
  safelist: [
    // Dynamic color classes for effect sliders
    'bg-purple-400', 'bg-purple-400/20', 'bg-purple-400/40', 'border-purple-400', 'border-purple-400/40', 'shadow-purple-400/50',
    'bg-yellow-400', 'bg-yellow-400/20', 'bg-yellow-400/40', 'border-yellow-400', 'border-yellow-400/40', 'shadow-yellow-400/50',
    'bg-blue-400', 'bg-blue-400/20', 'bg-blue-400/40', 'border-blue-400', 'border-blue-400/40', 'shadow-blue-400/50',
    'bg-gray-400', 'bg-gray-400/20', 'bg-gray-400/40', 'border-gray-400', 'border-gray-400/40', 'shadow-gray-400/50',
    'bg-green-400', 'bg-green-400/20', 'bg-green-400/40', 'border-green-400', 'border-green-400/40', 'shadow-green-400/50',
    'bg-orange-400', 'bg-orange-400/20', 'bg-orange-400/40', 'border-orange-400', 'border-orange-400/40', 'shadow-orange-400/50',
    'bg-cyan-400', 'bg-cyan-400/20', 'bg-cyan-400/40', 'border-cyan-400', 'border-cyan-400/40', 'shadow-cyan-400/50',
    'bg-amber-400', 'bg-amber-400/20', 'bg-amber-400/40', 'border-amber-400', 'border-amber-400/40', 'shadow-amber-400/50',
    // Slider track and thumb classes with dynamic colors
    '[&>span]:bg-purple-400/20', '[&>span]:border-purple-400/40', '[&>span>span]:bg-purple-400/40', '[&>span>span>span]:bg-purple-400', '[&>span>span>span]:border-purple-400', '[&>span>span>span]:shadow-purple-400/50',
    '[&>span]:bg-yellow-400/20', '[&>span]:border-yellow-400/40', '[&>span>span]:bg-yellow-400/40', '[&>span>span>span]:bg-yellow-400', '[&>span>span>span]:border-yellow-400', '[&>span>span>span]:shadow-yellow-400/50',
    '[&>span]:bg-blue-400/20', '[&>span]:border-blue-400/40', '[&>span>span]:bg-blue-400/40', '[&>span>span>span]:bg-blue-400', '[&>span>span>span]:border-blue-400', '[&>span>span>span]:shadow-blue-400/50',
    '[&>span]:bg-gray-400/20', '[&>span]:border-gray-400/40', '[&>span>span]:bg-gray-400/40', '[&>span>span>span]:bg-gray-400', '[&>span>span>span]:border-gray-400', '[&>span>span>span]:shadow-gray-400/50',
    '[&>span]:bg-green-400/20', '[&>span]:border-green-400/40', '[&>span>span]:bg-green-400/40', '[&>span>span>span]:bg-green-400', '[&>span>span>span]:border-green-400', '[&>span>span>span]:shadow-green-400/50',
    '[&>span]:bg-orange-400/20', '[&>span]:border-orange-400/40', '[&>span>span]:bg-orange-400/40', '[&>span>span>span]:bg-orange-400', '[&>span>span>span]:border-orange-400', '[&>span>span>span]:shadow-orange-400/50',
    '[&>span]:bg-cyan-400/20', '[&>span]:border-cyan-400/40', '[&>span>span]:bg-cyan-400/40', '[&>span>span>span]:bg-cyan-400', '[&>span>span>span]:border-cyan-400', '[&>span>span>span]:shadow-cyan-400/50',
    '[&>span]:bg-amber-400/20', '[&>span]:border-amber-400/40', '[&>span>span]:bg-amber-400/40', '[&>span>span>span]:bg-amber-400', '[&>span>span>span]:border-amber-400', '[&>span>span>span]:shadow-amber-400/50',
  ],
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
