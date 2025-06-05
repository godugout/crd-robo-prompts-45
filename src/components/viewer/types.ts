
export interface EnvironmentScene {
  id: string;
  name: string;
  background: string;
  lighting?: string;
  icon?: string;
  gradient?: string;
  description?: string;
  backgroundImage?: string;
  reflections?: string;
}

export interface LightingPreset {
  id: string;
  name: string;
  ambient: number;
  directional: number;
  color: string;
  description?: string;
  brightness?: number;
  contrast?: number;
  shadows?: number;
  highlights?: number;
  temperature?: number;
  position?: { x: number; y: number; z: number };
  shadowSoftness?: number;
}

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  reflectivity: number;
  clearcoat: number;
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  category: string;
}
