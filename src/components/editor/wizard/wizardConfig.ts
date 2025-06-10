import { Wand2, Upload, Settings, Share } from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: string;
}

export interface FrameTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url?: string;
  is_premium?: boolean;
  usage_count?: number;
  tags: string[];
  template_data: {
    layout: string;
    style: {
      primaryColor: string;
      accentColor: string;
      backgroundColor: string;
      borderRadius: number;
      borderWidth: number;
    };
    typography: {
      titleFont: string;
      bodyFont: string;
      titleSize: number;
      bodySize: number;
    };
    effects?: string[];
    supports_stickers?: boolean;
  };
  default_colors?: {
    background: string;
    border: string;
    text: string;
  };
  effects?: string[];
}

// Backward compatibility - keep old interface name
export type TemplateConfig = FrameTemplate;

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'frame',
    title: 'Choose Frame',
    description: 'Select a frame style for your card',
    icon: Settings,
    component: 'FramesStep'
  },
  {
    id: 'photo',
    title: 'Add Photo',
    description: 'Upload and position your image',
    icon: Upload,
    component: 'PhotoStep'
  },
  {
    id: 'adjust',
    title: 'Adjust Image',
    description: 'Fine-tune positioning and scale',
    icon: Wand2,
    component: 'EnhancedImageAdjustmentStep'
  },
  {
    id: 'share',
    title: 'Share & Export',
    description: 'Save and share your creation',
    icon: Share,
    component: 'ShareStep'
  }
];

export const DEFAULT_FRAMES: FrameTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Card Frame',
    category: 'traditional',
    description: 'A timeless card design perfect for any photo',
    is_premium: false,
    usage_count: 1247,
    tags: ['classic', 'traditional', 'versatile', 'photo'],
    template_data: {
      layout: 'standard',
      style: {
        primaryColor: '#16a085',
        accentColor: '#ecf0f1',
        backgroundColor: '#1a1a2e',
        borderRadius: 8,
        borderWidth: 2
      },
      typography: {
        titleFont: 'Inter',
        bodyFont: 'Inter',
        titleSize: 18,
        bodySize: 14
      },
      effects: ['border', 'shadow'],
      supports_stickers: true
    },
    default_colors: {
      background: '#1a1a2e',
      border: '#16a085',
      text: '#ecf0f1'
    }
  },
  {
    id: 'vintage',
    name: 'Vintage Card Frame',
    category: 'vintage',
    description: 'Nostalgic design with classic typography and warm colors',
    is_premium: false,
    usage_count: 892,
    tags: ['vintage', 'retro', 'warm', 'classic'],
    template_data: {
      layout: 'vintage',
      style: {
        primaryColor: '#e07a5f',
        accentColor: '#3d405b',
        backgroundColor: '#f4f1de',
        borderRadius: 12,
        borderWidth: 3
      },
      typography: {
        titleFont: 'serif',
        bodyFont: 'serif',
        titleSize: 20,
        bodySize: 15
      },
      effects: ['texture', 'sepia'],
      supports_stickers: true
    },
    default_colors: {
      background: '#f4f1de',
      border: '#e07a5f',
      text: '#3d405b'
    }
  },
  {
    id: 'modern',
    name: 'Modern Edge Frame',
    category: 'modern',
    description: 'Sleek contemporary design with bold colors and clean lines',
    is_premium: true,
    usage_count: 634,
    tags: ['modern', 'sleek', 'contemporary', 'bold'],
    template_data: {
      layout: 'modern',
      style: {
        primaryColor: '#8e44ad',
        accentColor: '#f39c12',
        backgroundColor: '#2d1b69',
        borderRadius: 6,
        borderWidth: 1
      },
      typography: {
        titleFont: 'sans-serif',
        bodyFont: 'sans-serif',
        titleSize: 16,
        bodySize: 12
      },
      effects: ['gradient', 'glow'],
      supports_stickers: true
    },
    default_colors: {
      background: '#2d1b69',
      border: '#8e44ad',
      text: '#f39c12'
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow Frame',
    category: 'futuristic',
    description: 'Futuristic neon design perfect for gaming and tech themes',
    is_premium: true,
    usage_count: 423,
    tags: ['neon', 'futuristic', 'gaming', 'tech'],
    template_data: {
      layout: 'futuristic',
      style: {
        primaryColor: '#ff006e',
        accentColor: '#8338ec',
        backgroundColor: '#0f0f23',
        borderRadius: 4,
        borderWidth: 2
      },
      typography: {
        titleFont: 'monospace',
        bodyFont: 'monospace',
        titleSize: 14,
        bodySize: 11
      },
      effects: ['neon', 'glow', 'holographic'],
      supports_stickers: true
    },
    default_colors: {
      background: '#0f0f23',
      border: '#ff006e',
      text: '#8338ec'
    }
  }
];

// Backward compatibility - export with old name
export const DEFAULT_TEMPLATES = DEFAULT_FRAMES;
