
import React from 'react';

export interface EnhancedFrameTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_component: React.ComponentType<any>;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  
  // Visual properties
  visual: {
    border: {
      width: string;
      color: string;
      gradient?: boolean;
    };
    borderRadius: string;
    shadow?: boolean;
  };
  
  // Effects
  effects: {
    holographic?: boolean;
    metallic?: boolean;
    crystal?: boolean;
    animated?: boolean;
  };
  
  // Layout areas
  layout: {
    imageArea: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    titleArea: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    subtitleArea?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    statsArea?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  
  config?: any; // For backwards compatibility
}
