
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
  };
}

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
      }
    }
  },
  {
    id: 'vintage',
    name: 'Vintage Card Frame',
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
      }
    }
  },
  {
    id: 'modern',
    name: 'Modern Edge Frame',
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
      }
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow Frame',
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
      }
    }
  }
];
