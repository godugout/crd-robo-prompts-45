
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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        // Studio Professional Theme Colors
        'studio': {
          'bg': '#f8fafc',           // Primary background
          'surface': '#ffffff',       // Cards, panels
          'border': '#e2e8f0',       // Borders
          'text': '#0f172a',         // Primary text
          'text-secondary': '#475569', // Secondary text
          'text-muted': '#64748b',    // Muted text
        },
        // Brand Colors - Updated for Studio Professional
        'crd-green': '#4ade80',         // Primary brand green
        'crd-green-hover': '#22c55e',   // Green hover state
        'crd-green-light': '#dcfce7',   // Light green background
        'crd-blue': '#3b82f6',          // Accent blue
        'crd-blue-light': '#dbeafe',    // Light blue background
        'crd-orange': '#f97316',        // Accent orange
        'crd-orange-light': '#fed7aa',  // Light orange background
        'crd-yellow': '#eab308',        // Accent yellow
        'crd-purple': '#8b5cf6',        // Premium purple
        
        // Navigation Colors
        'nav-dark': '#0f172a',          // Dark navy navigation
        'nav-text': '#ffffff',          // Navigation text
        'nav-secondary': '#64748b',     // Secondary nav text
        
        // Legacy color compatibility (gradually phase out)
        'crd-white': '#ffffff',
        'crd-lightGray': '#64748b',
        'crd-mediumGray': '#475569',
        'crd-darkGray': '#334155',
        'crd-dark': '#1e293b',
        'crd-darkest': '#0f172a',
        
        // Editor colors (for PSD tools and creation interfaces)
        'editor-bg': '#ffffff',
        'editor-panel': '#f8fafc',
        'editor-border': '#e2e8f0',
        'editor-text': '#0f172a',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(-16px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)"
          }
        },
        "shimmer": {
          "0%": {
            "background-position": "-200% 0"
          },
          "100%": {
            "background-position": "200% 0"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "shimmer": "shimmer 1.5s infinite",
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'dancing': ['Dancing Script', 'cursive'],
      },
      boxShadow: {
        'studio-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'studio-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'studio-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'studio-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
