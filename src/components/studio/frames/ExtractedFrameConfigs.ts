
export interface FrameConfig {
  id: string;
  name: string;
  preview: string;
  description: string;
  style: {
    background: string;
    border: string;
    borderWidth: string;
    borderRadius: string;
    boxShadow?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
  };
  overlayElements?: {
    type: 'gradient' | 'pattern' | 'texture';
    style: React.CSSProperties;
  }[];
}

export const EXTRACTED_FRAMES: FrameConfig[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    preview: '🏀',
    description: 'Blue and pink gradient frame with vintage sports styling',
    style: {
      background: 'linear-gradient(135deg, #4A90E2 0%, #E91E63 100%)',
      border: '4px solid #1E3A8A',
      borderWidth: '4px',
      borderRadius: '12px',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.2)'
    },
    overlayElements: [
      {
        type: 'gradient',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
          borderRadius: '8px'
        }
      }
    ]
  },
  {
    id: 'vintage-baseball',
    name: 'Vintage Baseball',
    preview: '⚾',
    description: 'Cloud background with red border, classic baseball card style',
    style: {
      background: 'linear-gradient(180deg, #87CEEB 0%, #F0F8FF 50%, #87CEEB 100%)',
      border: '3px solid #DC143C',
      borderWidth: '3px',
      borderRadius: '8px',
      backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.8) 10%, transparent 20%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.6) 8%, transparent 15%)',
      backgroundSize: '100px 100px, 150px 150px'
    },
    overlayElements: [
      {
        type: 'texture',
        style: {
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          border: '1px solid rgba(220, 20, 60, 0.3)',
          borderRadius: '4px'
        }
      }
    ]
  },
  {
    id: 'premium-stars',
    name: 'Premium Stars',
    preview: '⭐',
    description: 'Orange gradient with star pattern, premium card design',
    style: {
      background: 'linear-gradient(45deg, #FF8C00 0%, #FF4500 50%, #FFD700 100%)',
      border: '2px solid #B8860B',
      borderWidth: '2px',
      borderRadius: '10px',
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 2px, transparent 2px), radial-gradient(circle at 75% 75%, rgba(255,215,0,0.6) 1.5px, transparent 1.5px)',
      backgroundSize: '30px 30px, 40px 40px',
      boxShadow: '0 0 20px rgba(255, 140, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.2)'
    },
    overlayElements: [
      {
        type: 'pattern',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
          borderRadius: '8px'
        }
      }
    ]
  },
  {
    id: 'baseball-field',
    name: 'Baseball Field',
    preview: '🌿',
    description: 'Green field background with diamond pattern border',
    style: {
      background: 'linear-gradient(180deg, #228B22 0%, #32CD32 50%, #228B22 100%)',
      border: '4px solid #8B4513',
      borderWidth: '4px',
      borderRadius: '6px',
      backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 20px)',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2), 0 2px 10px rgba(0,0,0,0.3)'
    },
    overlayElements: [
      {
        type: 'texture',
        style: {
          position: 'absolute',
          top: '5px',
          left: '5px',
          right: '5px',
          bottom: '5px',
          border: '1px dashed rgba(255,255,255,0.4)',
          borderRadius: '2px'
        }
      }
    ]
  }
];
