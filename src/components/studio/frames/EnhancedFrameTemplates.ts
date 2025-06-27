
export interface EnhancedFrameTemplate {
  id: string;
  name: string;
  category: 'Modern' | 'Classic Sports' | 'Vintage Ornate' | 'Holographic' | 'Chrome' | 'Crystal' | 'Premium';
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  effects: {
    holographic?: boolean;
    metallic?: boolean;
    crystal?: boolean;
    glow?: boolean;
    animated?: boolean;
  };
  visual: {
    background: string;
    border: {
      width: string;
      style: string;
      color: string;
      gradient?: string;
    };
    shadow?: string;
    borderRadius: string;
    pattern?: string;
    animation?: string;
  };
  layout: {
    imageArea: { x: number; y: number; width: number; height: number };
    titleArea: { x: number; y: number; width: number; height: number };
    subtitleArea?: { x: number; y: number; width: number; height: number };
    statsArea?: { x: number; y: number; width: number; height: number };
  };
}

export const ENHANCED_FRAME_TEMPLATES: EnhancedFrameTemplate[] = [
  // Modern Category
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'Modern',
    description: 'Clean lines with subtle shadow depth',
    rarity: 'Common',
    effects: { glow: true },
    visual: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: {
        width: '2px',
        style: 'solid',
        color: '#e2e8f0',
        gradient: 'linear-gradient(45deg, #e2e8f0, #cbd5e1)'
      },
      shadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      borderRadius: '12px'
    },
    layout: {
      imageArea: { x: 20, y: 60, width: 260, height: 180 },
      titleArea: { x: 20, y: 20, width: 260, height: 30 },
      subtitleArea: { x: 20, y: 250, width: 260, height: 20 }
    }
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    category: 'Modern',
    description: 'Vibrant gradient with clean typography',
    rarity: 'Rare',
    effects: { glow: true, animated: true },
    visual: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: {
        width: '3px',
        style: 'solid',
        color: 'transparent',
        gradient: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)'
      },
      shadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      borderRadius: '16px',
      animation: 'glow-pulse 2s ease-in-out infinite alternate'
    },
    layout: {
      imageArea: { x: 25, y: 70, width: 250, height: 170 },
      titleArea: { x: 25, y: 25, width: 250, height: 35 },
      subtitleArea: { x: 25, y: 250, width: 250, height: 25 }
    }
  },

  // Classic Sports Category
  {
    id: 'classic-baseball',
    name: 'Classic Baseball',
    category: 'Classic Sports',
    description: 'Traditional baseball card with team colors',
    rarity: 'Common',
    effects: {},
    visual: {
      background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
      border: {
        width: '4px',
        style: 'solid',
        color: '#1e3a8a'
      },
      shadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.2)',
      borderRadius: '8px',
      pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)'
    },
    layout: {
      imageArea: { x: 30, y: 80, width: 240, height: 160 },
      titleArea: { x: 30, y: 30, width: 240, height: 35 },
      subtitleArea: { x: 30, y: 250, width: 240, height: 20 },
      statsArea: { x: 30, y: 280, width: 240, height: 60 }
    }
  },
  {
    id: 'classic-football',
    name: 'Classic Football',
    category: 'Classic Sports',
    description: 'Bold football card with championship feel',
    rarity: 'Rare',
    effects: { metallic: true },
    visual: {
      background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
      border: {
        width: '5px',
        style: 'double',
        color: '#065f46'
      },
      shadow: '0 6px 25px rgba(16, 185, 129, 0.4)',
      borderRadius: '10px',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)'
    },
    layout: {
      imageArea: { x: 25, y: 75, width: 250, height: 170 },
      titleArea: { x: 25, y: 25, width: 250, height: 40 },
      subtitleArea: { x: 25, y: 255, width: 250, height: 25 },
      statsArea: { x: 25, y: 290, width: 250, height: 70 }
    }
  },

  // Vintage Ornate Category
  {
    id: 'vintage-gold',
    name: 'Vintage Gold',
    category: 'Vintage Ornate',
    description: 'Ornate gold frame with decorative corners',
    rarity: 'Epic',
    effects: { metallic: true, glow: true },
    visual: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
      border: {
        width: '6px',
        style: 'ridge',
        color: '#92400e',
        gradient: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)'
      },
      shadow: '0 0 30px rgba(251, 191, 36, 0.6), inset 0 0 20px rgba(217, 119, 6, 0.3)',
      borderRadius: '12px',
      pattern: 'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.4) 2px, transparent 2px), radial-gradient(circle at 85% 85%, rgba(255,215,0,0.6) 1.5px, transparent 1.5px)'
    },
    layout: {
      imageArea: { x: 35, y: 85, width: 230, height: 150 },
      titleArea: { x: 35, y: 35, width: 230, height: 40 },
      subtitleArea: { x: 35, y: 245, width: 230, height: 25 }
    }
  },
  {
    id: 'vintage-ornate',
    name: 'Royal Ornate',
    category: 'Vintage Ornate',
    description: 'Elaborate decorative frame with royal styling',
    rarity: 'Legendary',
    effects: { metallic: true, glow: true, animated: true },
    visual: {
      background: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 30%, #fbbf24 70%, #7c2d12 100%)',
      border: {
        width: '8px',
        style: 'ridge',
        color: '#7c2d12',
        gradient: 'linear-gradient(45deg, #7c2d12, #dc2626, #fbbf24, #7c2d12)'
      },
      shadow: '0 0 40px rgba(220, 38, 38, 0.8), inset 0 0 30px rgba(124, 45, 18, 0.4)',
      borderRadius: '15px',
      pattern: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(251, 191, 36, 0.3) 10deg, transparent 20deg)',
      animation: 'royal-shimmer 3s ease-in-out infinite'
    },
    layout: {
      imageArea: { x: 40, y: 90, width: 220, height: 140 },
      titleArea: { x: 40, y: 40, width: 220, height: 40 },
      subtitleArea: { x: 40, y: 240, width: 220, height: 30 }
    }
  },

  // Holographic Category
  {
    id: 'holographic-rainbow',
    name: 'Rainbow Holographic',
    category: 'Holographic',
    description: 'Prismatic rainbow shimmer effect',
    rarity: 'Epic',
    effects: { holographic: true, animated: true },
    visual: {
      background: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #fb5607, #ff006e)',
      border: {
        width: '4px',
        style: 'solid',
        color: 'transparent',
        gradient: 'conic-gradient(from 0deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #fb5607, #ff006e)'
      },
      shadow: '0 0 50px rgba(255, 0, 110, 0.6)',
      borderRadius: '14px',
      animation: 'holographic-shift 2s linear infinite'
    },
    layout: {
      imageArea: { x: 30, y: 80, width: 240, height: 160 },
      titleArea: { x: 30, y: 30, width: 240, height: 40 },
      subtitleArea: { x: 30, y: 250, width: 240, height: 25 }
    }
  },
  {
    id: 'holographic-cosmic',
    name: 'Cosmic Holographic',
    category: 'Holographic',
    description: 'Deep space holographic with stellar effects',
    rarity: 'Legendary',
    effects: { holographic: true, glow: true, animated: true },
    visual: {
      background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      border: {
        width: '5px',
        style: 'solid',
        color: 'transparent',
        gradient: 'linear-gradient(45deg, #4c1d95, #7c3aed, #a855f7, #c084fc, #e879f9)'
      },
      shadow: '0 0 60px rgba(168, 85, 247, 0.8), inset 0 0 30px rgba(76, 29, 149, 0.4)',
      borderRadius: '16px',
      pattern: 'radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.3) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(236, 121, 249, 0.3) 1.5px, transparent 1.5px)',
      animation: 'cosmic-pulse 4s ease-in-out infinite'
    },
    layout: {
      imageArea: { x: 35, y: 85, width: 230, height: 150 },
      titleArea: { x: 35, y: 35, width: 230, height: 40 },
      subtitleArea: { x: 35, y: 245, width: 230, height: 30 }
    }
  },

  // Chrome Category
  {
    id: 'chrome-sleek',
    name: 'Chrome Sleek',
    category: 'Chrome',
    description: 'Polished chrome with mirror finish',
    rarity: 'Rare',
    effects: { metallic: true },
    visual: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      border: {
        width: '4px',
        style: 'solid',
        color: '#64748b',
        gradient: 'linear-gradient(45deg, #94a3b8, #64748b, #475569, #334155)'
      },
      shadow: '0 8px 32px rgba(100, 116, 139, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
      borderRadius: '12px'
    },
    layout: {
      imageArea: { x: 25, y: 75, width: 250, height: 170 },
      titleArea: { x: 25, y: 25, width: 250, height: 40 },
      subtitleArea: { x: 25, y: 255, width: 250, height: 25 }
    }
  },
  {
    id: 'chrome-elite',
    name: 'Chrome Elite',
    category: 'Chrome',
    description: 'Premium chrome with energy accents',
    rarity: 'Epic',
    effects: { metallic: true, glow: true },
    visual: {
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      border: {
        width: '5px',
        style: 'solid',
        color: 'transparent',
        gradient: 'linear-gradient(45deg, #06b6d4, #0891b2, #0e7490, #155e75)'
      },
      shadow: '0 0 40px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(8, 145, 178, 0.3)',
      borderRadius: '14px'
    },
    layout: {
      imageArea: { x: 30, y: 80, width: 240, height: 160 },
      titleArea: { x: 30, y: 30, width: 240, height: 40 },
      subtitleArea: { x: 30, y: 250, width: 240, height: 25 }
    }
  },

  // Crystal Category
  {
    id: 'crystal-clear',
    name: 'Crystal Clear',
    category: 'Crystal',
    description: 'Transparent crystal with light refraction',
    rarity: 'Epic',
    effects: { crystal: true, glow: true },
    visual: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
      border: {
        width: '3px',
        style: 'solid',
        color: 'rgba(203, 213, 225, 0.8)',
        gradient: 'linear-gradient(45deg, rgba(203, 213, 225, 0.8), rgba(148, 163, 184, 0.6))'
      },
      shadow: '0 8px 32px rgba(148, 163, 184, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.5)',
      borderRadius: '18px'
    },
    layout: {
      imageArea: { x: 30, y: 80, width: 240, height: 160 },
      titleArea: { x: 30, y: 30, width: 240, height: 40 },
      subtitleArea: { x: 30, y: 250, width: 240, height: 25 }
    }
  },
  {
    id: 'crystal-prismatic',
    name: 'Prismatic Crystal',
    category: 'Crystal',
    description: 'Multi-faceted crystal with rainbow dispersion',
    rarity: 'Legendary',
    effects: { crystal: true, holographic: true, animated: true },
    visual: {
      background: 'conic-gradient(from 0deg, rgba(255,255,255,0.9), rgba(240,249,255,0.8), rgba(219,234,254,0.9), rgba(255,255,255,0.9))',
      border: {
        width: '4px',
        style: 'solid',
        color: 'transparent',
        gradient: 'conic-gradient(from 45deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6), rgba(236, 72, 153, 0.6), rgba(59, 130, 246, 0.6))'
      },
      shadow: '0 0 50px rgba(147, 51, 234, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.6)',
      borderRadius: '20px',
      animation: 'crystal-facet 3s ease-in-out infinite'
    },
    layout: {
      imageArea: { x: 35, y: 85, width: 230, height: 150 },
      titleArea: { x: 35, y: 35, width: 230, height: 40 },
      subtitleArea: { x: 35, y: 245, width: 230, height: 30 }
    }
  }
];
