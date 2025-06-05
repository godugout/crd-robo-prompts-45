
export interface EnvironmentScene {
  id: string;
  name: string;
  background: string;
  lighting?: string;
}

export interface LightingPreset {
  id: string;
  name: string;
  ambient: number;
  directional: number;
  color: string;
}

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  reflectivity: number;
  clearcoat: number;
}
