
import { FrameConfiguration } from './ModularFrameBuilder';

export const VINTAGE_FRAME_CONFIGS: FrameConfiguration[] = [
  {
    id: 'donruss-1987-classic',
    name: '1987 Donruss Classic',
    background: {
      type: 'solid',
      colors: ['#1a1a2e']
    },
    borders: {
      outer: { color: '#fbbf24', thickness: 4 },
      inner: { color: '#e5e7eb', thickness: 2 }
    },
    corners: {
      style: 'classic',
      size: 16,
      color: '#fbbf24'
    },
    sidePatterns: {
      pattern: 'lines',
      color: '#6b7280',
      thickness: 3
    },
    emblem: {
      type: 'logo',
      position: 'top',
      text: 'CRD PREMIUM',
      color: '#1e3a8a'
    },
    textStyles: {
      title: { style: 'raised', color: '#1e3a8a' },
      subtitle: { style: 'raised', color: '#6b7280' }
    }
  },
  {
    id: 'donruss-1987-special',
    name: '1987 Donruss Special Edition',
    background: {
      type: 'gradient',
      colors: ['#1e1b4b', '#312e81']
    },
    borders: {
      outer: { color: '#fbbf24', thickness: 5 },
      inner: { color: '#f3f4f6', thickness: 1 }
    },
    corners: {
      style: 'ornate',
      size: 20,
      color: '#fbbf24'
    },
    sidePatterns: {
      pattern: 'diamonds',
      color: '#fbbf24',
      thickness: 4
    },
    emblem: {
      type: 'seal',
      position: 'top',
      text: 'SPECIAL',
      color: '#dc2626'
    },
    textStyles: {
      title: { style: 'engraved', color: '#1e40af' },
      subtitle: { style: 'raised', color: '#7c3aed' }
    }
  },
  {
    id: 'donruss-1987-rookie',
    name: '1987 Donruss Rookie Card',
    background: {
      type: 'gradient',
      colors: ['#7f1d1d', '#991b1b']
    },
    borders: {
      outer: { color: '#fbbf24', thickness: 3 },
      inner: { color: '#ffffff', thickness: 2 }
    },
    corners: {
      style: 'modern',
      size: 14,
      color: '#dc2626'
    },
    sidePatterns: {
      pattern: 'dots',
      color: '#fbbf24',
      thickness: 2
    },
    emblem: {
      type: 'badge',
      position: 'top',
      text: 'ROOKIE',
      color: '#dc2626'
    },
    textStyles: {
      title: { style: 'modern', color: '#dc2626' },
      subtitle: { style: 'modern', color: '#7f1d1d' }
    }
  }
];

export const MODERN_FRAME_CONFIGS: FrameConfiguration[] = [
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    background: {
      type: 'gradient',
      colors: ['#1e1b4b', '#06b6d4', '#8b5cf6']
    },
    borders: {
      outer: { color: '#06b6d4', thickness: 2 },
      inner: { color: '#8b5cf6', thickness: 1 }
    },
    corners: {
      style: 'modern',
      size: 12,
      color: '#06b6d4'
    },
    emblem: {
      type: 'logo',
      position: 'top',
      text: 'HOLOGRAPHIC',
      color: '#06b6d4'
    },
    textStyles: {
      title: { style: 'modern', color: '#06b6d4' },
      subtitle: { style: 'modern', color: '#8b5cf6' }
    }
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    background: {
      type: 'gradient',
      colors: ['#374151', '#6b7280', '#9ca3af']
    },
    borders: {
      outer: { color: '#e5e7eb', thickness: 3 },
      inner: { color: '#374151', thickness: 1 }
    },
    corners: {
      style: 'modern',
      size: 16,
      color: '#9ca3af'
    },
    sidePatterns: {
      pattern: 'lines',
      color: '#e5e7eb',
      thickness: 2
    },
    emblem: {
      type: 'badge',
      position: 'top',
      text: 'CHROME',
      color: '#374151'
    },
    textStyles: {
      title: { style: 'engraved', color: '#374151' },
      subtitle: { style: 'engraved', color: '#6b7280' }
    }
  }
];

export const ORNATE_FRAME_CONFIGS: FrameConfiguration[] = [
  {
    id: 'vintage-gold',
    name: 'Vintage Gold Ornate',
    background: {
      type: 'gradient',
      colors: ['#fef3c7', '#fbbf24']
    },
    borders: {
      outer: { color: '#d97706', thickness: 6 },
      inner: { color: '#fbbf24', thickness: 2 }
    },
    corners: {
      style: 'ornate',
      size: 24,
      color: '#d97706'
    },
    sidePatterns: {
      pattern: 'diamonds',
      color: '#d97706',
      thickness: 5
    },
    emblem: {
      type: 'seal',
      position: 'top',
      text: 'CLASSIC',
      color: '#92400e'
    },
    textStyles: {
      title: { style: 'raised', color: '#92400e' },
      subtitle: { style: 'engraved', color: '#d97706' }
    }
  }
];

export const ALL_FRAME_CONFIGS = [
  ...VINTAGE_FRAME_CONFIGS,
  ...MODERN_FRAME_CONFIGS,
  ...ORNATE_FRAME_CONFIGS
];
