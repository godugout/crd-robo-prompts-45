
import React from 'react';
import { ModularFrameBuilder, FrameConfiguration } from './ModularFrameBuilder';
import { ALL_FRAME_CONFIGS } from './VintageFrameConfigs';

export interface EnhancedFrameTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_component: React.ComponentType<any>;
  config?: FrameConfiguration;
}

// Updated Classic Sports Frame using modular system
export const ClassicSportsFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-classic')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

// Updated Modern Holographic Frame
export const ModernHolographicFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'holographic-premium')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

// Updated Vintage Ornate Frame
export const VintageOrnateFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'vintage-gold')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

// New frames using the design elements
export const DonrussSpecialFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-special')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

export const DonrussRookieFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-rookie')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

export const ChromeEditionFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'chrome-edition')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

export const ENHANCED_FRAME_TEMPLATES: EnhancedFrameTemplate[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Professional',
    description: 'Traditional sports card design with premium borders',
    preview_component: ClassicSportsFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-classic')
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    category: 'Premium',
    description: 'Modern holographic design with prismatic effects',
    preview_component: ModernHolographicFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'holographic-premium')
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Classic',
    description: 'Ornate vintage design with decorative elements',
    preview_component: VintageOrnateFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'vintage-gold')
  },
  {
    id: 'donruss-special',
    name: 'Donruss Special',
    category: 'Vintage',
    description: '1987 Donruss special edition with ornate corners',
    preview_component: DonrussSpecialFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-special')
  },
  {
    id: 'donruss-rookie',
    name: 'Rookie Card',
    category: 'Vintage',
    description: '1987 Donruss rookie card design with red accents',
    preview_component: DonrussRookieFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-rookie')
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    category: 'Modern',
    description: 'Sleek chrome finish with metallic elements',
    preview_component: ChromeEditionFrame,
    config: ALL_FRAME_CONFIGS.find(c => c.id === 'chrome-edition')
  }
];
