
import { FrameConfiguration } from '@/components/editor/frames/ModularFrameBuilder';

export const STUDIO_CARD_FRAMES: FrameConfiguration[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports Card',
    background: {
      type: 'gradient',
      colors: ['#1e3a8a', '#3b82f6', '#60a5fa']
    },
    borders: {
      outer: { color: '#fbbf24', thickness: 4, pattern: 'solid' },
      inner: { color: '#f59e0b', thickness: 2, pattern: 'solid' }
    },
    corners: {
      style: 'classic',
      size: 24,
      color: '#fbbf24'
    },
    sidePatterns: {
      pattern: 'lines',
      color: '#fbbf24',
      thickness: 2
    },
    emblem: {
      type: 'badge',
      position: 'top',
      text: 'CRD PREMIUM',
      color: '#fbbf24'
    },
    textStyles: {
      title: { style: 'raised', color: '#fbbf24' },
      subtitle: { style: 'raised', color: '#ffffff' }
    }
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Gold Edition',
    background: {
      type: 'gradient',
      colors: ['#451a03', '#92400e', '#d97706']
    },
    borders: {
      outer: { color: '#fbbf24', thickness: 6, pattern: 'ornate' },
      inner: { color: '#f59e0b', thickness: 3, pattern: 'ornate' }
    },
    corners: {
      style: 'ornate',
      size: 32,
      color: '#fbbf24'
    },
    sidePatterns: {
      pattern: 'diamonds',
      color: '#fbbf24',
      thickness: 3
    },
    emblem: {
      type: 'seal',
      position: 'top',
      text: 'VINTAGE CLASSIC',
      color: '#fbbf24'
    },
    textStyles: {
      title: { style: 'engraved', color: '#92400e' },
      subtitle: { style: 'engraved', color: '#451a03' }
    }
  },
  {
    id: 'holographic-modern',
    name: 'Holographic Pro',
    background: {
      type: 'gradient',
      colors: ['#1e1b4b', '#3730a3', '#4f46e5', '#06b6d4', '#10b981']
    },
    borders: {
      outer: { color: '#06d6a0', thickness: 3, pattern: 'modern' },
      inner: { color: '#00f5ff', thickness: 2, pattern: 'modern' }
    },
    corners: {
      style: 'modern',
      size: 20,
      color: '#06d6a0'
    },
    sidePatterns: {
      pattern: 'dots',
      color: '#00f5ff',
      thickness: 2
    },
    emblem: {
      type: 'badge',
      position: 'top',
      text: 'HOLOGRAPHIC',
      color: '#06d6a0'
    },
    textStyles: {
      title: { style: 'modern', color: '#00f5ff' },
      subtitle: { style: 'modern', color: '#06d6a0' }
    }
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Elite',
    background: {
      type: 'gradient',
      colors: ['#374151', '#6b7280', '#9ca3af']
    },
    borders: {
      outer: { color: '#d1d5db', thickness: 4, pattern: 'metallic' },
      inner: { color: '#f3f4f6', thickness: 2, pattern: 'metallic' }
    },
    corners: {
      style: 'modern',
      size: 28,
      color: '#d1d5db'
    },
    sidePatterns: {
      pattern: 'lines',
      color: '#d1d5db',
      thickness: 3
    },
    emblem: {
      type: 'badge',
      position: 'top',
      text: 'CHROME EDITION',
      color: '#d1d5db'
    },
    textStyles: {
      title: { style: 'engraved', color: '#374151' },
      subtitle: { style: 'engraved', color: '#6b7280' }
    }
  }
];

export const getFrameById = (frameId: string): FrameConfiguration | undefined => {
  return STUDIO_CARD_FRAMES.find(frame => frame.id === frameId);
};
