
// Simple frame configurations for the streamlined creator
export interface FrameConfig {
  id: string;
  name: string;
  category: string;
  description: string;
}

// Extended frame configuration for studio components
export interface FrameConfiguration {
  id: string;
  name: string;
  category: string;
  description: string;
  background: {
    type: 'gradient' | 'solid';
    colors: string[];
  };
  borders: {
    outer?: {
      color: string;
      width: number;
    };
    inner?: {
      color: string;
      width: number;
    };
  };
  textStyles: {
    title: {
      color: string;
      fontSize: string;
      fontWeight: string;
    };
    subtitle: {
      color: string;
      fontSize: string;
      fontWeight: string;
    };
  };
  emblem?: {
    text: string;
    color: string;
  };
  corners?: {
    style: string;
    color: string;
  };
}

export const getFrameConfigs = (): FrameConfig[] => [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Traditional',
    description: 'Traditional sports card design'
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    category: 'Modern',
    description: 'Modern holographic design'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Vintage',
    description: 'Ornate vintage design'
  },
  {
    id: 'donruss-special',
    name: 'Donruss Special',
    category: 'Special',
    description: 'Special edition Donruss style'
  },
  {
    id: 'donruss-rookie',
    name: 'Donruss Rookie',
    category: 'Rookie',
    description: 'Rookie card design'
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    category: 'Chrome',
    description: 'Shiny chrome finish'
  }
];

// Studio card frames with full configuration
export const STUDIO_CARD_FRAMES: FrameConfiguration[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Traditional',
    description: 'Traditional sports card design',
    background: {
      type: 'gradient',
      colors: ['#1e3a8a', '#3b82f6', '#60a5fa']
    },
    borders: {
      outer: {
        color: '#1e40af',
        width: 3
      },
      inner: {
        color: '#3b82f6',
        width: 1
      }
    },
    textStyles: {
      title: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      subtitle: {
        color: '#e2e8f0',
        fontSize: '12px',
        fontWeight: 'normal'
      }
    },
    emblem: {
      text: 'SPORTS CARD',
      color: '#fbbf24'
    }
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    category: 'Modern',
    description: 'Modern holographic design',
    background: {
      type: 'gradient',
      colors: ['#ff006e', '#8338ec', '#3a86ff']
    },
    borders: {
      outer: {
        color: '#8338ec',
        width: 3
      }
    },
    textStyles: {
      title: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      subtitle: {
        color: '#e2e8f0',
        fontSize: '12px',
        fontWeight: 'normal'
      }
    },
    emblem: {
      text: 'HOLOGRAPHIC',
      color: '#ff006e'
    },
    corners: {
      style: 'rounded',
      color: '#ff006e'
    }
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Vintage',
    description: 'Ornate vintage design',
    background: {
      type: 'gradient',
      colors: ['#fbbf24', '#f59e0b', '#d97706']
    },
    borders: {
      outer: {
        color: '#d97706',
        width: 4
      },
      inner: {
        color: '#fbbf24',
        width: 1
      }
    },
    textStyles: {
      title: {
        color: '#451a03',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      subtitle: {
        color: '#78350f',
        fontSize: '12px',
        fontWeight: 'normal'
      }
    },
    emblem: {
      text: 'VINTAGE',
      color: '#451a03'
    },
    corners: {
      style: 'ornate',
      color: '#d97706'
    }
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    category: 'Chrome',
    description: 'Shiny chrome finish',
    background: {
      type: 'gradient',
      colors: ['#6b7280', '#9ca3af', '#d1d5db']
    },
    borders: {
      outer: {
        color: '#374151',
        width: 3
      }
    },
    textStyles: {
      title: {
        color: '#111827',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      subtitle: {
        color: '#4b5563',
        fontSize: '12px',
        fontWeight: 'normal'
      }
    },
    emblem: {
      text: 'CHROME',
      color: '#374151'
    }
  }
];

export const getFrameById = (id: string): FrameConfig | null => {
  return getFrameConfigs().find(frame => frame.id === id) || null;
};

export const getStudioFrameById = (id: string): FrameConfiguration | null => {
  return STUDIO_CARD_FRAMES.find(frame => frame.id === id) || null;
};
