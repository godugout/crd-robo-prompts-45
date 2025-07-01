
export interface CardCreationState {
  step: 'upload' | 'frame' | 'customize' | 'preview' | 'export';  
  uploadedImage: string | null;
  imageFile: File | null;
  cardData: {
    title: string;
    description: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    frame: string;
    effectPreset?: string;
    effects: {
      holographic: number;
      metallic: number;
      chrome: number;
      particles: boolean;
    };
  };
  processing: boolean;
  error: string | null;
}

export interface ImageProcessingOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

// Unified card data interface for all components
export interface UnifiedCardData {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  frame: string;
  effects: {
    holographic: number;
    metallic: number;
    chrome: number;
    particles: boolean;
  };
  imageUrl?: string;
}
