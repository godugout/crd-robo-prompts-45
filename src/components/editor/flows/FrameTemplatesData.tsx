
import type { FrameTemplate } from './FrameTemplate';

export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: 'classic-portrait',
    name: 'Classic Portrait',
    category: 'Traditional',
    description: 'Perfect for character cards and portraits',
    cutout_areas: [
      { 
        id: 'main-photo', 
        x: 10, 
        y: 15, 
        width: 80, 
        height: 60, 
        type: 'photo',
        placeholder: 'Main Photo'
      },
      { 
        id: 'title', 
        x: 10, 
        y: 80, 
        width: 80, 
        height: 8, 
        type: 'text',
        placeholder: 'Card Title'
      },
      { 
        id: 'description', 
        x: 10, 
        y: 90, 
        width: 80, 
        height: 5, 
        type: 'text',
        placeholder: 'Description'
      }
    ],
    default_colors: {
      background: '#1a1a1a',
      border: '#3b82f6',
      text: '#ffffff'
    },
    effects: ['border-glow'],
    tags: ['portrait', 'character', 'gaming', 'traditional']
  },
  {
    id: 'modern-split',
    name: 'Modern Split',
    category: 'Contemporary',
    description: 'Dynamic split layout for action cards',
    cutout_areas: [
      { 
        id: 'main-photo', 
        x: 50, 
        y: 10, 
        width: 45, 
        height: 70, 
        type: 'photo',
        placeholder: 'Action Photo'
      },
      { 
        id: 'title', 
        x: 5, 
        y: 20, 
        width: 40, 
        height: 12, 
        type: 'text',
        placeholder: 'Card Name'
      },
      { 
        id: 'stats', 
        x: 5, 
        y: 40, 
        width: 40, 
        height: 30, 
        type: 'text',
        placeholder: 'Stats & Info'
      },
      { 
        id: 'logo', 
        x: 5, 
        y: 5, 
        width: 15, 
        height: 10, 
        type: 'logo',
        placeholder: 'Brand'
      }
    ],
    default_colors: {
      background: '#0f172a',
      border: '#10b981',
      text: '#f8fafc'
    },
    effects: ['gradient-overlay', 'shadow'],
    tags: ['modern', 'action', 'sports', 'dynamic']
  },
  {
    id: 'circular-focus',
    name: 'Circular Focus',
    category: 'Creative',
    description: 'Unique circular design with artistic flair',
    cutout_areas: [
      { 
        id: 'main-photo', 
        x: 25, 
        y: 25, 
        width: 50, 
        height: 50, 
        type: 'photo',
        placeholder: 'Circular Photo'
      },
      { 
        id: 'title', 
        x: 10, 
        y: 80, 
        width: 80, 
        height: 8, 
        type: 'text',
        placeholder: 'Title'
      },
      { 
        id: 'subtitle', 
        x: 10, 
        y: 90, 
        width: 80, 
        height: 5, 
        type: 'text',
        placeholder: 'Subtitle'
      }
    ],
    default_colors: {
      background: '#7c2d12',
      border: '#f59e0b',
      text: '#fef3c7'
    },
    effects: ['circular-mask', 'vintage-border'],
    tags: ['creative', 'artistic', 'vintage', 'unique']
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'Minimal',
    description: 'Clean and simple design for professional cards',
    cutout_areas: [
      { 
        id: 'main-photo', 
        x: 5, 
        y: 5, 
        width: 90, 
        height: 60, 
        type: 'photo',
        placeholder: 'Main Image'
      },
      { 
        id: 'title', 
        x: 5, 
        y: 70, 
        width: 90, 
        height: 10, 
        type: 'text',
        placeholder: 'Clean Title'
      },
      { 
        id: 'details', 
        x: 5, 
        y: 85, 
        width: 90, 
        height: 10, 
        type: 'text',
        placeholder: 'Details'
      }
    ],
    default_colors: {
      background: '#ffffff',
      border: '#e5e7eb',
      text: '#111827'
    },
    effects: ['subtle-shadow'],
    tags: ['minimal', 'clean', 'professional', 'simple']
  },
  {
    id: 'gaming-legendary',
    name: 'Gaming Legendary',
    category: 'Gaming',
    description: 'Epic gaming card with special effects',
    cutout_areas: [
      { 
        id: 'character', 
        x: 15, 
        y: 20, 
        width: 70, 
        height: 50, 
        type: 'photo',
        placeholder: 'Character Art'
      },
      { 
        id: 'name', 
        x: 10, 
        y: 5, 
        width: 80, 
        height: 10, 
        type: 'text',
        placeholder: 'Character Name'
      },
      { 
        id: 'abilities', 
        x: 10, 
        y: 75, 
        width: 80, 
        height: 15, 
        type: 'text',
        placeholder: 'Special Abilities'
      },
      { 
        id: 'rarity', 
        x: 75, 
        y: 10, 
        width: 20, 
        height: 8, 
        type: 'logo',
        placeholder: 'Rarity'
      }
    ],
    default_colors: {
      background: '#1e1b4b',
      border: '#fbbf24',
      text: '#fef3c7'
    },
    effects: ['holographic', 'energy-glow', 'border-sparkle'],
    tags: ['gaming', 'legendary', 'holographic', 'epic']
  },
  {
    id: 'photo-collage',
    name: 'Photo Collage',
    category: 'Creative',
    description: 'Multiple photo areas for collection cards',
    cutout_areas: [
      { 
        id: 'main-photo', 
        x: 10, 
        y: 10, 
        width: 50, 
        height: 45, 
        type: 'photo',
        placeholder: 'Main Photo'
      },
      { 
        id: 'photo-2', 
        x: 65, 
        y: 10, 
        width: 30, 
        height: 20, 
        type: 'photo',
        placeholder: 'Photo 2'
      },
      { 
        id: 'photo-3', 
        x: 65, 
        y: 35, 
        width: 30, 
        height: 20, 
        type: 'photo',
        placeholder: 'Photo 3'
      },
      { 
        id: 'title', 
        x: 10, 
        y: 60, 
        width: 85, 
        height: 10, 
        type: 'text',
        placeholder: 'Collection Title'
      },
      { 
        id: 'description', 
        x: 10, 
        y: 75, 
        width: 85, 
        height: 20, 
        type: 'text',
        placeholder: 'Collection Details'
      }
    ],
    default_colors: {
      background: '#374151',
      border: '#8b5cf6',
      text: '#f3f4f6'
    },
    effects: ['photo-frames', 'collection-badge'],
    tags: ['collage', 'collection', 'multiple-photos', 'memories']
  }
];

export const FRAME_CATEGORIES = [
  'All',
  'Traditional',
  'Contemporary', 
  'Creative',
  'Minimal',
  'Gaming'
];
