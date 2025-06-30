
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
        // CARDSHOW Design System Colors
        'cardshow': {
          // Primary Blue Scale
          'primary-50': '#EBF3FF',
          'primary-100': '#D7E7FF',
          'primary-200': '#ADD0FF',
          'primary-300': '#84B9FF',
          'primary-400': '#5AA2FF',
          'primary': '#3772FF',
          'primary-600': '#2C5BCC',
          'primary-700': '#214499',
          'primary-800': '#162D66',
          'primary-900': '#0B1633',
          
          // Secondary Orange Scale
          'secondary-50': '#FFF8F0',
          'secondary-100': '#FFECD6',
          'secondary-200': '#FFD5AD',
          'secondary-300': '#FFBE84',
          'secondary-400': '#FFA75B',
          'secondary': '#F97316',
          'secondary-600': '#CC5C12',
          'secondary-700': '#99450D',
          'secondary-800': '#662E09',
          'secondary-900': '#331704',
          
          // Dark Scale
          'dark-100': '#23262F',
          'dark-200': '#1E2026',
          'dark-300': '#191B1F',
          'dark': '#141416',
          'dark-500': '#0F0F10',
          'dark-600': '#0A0A0B',
          'dark-700': '#070708',
          'dark-800': '#040405',
          'dark-900': '#000000',
          
          // Light Scale
          'light': '#FCFCFD',
          'light-200': '#F4F5F6',
          'light-300': '#E6E8EC',
          'light-400': '#B1B5C3',
          'light-500': '#A0A3AF',
          'light-600': '#898E9B',
          'light-700': '#777E90',
          'light-800': '#616774',
          'light-900': '#4B505C',
        },
        
        // Brand Colors (legacy compatibility)
        'crd-green': '#27AE60',
        'crd-blue': '#2D9CDB',
        'crd-orange': '#EA6E48',
        'crd-white': '#FCFCFD',
        'crd-lightGray': '#777E90',
        'crd-mediumGray': '#353945',
        'crd-darkGray': '#23262F',
        'crd-dark': '#141416',
        'crd-darkest': '#141416',
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
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'hero': '40px',
        'section': '36px',
        'subsection': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '128': '32rem',
        '160': '40rem',
      },
      boxShadow: {
        'cardshow': '0px 64px 64px -48px rgba(31,47,70,0.12)',
        'cardshow-hover': '0 10px 25px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
