
// Enhanced Environment Scenes and Lighting Presets

import type { EnvironmentScene, LightingPreset, VisualEffect } from './types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    gradient: '#090909 #1a1a1a #090909',
    description: 'Clean studio environment with neutral lighting',
    lighting: {
      color: '#ffffff',
      intensity: 1.0,
      elevation: 45,
      azimuth: 135,
    },
    backgroundImage: 'radial-gradient(circle at 50% 50%, #303030 0%, #121212 100%)',
    reflections: 'soft'
  },
  {
    id: 'display',
    name: 'Display',
    icon: '🏆',
    gradient: '#0a0a14 #141423 #0a0a14',
    description: 'Museum-style display with dramatic lighting',
    lighting: {
      color: '#f0f0e0',
      intensity: 1.2,
      elevation: 60,
      azimuth: 160,
    },
    backgroundImage: 'radial-gradient(circle at 30% 30%, #202030 0%, #0a0a15 100%)',
    reflections: 'sharp'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    gradient: '#1c0c1c #2d142b #1c0c1c',
    description: 'Warm sunset ambiance with golden highlights',
    lighting: {
      color: '#ff7700',
      intensity: 0.9,
      elevation: 15,
      azimuth: 260,
    },
    backgroundImage: 'linear-gradient(135deg, #3d1635 0%, #26101f 20%, #1a0a15 60%, #0d0709 100%)',
    reflections: 'warm'
  },
  {
    id: 'twilight',
    name: 'Twilight',
    icon: '🌃',
    gradient: '#040428 #0a0a32 #040428',
    description: 'Evening twilight with cool blue tones',
    lighting: {
      color: '#4060ff',
      intensity: 0.8,
      elevation: 30,
      azimuth: 315,
    },
    backgroundImage: 'linear-gradient(135deg, #0a0a20 0%, #12122c 50%, #08081a 100%)',
    reflections: 'cold'
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    icon: '✨',
    gradient: '#0a0a0a #151515 #0a0a0a',
    description: 'Space-inspired environment with star field',
    lighting: {
      color: '#c0c0ff',
      intensity: 0.7,
      elevation: 80,
      azimuth: 180,
    },
    backgroundImage: `radial-gradient(circle at 30% 50%, rgba(60,20,80,0.3) 0%, transparent 50%),
                     radial-gradient(circle at 70% 50%, rgba(20,40,100,0.3) 0%, transparent 50%),
                     url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="rgb(5,5,10)"/><circle cx="50" cy="50" r="1" fill="white" opacity="0.8"/><circle cx="20" cy="30" r="0.5" fill="white" opacity="0.6"/><circle cx="70" cy="40" r="0.7" fill="white" opacity="0.7"/><circle cx="30" cy="70" r="0.4" fill="white" opacity="0.5"/><circle cx="80" cy="20" r="0.6" fill="white" opacity="0.7"/><circle cx="10" cy="90" r="0.5" fill="white" opacity="0.6"/><circle cx="90" cy="10" r="0.3" fill="white" opacity="0.5"/></svg>')`,
    reflections: 'sparkle'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: '💫',
    gradient: '#0f0f13 #13131c #0f0f13',
    description: 'Vibrant neon-lit environment',
    lighting: {
      color: '#ff00ff',
      intensity: 1.1,
      elevation: 35,
      azimuth: 225,
    },
    backgroundImage: `linear-gradient(135deg, #080810 0%, #0c0c18 100%),
                     radial-gradient(circle at 20% 30%, rgba(255,0,180,0.15) 0%, transparent 50%),
                     radial-gradient(circle at 80% 70%, rgba(0,180,255,0.15) 0%, transparent 50%)`,
    reflections: 'vivid'
  }
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'studio',
    name: 'Studio',
    description: 'Balanced professional lighting',
    brightness: 100,
    contrast: 100,
    shadows: 30,
    highlights: 70,
    temperature: 5500,
    position: { x: 0, y: 0, z: 100 },
    shadowSoftness: 20
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Soft natural daylight',
    brightness: 110,
    contrast: 90,
    shadows: 20,
    highlights: 60,
    temperature: 6000,
    position: { x: 30, y: 30, z: 100 },
    shadowSoftness: 40
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast with deep shadows',
    brightness: 95,
    contrast: 140,
    shadows: 60,
    highlights: 80,
    temperature: 5000,
    position: { x: -40, y: 10, z: 120 },
    shadowSoftness: 10
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Museum-style accent lighting',
    brightness: 115,
    contrast: 110,
    shadows: 40,
    highlights: 75,
    temperature: 4800,
    position: { x: 0, y: 50, z: 80 },
    shadowSoftness: 15
  }
];

export const VISUAL_EFFECTS = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow shifting holographic effect',
    category: 'prismatic'
  },
  {
    id: 'metallic',
    name: 'Metallic',
    description: 'Shiny metal foil appearance',
    category: 'metallic'
  },
  {
    id: 'gloss',
    name: 'High Gloss',
    description: 'High gloss finish with reflections',
    category: 'surface'
  },
  {
    id: 'matte',
    name: 'Matte',
    description: 'Subtle matte finish texture',
    category: 'surface'
  }
];
