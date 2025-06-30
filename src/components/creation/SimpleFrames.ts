
export interface SimpleFrame {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  style: {
    border: string;
    borderRadius: string;
    padding: string;
    background: string;
  };
}

export const SIMPLE_FRAMES: SimpleFrame[] = [
  {
    id: 'full-bleed',
    name: 'Full Bleed',
    description: 'Image covers entire card',
    isDefault: true,
    style: {
      border: 'none',
      borderRadius: '12px',
      padding: '0',
      background: 'transparent'
    }
  },
  {
    id: 'classic-border',
    name: 'Classic Border',
    description: 'Simple black border',
    isDefault: false,
    style: {
      border: '2px solid #000',
      borderRadius: '12px',
      padding: '8px',
      background: '#fff'
    }
  },
  {
    id: 'sport-card',
    name: 'Sport Card',
    description: 'Traditional trading card',
    isDefault: false,
    style: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      background: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)'
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Rounded with subtle border',
    isDefault: false,
    style: {
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '16px',
      padding: '6px',
      background: 'rgba(0,0,0,0.05)'
    }
  }
];

export const getDefaultFrame = () => SIMPLE_FRAMES.find(f => f.isDefault) || SIMPLE_FRAMES[0];
