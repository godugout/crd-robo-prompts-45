
export interface EnvironmentScene {
  id: string;
  name: string;
  gradient?: string;
  backgroundImage?: string;
  icon?: string;
  description?: string;
}

export interface LightingPreset {
  id: string;
  name: string;
  brightness: number;
  description?: string;
  contrast?: number;
  temperature?: number;
}

export interface MaterialSettings {
  roughness: number;
  metalness: number;
  clearcoat: number;
  reflectivity: number;
}

export interface ExportOptions {
  format: 'png' | 'jpg';
  quality?: number;
}

export interface VisualEffect {
  id: string;
  intensity: number;
  enabled: boolean;
}
