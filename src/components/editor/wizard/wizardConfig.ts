
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
    id: 'tcg-classic', 
    name: 'TCG Classic', 
    category: 'Trading Cards',
    description: 'Traditional trading card game style like Pokemon',
    preview_url: '',
    template_data: { 
      style: 'tcg',
      aspectRatio: '2.5:3.5',
      layout: 'center-image',
      colors: {
        primary: '#2563eb',
        secondary: '#fbbf24',
        background: '#1e293b',
        text: '#ffffff'
      },
      regions: {
        image: { x: 10, y: 60, width: 280, height: 200 },
        title: { x: 20, y: 20, width: 260, height: 30 },
        stats: { x: 20, y: 270, width: 260, height: 80 }
      }
    },
    is_premium: false,
    usage_count: 2500,
    tags: ['tcg', 'gaming', 'classic']
  },
  { 
    id: 'sports-modern', 
    name: 'Sports Pro', 
    category: 'Sports',
    description: 'Modern sports card with athlete stats and team colors',
    preview_url: '',
    template_data: { 
      style: 'sports',
      aspectRatio: '2.5:3.5',
      layout: 'action-shot',
      colors: {
        primary: '#dc2626',
        secondary: '#ffffff',
        background: '#0f172a',
        accent: '#f59e0b'
      },
      regions: {
        image: { x: 15, y: 40, width: 270, height: 180 },
        playerName: { x: 20, y: 15, width: 260, height: 25 },
        team: { x: 20, y: 230, width: 120, height: 20 },
        position: { x: 160, y: 230, width: 120, height: 20 },
        stats: { x: 20, y: 260, width: 260, height: 90 }
      }
    },
    is_premium: false,
    usage_count: 1800,
    tags: ['sports', 'athlete', 'modern']
  },
  { 
    id: 'school-academic', 
    name: 'Academic Achievement', 
    category: 'Education',
    description: 'Professional school and academic recognition card',
    preview_url: '',
    template_data: { 
      style: 'academic',
      aspectRatio: '2.5:3.5',
      layout: 'formal-portrait',
      colors: {
        primary: '#059669',
        secondary: '#fbbf24',
        background: '#f8fafc',
        text: '#1e293b'
      },
      regions: {
        image: { x: 50, y: 50, width: 200, height: 150 },
        name: { x: 20, y: 15, width: 260, height: 25 },
        school: { x: 20, y: 210, width: 260, height: 20 },
        achievement: { x: 20, y: 240, width: 260, height: 60 },
        date: { x: 20, y: 310, width: 260, height: 20 }
      }
    },
    is_premium: false,
    usage_count: 950,
    tags: ['school', 'academic', 'achievement']
  },
  { 
    id: 'organization-corporate', 
    name: 'Corporate Elite', 
    category: 'Business',
    description: 'Professional corporate and organization member card',
    preview_url: '',
    template_data: { 
      style: 'corporate',
      aspectRatio: '2.5:3.5',
      layout: 'executive',
      colors: {
        primary: '#1e40af',
        secondary: '#e5e7eb',
        background: '#ffffff',
        accent: '#6366f1'
      },
      regions: {
        image: { x: 20, y: 80, width: 260, height: 140 },
        name: { x: 20, y: 20, width: 260, height: 30 },
        title: { x: 20, y: 50, width: 260, height: 20 },
        company: { x: 20, y: 230, width: 260, height: 25 },
        contact: { x: 20, y: 265, width: 260, height: 60 }
      }
    },
    is_premium: false,
    usage_count: 720,
    tags: ['corporate', 'business', 'professional']
  },
  { 
    id: 'friends-social', 
    name: 'Friends Forever', 
    category: 'Social',
    description: 'Fun and casual design for memories with friends',
    preview_url: '',
    template_data: { 
      style: 'social',
      aspectRatio: '2.5:3.5',
      layout: 'memory-card',
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        background: '#fdf2f8',
        accent: '#06b6d4'
      },
      regions: {
        image: { x: 25, y: 70, width: 250, height: 160 },
        title: { x: 20, y: 20, width: 260, height: 25 },
        subtitle: { x: 20, y: 45, width: 260, height: 20 },
        memory: { x: 20, y: 240, width: 260, height: 80 },
        date: { x: 20, y: 325, width: 260, height: 15 }
      }
    },
    is_premium: false,
    usage_count: 1400,
    tags: ['friends', 'social', 'memories']
  },
  { 
    id: 'vintage-retro', 
    name: 'Vintage Dreams', 
    category: 'Retro',
    description: 'Nostalgic vintage-inspired trading card style',
    preview_url: '',
    template_data: { 
      style: 'vintage',
      aspectRatio: '2.5:3.5',
      layout: 'classic-frame',
      colors: {
        primary: '#92400e',
        secondary: '#fbbf24',
        background: '#fef3c7',
        accent: '#dc2626'
      },
      regions: {
        image: { x: 30, y: 80, width: 240, height: 160 },
        title: { x: 20, y: 20, width: 260, height: 30 },
        subtitle: { x: 20, y: 50, width: 260, height: 20 },
        description: { x: 20, y: 250, width: 260, height: 70 },
        rarity: { x: 220, y: 320, width: 60, height: 20 }
      }
    },
    is_premium: true,
    usage_count: 850,
    tags: ['vintage', 'retro', 'classic']
  }
];
