
import { CRDFrame } from '@/types/crdFrames';

// Oakland A's Donruss Style Frame
export const OAKLAND_AS_DONRUSS: CRDFrame = {
  id: 'oakland-as-donruss',
  name: "Oakland A's Donruss Classic",
  description: 'Classic Donruss-style frame with Oakland Athletics branding',
  category: 'sports',
  rarity: 'rare',
  totalDimensions: {
    width: 400,
    height: 560
  },
  placeholderDimensions: {
    x: 30,
    y: 40,
    width: 340,
    height: 280
  },
  elements: [
    {
      id: 'main-border',
      name: 'Main Border',
      type: 'border',
      imageUrl: '/lovable-uploads/oakland-as-border.png',
      zIndex: 10,
      position: { x: 0, y: 0 },
      dimensions: { width: 400, height: 560 }
    },
    {
      id: 'donruss-logo',
      name: 'Donruss Logo',
      type: 'logo',
      imageUrl: '/lovable-uploads/donruss-logo.png',
      zIndex: 15,
      position: { x: 20, y: 20 },
      dimensions: { width: 80, height: 20 }
    },
    {
      id: 'athletics-logo',
      name: 'Oakland Athletics Logo',
      type: 'logo',
      imageUrl: '/lovable-uploads/athletics-logo.png',
      zIndex: 15,
      position: { x: 300, y: 20 },
      dimensions: { width: 80, height: 80 }
    },
    {
      id: 'player-nameplate',
      name: 'Player Nameplate',
      type: 'label',
      imageUrl: '/lovable-uploads/nameplate-bg.png',
      zIndex: 12,
      position: { x: 30, y: 340 },
      dimensions: { width: 340, height: 60 }
    },
    {
      id: 'corner-accent-tl',
      name: 'Top Left Corner',
      type: 'decorative',
      imageUrl: '/lovable-uploads/corner-accent.png',
      zIndex: 8,
      position: { x: 0, y: 0 },
      dimensions: { width: 50, height: 50 }
    },
    {
      id: 'corner-accent-tr',
      name: 'Top Right Corner',
      type: 'decorative',
      imageUrl: '/lovable-uploads/corner-accent.png',
      zIndex: 8,
      position: { x: 350, y: 0 },
      dimensions: { width: 50, height: 50 },
      rotation: 90
    },
    {
      id: 'stats-panel',
      name: 'Stats Panel',
      type: 'label',
      imageUrl: '/lovable-uploads/stats-panel.png',
      zIndex: 12,
      position: { x: 30, y: 420 },
      dimensions: { width: 340, height: 120 }
    }
  ]
};

// Modern Holographic Frame
export const MODERN_HOLOGRAPHIC: CRDFrame = {
  id: 'modern-holographic',
  name: 'Modern Holographic',
  description: 'Futuristic holographic frame with prismatic effects',
  category: 'modern',
  rarity: 'epic',
  totalDimensions: {
    width: 400,
    height: 560
  },
  placeholderDimensions: {
    x: 40,
    y: 50,
    width: 320,
    height: 260
  },
  elements: [
    {
      id: 'holo-border',
      name: 'Holographic Border',
      type: 'border',
      imageUrl: '/lovable-uploads/holo-border.png',
      zIndex: 10,
      position: { x: 0, y: 0 },
      dimensions: { width: 400, height: 560 }
    },
    {
      id: 'prism-effect',
      name: 'Prism Effect',
      type: 'decorative',
      imageUrl: '/lovable-uploads/prism-effect.png',
      zIndex: 5,
      position: { x: 0, y: 0 },
      dimensions: { width: 400, height: 560 },
      opacity: 0.6
    },
    {
      id: 'holo-logo',
      name: 'Holographic Logo',
      type: 'logo',
      imageUrl: '/lovable-uploads/holo-logo.png',
      zIndex: 15,
      position: { x: 170, y: 20 },
      dimensions: { width: 60, height: 20 }
    },
    {
      id: 'info-panel',
      name: 'Info Panel',
      type: 'label',
      imageUrl: '/lovable-uploads/info-panel.png',
      zIndex: 12,
      position: { x: 40, y: 330 },
      dimensions: { width: 320, height: 200 }
    }
  ]
};

// Vintage Ornate Frame
export const VINTAGE_ORNATE: CRDFrame = {
  id: 'vintage-ornate',
  name: 'Vintage Ornate',
  description: 'Elegant vintage frame with ornate decorative elements',
  category: 'vintage',
  rarity: 'uncommon',
  totalDimensions: {
    width: 400,
    height: 560
  },
  placeholderDimensions: {
    x: 50,
    y: 60,
    width: 300,
    height: 240
  },
  elements: [
    {
      id: 'ornate-border',
      name: 'Ornate Border',
      type: 'border',
      imageUrl: '/lovable-uploads/ornate-border.png',
      zIndex: 10,
      position: { x: 0, y: 0 },
      dimensions: { width: 400, height: 560 }
    },
    {
      id: 'vintage-corners',
      name: 'Vintage Corners',
      type: 'decorative',
      imageUrl: '/lovable-uploads/vintage-corners.png',
      zIndex: 12,
      position: { x: 0, y: 0 },
      dimensions: { width: 400, height: 560 }
    },
    {
      id: 'title-banner',
      name: 'Title Banner',
      type: 'label',
      imageUrl: '/lovable-uploads/title-banner.png',
      zIndex: 15,
      position: { x: 50, y: 320 },
      dimensions: { width: 300, height: 40 }
    },
    {
      id: 'description-scroll',
      name: 'Description Scroll',
      type: 'label',
      imageUrl: '/lovable-uploads/description-scroll.png',
      zIndex: 12,
      position: { x: 50, y: 380 },
      dimensions: { width: 300, height: 160 }
    }
  ]
};

export const CRD_FRAMES: CRDFrame[] = [
  OAKLAND_AS_DONRUSS,
  MODERN_HOLOGRAPHIC,
  VINTAGE_ORNATE
];

export const getCRDFrameById = (id: string): CRDFrame | undefined => {
  return CRD_FRAMES.find(frame => frame.id === id);
};

export const getCRDFramesByCategory = (category: string): CRDFrame[] => {
  return CRD_FRAMES.filter(frame => frame.category === category);
};
