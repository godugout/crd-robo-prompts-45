

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'full-bleed' | 'social';
  preview: string;
  tags: string[];
  is_premium: boolean; // Made required to match DesignTemplate
  usage_count: number; // Made required to match DesignTemplate
  template_data: {
    colors: {
      background: string;
      primary: string;
      secondary: string;
      accent: string;
      text: string;
    };
    regions: Record<string, {
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    layout_type: 'standard' | 'full-bleed-minimal' | 'full-bleed-social';
    supports_stickers?: boolean;
  };
}

export interface WizardStep {
  number: number;
  title: string;
  description: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    number: 1,
    title: 'Upload Photo',
    description: 'Add your main image or photo'
  },
  {
    number: 2,
    title: 'Select Template',
    description: 'Choose a design style'
  },
  {
    number: 3,
    title: 'Card Details',
    description: 'Add title and description'
  },
  {
    number: 4,
    title: 'Publishing',
    description: 'Set visibility and options'
  }
];

export const DEFAULT_TEMPLATES: TemplateConfig[] = [
  {
    id: 'tcg-classic',
    name: 'TCG Classic',
    description: 'Traditional trading card game layout',
    category: 'classic',
    preview: '/placeholder.svg',
    tags: ['gaming', 'tcg', 'classic'],
    is_premium: false,
    usage_count: 1250,
    template_data: {
      colors: {
        background: '#1e293b',
        primary: '#2563eb',
        secondary: '#fbbf24',
        accent: '#f59e0b',
        text: '#ffffff'
      },
      regions: {
        title: { x: 20, y: 20, width: 260, height: 40 },
        image: { x: 20, y: 70, width: 260, height: 200 },
        stats: { x: 20, y: 280, width: 260, height: 120 }
      },
      layout_type: 'standard'
    }
  },
  {
    id: 'sports-modern',
    name: 'Sports Modern',
    description: 'Modern sports card design',
    category: 'modern',
    preview: '/placeholder.svg',
    tags: ['sports', 'modern'],
    is_premium: false,
    usage_count: 890,
    template_data: {
      colors: {
        background: '#0f172a',
        primary: '#10b981',
        secondary: '#1f2937',
        accent: '#06b6d4',
        text: '#ffffff'
      },
      regions: {
        playerName: { x: 20, y: 20, width: 260, height: 35 },
        image: { x: 20, y: 65, width: 260, height: 220 },
        team: { x: 20, y: 295, width: 120, height: 25 },
        position: { x: 150, y: 295, width: 130, height: 25 },
        stats: { x: 20, y: 330, width: 260, height: 90 }
      },
      layout_type: 'standard'
    }
  },
  // NEW FULL-BLEED TEMPLATES
  {
    id: 'clean-photo-card',
    name: 'Clean Photo Card',
    description: 'Minimal full-bleed photo with clean overlay',
    category: 'full-bleed',
    preview: '/placeholder.svg',
    tags: ['photo', 'minimal', 'clean', 'full-bleed'],
    is_premium: false,
    usage_count: 432,
    template_data: {
      colors: {
        background: '#000000',
        primary: '#ffffff',
        secondary: 'rgba(0,0,0,0.7)',
        accent: '#16a085',
        text: '#ffffff'
      },
      regions: {
        background_image: { x: 0, y: 0, width: 300, height: 420 },
        logo: { x: 15, y: 15, width: 40, height: 20 },
        name: { x: 15, y: 375, width: 200, height: 30 },
        number: { x: 250, y: 15, width: 35, height: 20 }
      },
      layout_type: 'full-bleed-minimal'
    }
  },
  {
    id: 'social-sticker-card',
    name: 'Social Sticker Card',
    description: 'Full-bleed photo with customizable stickers and layers',
    category: 'full-bleed',
    preview: '/placeholder.svg',
    tags: ['social', 'stickers', 'custom', 'layers', 'full-bleed'],
    is_premium: true,
    usage_count: 267,
    template_data: {
      colors: {
        background: '#000000',
        primary: '#ffffff',
        secondary: '#ff6b6b',
        accent: '#4ecdc4',
        text: '#ffffff'
      },
      regions: {
        background_image: { x: 0, y: 0, width: 300, height: 420 },
        sticker_area: { x: 0, y: 0, width: 300, height: 420 }
      },
      layout_type: 'full-bleed-social',
      supports_stickers: true
    }
  }
];

export const TEMPLATE_CATEGORIES = [
  { id: 'classic', name: 'Classic', description: 'Traditional card layouts' },
  { id: 'modern', name: 'Modern', description: 'Contemporary designs' },
  { id: 'full-bleed', name: 'Full-Bleed Photo', description: 'Photo-focused templates' },
  { id: 'social', name: 'Social Media', description: 'Social sharing optimized' }
];

