
import type { DesignTemplate } from '@/hooks/useCardEditor';

export interface WizardStep {
  number: number;
  title: string;
  description: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { number: 1, title: 'Upload Photo', description: 'Add your image' },
  { number: 2, title: 'Choose Template', description: 'Select design style' },
  { number: 3, title: 'Card Details', description: 'Review AI suggestions' },
  { number: 4, title: 'Publishing', description: 'Set visibility & options' }
];

export const DEFAULT_TEMPLATES: DesignTemplate[] = [
  { 
    id: 'classic', 
    name: 'Classic Frame', 
    category: 'Traditional',
    description: 'Timeless design with elegant borders',
    preview_url: '',
    template_data: { style: 'classic', borderWidth: 2 },
    is_premium: false,
    usage_count: 1250,
    tags: ['classic', 'elegant']
  },
  { 
    id: 'vintage', 
    name: 'Vintage Sports', 
    category: 'Sports',
    description: 'Retro-inspired trading card style',
    preview_url: '',
    template_data: { style: 'vintage', overlay: 'sepia' },
    is_premium: false,
    usage_count: 890,
    tags: ['vintage', 'sports', 'retro']
  },
  { 
    id: 'modern', 
    name: 'Modern Minimal', 
    category: 'Contemporary',
    description: 'Clean, modern design aesthetic',
    preview_url: '',
    template_data: { style: 'modern', layout: 'minimal' },
    is_premium: false,
    usage_count: 2100,
    tags: ['modern', 'minimal', 'clean']
  },
  { 
    id: 'neon', 
    name: 'Neon Cyber', 
    category: 'Futuristic',
    description: 'Futuristic cyberpunk-inspired design',
    preview_url: '',
    template_data: { style: 'neon', effects: ['glow', 'gradient'] },
    is_premium: true,
    usage_count: 750,
    tags: ['neon', 'cyber', 'futuristic']
  }
];
