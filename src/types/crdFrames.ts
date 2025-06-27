
export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface CRDElement {
  id: string;
  name: string;
  type: 'border' | 'logo' | 'label' | 'decorative' | 'corner' | 'accent';
  imageUrl: string;
  zIndex: number;
  position: Position;
  dimensions: Dimensions;
  opacity?: number;
  rotation?: number;
  scale?: number;
}

export interface CRDFrame {
  id: string;
  name: string;
  description: string;
  category: string;
  elements: CRDElement[];
  placeholderDimensions: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  totalDimensions: Dimensions;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CRDFrameProps {
  frame: CRDFrame;
  userImage?: string;
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
}
