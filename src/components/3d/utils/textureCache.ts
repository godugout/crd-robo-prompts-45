
import * as THREE from 'three';

interface CachedTexture {
  texture: THREE.Texture;
  lastUsed: number;
  referenceCount: number;
}

class TextureCache {
  private cache = new Map<string, CachedTexture>();
  private maxCacheSize = 50;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
  }

  private startCleanupInterval() {
    // Clean up unused textures every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 30000);
  }

  async loadTexture(url: string): Promise<THREE.Texture> {
    // Check cache first
    const cached = this.cache.get(url);
    if (cached) {
      cached.lastUsed = Date.now();
      cached.referenceCount++;
      return cached.texture.clone();
    }

    // Load new texture
    const loader = new THREE.TextureLoader();
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(
        url,
        (tex) => {
          // Optimize texture settings
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          
          // Set texture format for better compression
          tex.format = THREE.RGBAFormat;
          
          resolve(tex);
        },
        undefined,
        reject
      );
    });

    // Add to cache
    this.cache.set(url, {
      texture: texture.clone(),
      lastUsed: Date.now(),
      referenceCount: 1
    });

    // Cleanup if cache is too large
    if (this.cache.size > this.maxCacheSize) {
      this.cleanup();
    }

    return texture;
  }

  releaseTexture(url: string) {
    const cached = this.cache.get(url);
    if (cached) {
      cached.referenceCount--;
      if (cached.referenceCount <= 0) {
        cached.texture.dispose();
        this.cache.delete(url);
      }
    }
  }

  private cleanup() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    for (const [url, cached] of this.cache.entries()) {
      if (cached.referenceCount <= 0 && now - cached.lastUsed > maxAge) {
        cached.texture.dispose();
        this.cache.delete(url);
      }
    }
  }

  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    for (const cached of this.cache.values()) {
      cached.texture.dispose();
    }
    this.cache.clear();
  }
}

export const textureCache = new TextureCache();
