
// Performance utilities and optimization helpers

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private imageCache = new Map<string, string>();
  private observers = new Map<string, IntersectionObserver>();

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Image optimization with WebP support and lazy loading
  optimizeImageUrl(url: string, width?: number, height?: number, quality = 80): string {
    if (!url) return url;

    // Check if browser supports WebP
    const supportsWebP = this.supportsWebP();
    
    // Generate optimized URL based on CDN or storage provider
    if (url.includes('supabase.co/storage')) {
      const baseUrl = url.split('?')[0];
      const params = new URLSearchParams();
      
      if (width) params.append('width', width.toString());
      if (height) params.append('height', height.toString());
      if (quality !== 80) params.append('quality', quality.toString());
      if (supportsWebP) params.append('format', 'webp');
      
      return `${baseUrl}${params.toString() ? '?' + params.toString() : ''}`;
    }
    
    return url;
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Lazy loading implementation
  createLazyLoader(callback: (entry: IntersectionObserverEntry) => void): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }

  // Debounce utility for performance-critical operations
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate = false
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return (...args: Parameters<T>) => {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout;
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func(...args);
    };
  }

  // Throttle utility for scroll and resize events
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Memory management for 3D scenes
  cleanup3DResources(scene: any) {
    if (!scene) return;
    
    scene.traverse((child: any) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material: any) => this.disposeMaterial(material));
        } else {
          this.disposeMaterial(child.material);
        }
      }
    });
  }

  private disposeMaterial(material: any) {
    if (material.map) material.map.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.roughnessMap) material.roughnessMap.dispose();
    if (material.metalnessMap) material.metalnessMap.dispose();
    material.dispose();
  }

  // Preload critical resources
  preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(urls.map(url => this.preloadImage(url)));
  }

  // Check device capabilities
  getDeviceCapabilities() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    return {
      webgl: !!gl,
      webgl2: !!canvas.getContext('webgl2'),
      deviceMemory: (navigator as any).deviceMemory || 4,
      hardwareConcurrency: navigator.hardwareConcurrency || 2,
      connection: (navigator as any).connection?.effectiveType || '4g',
      touchSupport: 'ontouchstart' in window,
      pixelRatio: window.devicePixelRatio || 1
    };
  }

  // Adaptive quality based on device performance
  getOptimalQuality(): 'low' | 'medium' | 'high' {
    const capabilities = this.getDeviceCapabilities();
    
    if (capabilities.deviceMemory >= 8 && capabilities.webgl2 && capabilities.connection === '4g') {
      return 'high';
    } else if (capabilities.deviceMemory >= 4 && capabilities.webgl) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Utility functions
export const measurePerformance = (name: string) => {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

export const isHighPerformanceDevice = (): boolean => {
  const capabilities = performanceOptimizer.getDeviceCapabilities();
  return capabilities.deviceMemory >= 8 && capabilities.hardwareConcurrency >= 4;
};

export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
