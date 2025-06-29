import type { Config } from "tailwindcss";
import { cardshowColors, designTokens } from "./src/components/ui/design-system/design-tokens";

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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Shadcn UI colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Cardshow Design System Colors
        'cardshow': {
          // Primary brand colors with semantic roles
          'collections': '#22C55E',  // Green for collections
          'cards': '#F97316',        // Orange for cards  
          'shops': '#3B82F6',        // Blue for shops/marketplace
          'currency': '#FACC15',     // Gold for CRD tokens
          
          // Extended palette
          'blue-600': '#0063f7',
          'blue-500': '#0083c9',
          'blue-400': '#009ff5',
          'blue-300': '#53bdf5',
          'blue-200': '#5b8def',
          'blue-100': '#3e7bfa',
          
          'green-500': '#06c270',
          'green-400': '#1fc16b',
          'green-300': '#39d98a',
          'green-200': '#57eba1', 
          'green-100': '#84ebb4',
          
          'purple-600': '#2a008c',
          'purple-500': '#3c00c6',
          'purple-400': '#4d00ff',
          'purple-300': '#8855ff',
          
          'gray-900': '#1c1c1c',
          'gray-800': '#1f1f1f',
          'gray-700': '#28293d',
          'gray-600': '#2d3339',
          'gray-500': '#333333',
          'gray-400': '#404040',
          'gray-300': '#4a4a4a',
          'gray-200': '#555770',
          'gray-100': '#606060',
          
          // Background system
          'bg-default': '#12151C',
          'bg-elevated': '#1E1E1E',
          'bg-surface': '#F5F5F5'
        },

        // Legacy CRD colors - keeping for compatibility
        'crd-green': '#22C55E',
        'crd-green-secondary': '#1fc16b',
        'crd-green-accent': '#06c270',
        'crd-orange': '#F97316',
        'crd-blue': '#3B82F6',
        'crd-purple': '#4d00ff',
        'crd-white': '#FCFCFD',
        'crd-lightGray': '#555770',
        'crd-mediumGray': '#333333',
        'crd-darkGray': '#28293d',
        'crd-dark': '#1f1f1f',
        'crd-darkest': '#12151C',
        
        // Editor colors
        'editor-dark': '#1f1f1f',
        'editor-darker': '#12151C',
        'editor-tool': '#2d3339',
        'editor-border': '#333333',
        'editor-canvas': '#28293d',
      },
      
      // Typography system
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'orbitron': ['Orbitron', 'monospace'],
        'dancing': ['Dancing Script', 'cursive'],
      },
      
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px'
      },
      
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700'
      },
      
      // Spacing system
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px'
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Design system radius
        'ds-sm': '4px',
        'ds-md': '8px', 
        'ds-lg': '12px',
        'ds-xl': '16px',
        'ds-pill': '9999px'
      },
      
      // Shadow system
      boxShadow: {
        'card': '0px 4px 12px rgba(0,0,0,0.25)',
        'hover': '0px 6px 20px rgba(0,0,0,0.35)',
        'elevated': '0px 8px 32px rgba(0,0,0,0.4)',
        'soft': '0px 2px 8px rgba(0,0,0,0.15)'
      },
      
      // Animation system
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms', 
        'slow': '400ms'
      },
      
      transitionTimingFunction: {
        'cardshow': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
