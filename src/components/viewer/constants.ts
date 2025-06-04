import type { EnvironmentScene, LightingPreset, VisualEffect } from './types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: '🎬',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    description: 'Clean studio lighting',
    lighting: {
      color: '#ffffff',
      intensity: 0.9,
      elevation: 45,
      azimuth: 0
    },
    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    reflections: 'soft',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr',
    hdrIntensity: 1.0,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/studio_small_03.png'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #ff0080 0%, #0080ff 100%)',
    description: 'Vibrant neon atmosphere',
    lighting: {
      color: '#ff0080',
      intensity: 1.2,
      elevation: 30,
      azimuth: 45
    },
    backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    reflections: 'vivid',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/neon_photostudio_1k.hdr',
    hdrIntensity: 1.4,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/neon_photostudio.png'
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    icon: '🌅',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'Warm golden lighting',
    lighting: {
      color: '#ffa500',
      intensity: 0.9,
      elevation: 15,
      azimuth: 60
    },
    backgroundImage: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    reflections: 'warm',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/golden_bay_1k.hdr',
    hdrIntensity: 1.1,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/golden_bay.png'
  },
  {
    id: 'twilight',
    name: 'Twilight',
    icon: '🌙',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Mystical twilight ambiance',
    lighting: {
      color: '#4a5ee8',
      intensity: 0.8,
      elevation: 60,
      azimuth: -30
    },
    backgroundImage: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    reflections: 'cold',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_photo_studio_1k.hdr',
    hdrIntensity: 0.9,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/blue_photo_studio.png'
  },
  {
    id: 'urban-rooftop',
    name: 'Urban Rooftop',
    icon: '🏙️',
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    description: 'Modern city skyline view',
    lighting: {
      color: '#74b9ff',
      intensity: 1.0,
      elevation: 25,
      azimuth: 120
    },
    backgroundImage: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    reflections: 'sharp',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rooftop_night_1k.hdr',
    hdrIntensity: 1.2,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/rooftop_night.png'
  },
  {
    id: 'forest-path',
    name: 'Forest Path',
    icon: '🌲',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
    description: 'Serene forest atmosphere',
    lighting: {
      color: '#00b894',
      intensity: 0.8,
      elevation: 70,
      azimuth: -45
    },
    backgroundImage: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
    reflections: 'soft',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/forest_slope_1k.hdr',
    hdrIntensity: 0.9,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/forest_slope.png'
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    icon: '🏜️',
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    description: 'Dramatic desert landscape',
    lighting: {
      color: '#fd79a8',
      intensity: 1.3,
      elevation: 10,
      azimuth: 90
    },
    backgroundImage: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    reflections: 'warm',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kiara_1_dawn_1k.hdr',
    hdrIntensity: 1.4,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/kiara_1_dawn.png'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
    description: 'Gritty industrial setting',
    lighting: {
      color: '#ddd6fe',
      intensity: 1.1,
      elevation: 40,
      azimuth: 0
    },
    backgroundImage: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
    reflections: 'sharp',
    environmentType: 'hdr',
    hdrImage: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr',
    hdrIntensity: 1.0,
    previewImage: 'https://cdn.polyhaven.com/asset_img/primary/industrial_workshop_foundry.png'
  }
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Balanced natural lighting',
    brightness: 90,
    contrast: 90,
    shadows: 40,
    highlights: 65,
    temperature: 5500,
    position: { x: 0, y: 1, z: 1 },
    shadowSoftness: 25
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast dramatic lighting',
    brightness: 120,
    contrast: 150,
    shadows: 80,
    highlights: 90,
    temperature: 4000,
    position: { x: 1, y: 0.5, z: 0.5 },
    shadowSoftness: 10
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle diffused lighting',
    brightness: 90,
    contrast: 80,
    shadows: 30,
    highlights: 60,
    temperature: 6000,
    position: { x: 0, y: 1, z: 0 },
    shadowSoftness: 40
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Enhanced color vibrancy',
    brightness: 110,
    contrast: 130,
    shadows: 40,
    highlights: 85,
    temperature: 5800,
    position: { x: -0.5, y: 1, z: 1 },
    shadowSoftness: 25
  }
];

export const VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow holographic effect',
    category: 'prismatic'
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern',
    category: 'metallic'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Mirror-like chrome finish',
    category: 'metallic'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged patina effect',
    category: 'vintage'
  }
];
