
// Enhanced Cardshow Design System - Professional Color Palette
export const enhancedCardshowColors = {
  // Core Brand Colors - Semantic Context
  semantic: {
    collections: '#22C55E',  // Green - Collections context
    cards: '#F97316',        // Orange - Cards context  
    shops: '#3B82F6',        // Blue - Shops/Marketplace context
    currency: '#FACC15',     // Gold - CRD tokens context
    professional: '#8B5CF6', // Purple - Professional/Premium features
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#06B6D4'
  },

  // Professional Background System
  backgrounds: {
    primary: '#0A0A0B',       // Deep black primary
    elevated: '#1A1A1B',      // Elevated surfaces
    surface: '#252526',       // Surface elements
    panel: '#2D2D30',         // Panel backgrounds
    overlay: '#3C3C3F',       // Overlay elements
    glass: 'rgba(255, 255, 255, 0.05)', // Glass morphism
  },

  // Professional Text System
  text: {
    primary: '#FFFFFF',       // Primary white text
    secondary: '#E5E5E7',     // Secondary text
    muted: '#9CA3AF',         // Muted text
    placeholder: '#6B7280',   // Placeholder text
    accent: '#F97316',        // Accent text (orange)
    link: '#3B82F6',          // Link text (blue)
  },

  // Professional Border System
  borders: {
    subtle: '#404040',        // Subtle borders
    default: '#525252',       // Default borders
    strong: '#737373',        // Strong borders
    accent: '#F97316',        // Accent borders
    focus: '#3B82F6',         // Focus states
  },

  // Professional Status Colors
  status: {
    active: '#22C55E',        // Active state
    pending: '#F59E0B',       // Pending state
    inactive: '#6B7280',      // Inactive state
    premium: '#8B5CF6',       // Premium features
  }
} as const;

// Gradient System
export const gradients = {
  primary: 'linear-gradient(135deg, #0A0A0B 0%, #1A1A1B 100%)',
  elevated: 'linear-gradient(135deg, #1A1A1B 0%, #252526 100%)',
  accent: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
  professional: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
} as const;

export type EnhancedSemanticColor = keyof typeof enhancedCardshowColors.semantic;
export type ProfessionalBackground = keyof typeof enhancedCardshowColors.backgrounds;
export type ProfessionalText = keyof typeof enhancedCardshowColors.text;
