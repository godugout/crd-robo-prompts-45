
export type EnvironmentScene = 'studio' | 'forest' | 'mountain' | 'cavern' | 'metropolis';
export type LightingPreset = 'studio' | 'natural' | 'dramatic' | 'soft' | 'vibrant';

export interface MaterialSettings {
  metalness: number;
  roughness: number;
  clearcoat: number;
  transmission: number;
  reflectivity: number;
}
