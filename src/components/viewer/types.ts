
export interface EnvironmentScene {
  id: string;
  name: string;
  gradient?: string;
  backgroundImage?: string;
}

export interface LightingPreset {
  id: string;
  name: string;
  brightness: number;
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
