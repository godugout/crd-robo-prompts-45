
export interface EnhancedFrameData {
  id: string;
  name: string;
  category: 'sports' | 'trading' | 'minimal' | 'vintage' | 'modern' | 'fantasy';
  description: string;
  template_data: {
    layout: 'portrait' | 'landscape';
    zones: {
      image: { x: number; y: number; width: number; height: number };
      title: { x: number; y: number; width: number; height: number };
      subtitle?: { x: number; y: number; width: number; height: number };
      stats?: { x: number; y: number; width: number; height: number };
      footer?: { x: number; y: number; width: number; height: number };
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    borders: {
      outer: { color: string; width: number; style: 'solid' | 'gradient' };
      inner?: { color: string; width: number; style: 'solid' | 'gradient' };
    };
    effects: {
      holographic?: boolean;
      foil?: boolean;
      metallic?: boolean;
      gradient?: boolean;
    };
  };
  preview_url?: string;
  rarity_support: ('common' | 'uncommon' | 'rare' | 'epic' | 'legendary')[];
}

export const ENHANCED_FRAMES: EnhancedFrameData[] = [
  {
    id: 'sports-classic',
    name: 'Sports Classic',
    category: 'sports',
    description: 'Traditional sports card design with team colors',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 20, y: 60, width: 260, height: 200 },
        title: { x: 20, y: 20, width: 260, height: 30 },
        subtitle: { x: 20, y: 270, width: 260, height: 20 },
        stats: { x: 20, y: 300, width: 260, height: 80 },
        footer: { x: 20, y: 390, width: 260, height: 20 }
      },
      colors: {
        primary: '#1e3a8a',
        secondary: '#3b82f6',
        accent: '#fbbf24',
        background: '#f8fafc',
        text: '#1e293b'
      },
      borders: {
        outer: { color: '#1e3a8a', width: 4, style: 'solid' },
        inner: { color: '#3b82f6', width: 2, style: 'solid' }
      },
      effects: {
        holographic: false,
        foil: false,
        metallic: false,
        gradient: true
      }
    },
    rarity_support: ['common', 'uncommon', 'rare', 'epic']
  },
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    category: 'modern',
    description: 'Premium holographic card with rainbow prismatic effects',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 25, y: 70, width: 250, height: 180 },
        title: { x: 25, y: 25, width: 250, height: 35 },
        subtitle: { x: 25, y: 260, width: 250, height: 25 },
        stats: { x: 25, y: 295, width: 250, height: 70 },
        footer: { x: 25, y: 375, width: 250, height: 25 }
      },
      colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#fbbf24',
        background: '#0f0f23',
        text: '#f1f5f9'
      },
      borders: {
        outer: { color: '#8b5cf6', width: 3, style: 'gradient' },
        inner: { color: '#a78bfa', width: 1, style: 'gradient' }
      },
      effects: {
        holographic: true,
        foil: true,
        metallic: true,
        gradient: true
      }
    },
    rarity_support: ['rare', 'epic', 'legendary']
  },
  {
    id: 'chrome-refractor',
    name: 'Chrome Refractor',
    category: 'modern',
    description: 'Sleek chrome finish with rainbow refraction',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 20, y: 65, width: 260, height: 190 },
        title: { x: 20, y: 20, width: 260, height: 35 },
        subtitle: { x: 20, y: 265, width: 260, height: 25 },
        stats: { x: 20, y: 300, width: 260, height: 75 },
        footer: { x: 20, y: 385, width: 260, height: 25 }
      },
      colors: {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#06b6d4',
        background: '#f3f4f6',
        text: '#111827'
      },
      borders: {
        outer: { color: '#374151', width: 3, style: 'gradient' },
        inner: { color: '#9ca3af', width: 1, style: 'solid' }
      },
      effects: {
        holographic: true,
        foil: false,
        metallic: true,
        gradient: true
      }
    },
    rarity_support: ['uncommon', 'rare', 'epic', 'legendary']
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    category: 'trading',
    description: 'Luxurious gold foil with authentic metallic shimmer',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 25, y: 75, width: 250, height: 170 },
        title: { x: 25, y: 30, width: 250, height: 35 },
        subtitle: { x: 25, y: 255, width: 250, height: 25 },
        stats: { x: 25, y: 290, width: 250, height: 70 },
        footer: { x: 25, y: 370, width: 250, height: 30 }
      },
      colors: {
        primary: '#d97706',
        secondary: '#f59e0b',
        accent: '#fbbf24',
        background: '#fffbeb',
        text: '#92400e'
      },
      borders: {
        outer: { color: '#d97706', width: 4, style: 'gradient' },
        inner: { color: '#f59e0b', width: 2, style: 'gradient' }
      },
      effects: {
        holographic: false,
        foil: true,
        metallic: true,
        gradient: true
      }
    },
    rarity_support: ['rare', 'epic', 'legendary']
  },
  {
    id: 'vintage-tobacco',
    name: 'Vintage Tobacco',
    category: 'vintage',
    description: 'Classic 1952 tobacco card style with aged paper texture',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 30, y: 80, width: 240, height: 160 },
        title: { x: 30, y: 35, width: 240, height: 35 },
        subtitle: { x: 30, y: 250, width: 240, height: 20 },
        stats: { x: 30, y: 280, width: 240, height: 60 },
        footer: { x: 30, y: 350, width: 240, height: 30 }
      },
      colors: {
        primary: '#92400e',
        secondary: '#d97706',
        accent: '#fbbf24',
        background: '#fef3c7',
        text: '#451a03'
      },
      borders: {
        outer: { color: '#92400e', width: 5, style: 'solid' },
        inner: { color: '#d97706', width: 2, style: 'solid' }
      },
      effects: {
        holographic: false,
        foil: false,
        metallic: false,
        gradient: false
      }
    },
    rarity_support: ['common', 'uncommon', 'rare']
  },
  {
    id: 'crystal-prism',
    name: 'Crystal Prism',
    category: 'fantasy',
    description: 'Crystalline faceted surface with rainbow light dispersion',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 25, y: 75, width: 250, height: 170 },
        title: { x: 25, y: 30, width: 250, height: 35 },
        subtitle: { x: 25, y: 255, width: 250, height: 25 },
        stats: { x: 25, y: 290, width: 250, height: 70 },
        footer: { x: 25, y: 370, width: 250, height: 30 }
      },
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        accent: '#06b6d4',
        background: '#1e1b4b',
        text: '#e0e7ff'
      },
      borders: {
        outer: { color: '#7c3aed', width: 4, style: 'gradient' },
        inner: { color: '#a855f7', width: 2, style: 'gradient' }
      },
      effects: {
        holographic: true,
        foil: true,
        metallic: false,
        gradient: true
      }
    },
    rarity_support: ['rare', 'epic', 'legendary']
  },
  {
    id: 'minimal-modern',
    name: 'Minimal Modern',
    category: 'minimal',
    description: 'Clean contemporary design with subtle gradients',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 30, y: 70, width: 240, height: 180 },
        title: { x: 30, y: 30, width: 240, height: 30 },
        subtitle: { x: 30, y: 260, width: 240, height: 20 },
        stats: { x: 30, y: 290, width: 240, height: 60 },
        footer: { x: 30, y: 360, width: 240, height: 20 }
      },
      colors: {
        primary: '#000000',
        secondary: '#374151',
        accent: '#10b981',
        background: '#ffffff',
        text: '#111827'
      },
      borders: {
        outer: { color: '#e5e7eb', width: 2, style: 'solid' },
        inner: { color: '#f3f4f6', width: 1, style: 'solid' }
      },
      effects: {
        holographic: false,
        foil: false,
        metallic: false,
        gradient: false
      }
    },
    rarity_support: ['common', 'uncommon', 'rare', 'epic', 'legendary']
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    category: 'modern',
    description: 'Futuristic neon-lit design with electric effects',
    template_data: {
      layout: 'portrait',
      zones: {
        image: { x: 25, y: 70, width: 250, height: 180 },
        title: { x: 25, y: 25, width: 250, height: 35 },
        subtitle: { x: 25, y: 260, width: 250, height: 25 },
        stats: { x: 25, y: 295, width: 250, height: 70 },
        footer: { x: 25, y: 375, width: 250, height: 25 }
      },
      colors: {
        primary: '#06b6d4',
        secondary: '#0891b2',
        accent: '#f0f',
        background: '#0a0a0a',
        text: '#00ffff'
      },
      borders: {
        outer: { color: '#06b6d4', width: 3, style: 'gradient' },
        inner: { color: '#f0f', width: 1, style: 'gradient' }
      },
      effects: {
        holographic: false,
        foil: false,
        metallic: true,
        gradient: true
      }
    },
    rarity_support: ['uncommon', 'rare', 'epic', 'legendary']
  }
];

export const getFramesByCategory = (category: string) => {
  if (category === 'all') return ENHANCED_FRAMES;
  return ENHANCED_FRAMES.filter(frame => frame.category === category);
};

export const getFrameById = (id: string) => {
  return ENHANCED_FRAMES.find(frame => frame.id === id);
};
