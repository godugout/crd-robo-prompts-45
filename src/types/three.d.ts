
import * as THREE from 'three';

declare module 'three' {
  interface WebGLRenderer {
    shadowMap: {
      enabled: boolean;
      type: THREE.ShadowMapType;
    };
  }
}

export interface WebGLCapabilities {
  supported: boolean;
  version: string;
  maxTextureSize: number;
  maxAnisotropy: number;
  supportsFloatTextures: boolean;
  supportsDepthTexture: boolean;
  extensions: string[];
  performanceScore: number;
}

export interface OptimalSettings {
  quality: 'low' | 'medium' | 'high';
  shadows: boolean;
  antialias: boolean;
  pixelRatio: number;
}

export interface Card3DMaterialProps {
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metallicMap?: THREE.Texture;
  emissiveMap?: THREE.Texture;
  roughness?: number;
  metalness?: number;
  reflectivity?: number;
  envMapIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  color?: THREE.Color | string;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  memoryUsage: number;
}

export interface HolographicShaderUniforms {
  time: { value: number };
  intensity: { value: number };
  colorShift: { value: number };
  baseTexture: { value: THREE.Texture | null };
}

export interface MetallicShaderUniforms {
  time: { value: number };
  metalness: { value: number };
  roughness: { value: number };
  envMap: { value: THREE.CubeTexture | null };
}
