
interface DeviceCapabilities {
  webgl2: boolean;
  highPerformance: boolean;
  maxTextureSize: number;
  extensions: string[];
}

interface OptimizationSettings {
  renderQuality: number;
  enableShadows: boolean;
  enableReflections: boolean;
  maxTextureSize: number;
  antialiasing: boolean;
}

class PerformanceOptimizer {
  private deviceCapabilities: DeviceCapabilities | null = null;
  private imageCache = new Map<string, HTMLImageElement>();
  private textureCache = new Map<string, any>();

  getDeviceCapabilities(): DeviceCapabilities {
    if (this.deviceCapabilities) {
      return this.deviceCapabilities;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      this.deviceCapabilities = {
        webgl2: false,
        highPerformance: false,
        maxTextureSize: 512,
        extensions: []
      };
      return this.deviceCapabilities;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    this.deviceCapabilities = {
      webgl2: !!canvas.getContext('webgl2'),
      highPerformance: this.isHighPerformanceDevice(renderer),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      extensions: gl.getSupportedExtensions() || []
    };

    return this.deviceCapabilities;
  }

  private isHighPerformanceDevice(renderer: string): boolean {
    const highPerfGPUs = ['nvidia', 'amd', 'radeon', 'geforce', 'quadro'];
    return highPerfGPUs.some(gpu => renderer.toLowerCase().includes(gpu));
  }

  getOptimalSettings(): OptimizationSettings {
    const capabilities = this.getDeviceCapabilities();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile || !capabilities.highPerformance) {
      return {
        renderQuality: 0.75,
        enableShadows: false,
        enableReflections: false,
        maxTextureSize: Math.min(1024, capabilities.maxTextureSize),
        antialiasing: false
      };
    }

    return {
      renderQuality: 1.0,
      enableShadows: true,
      enableReflections: true,
      maxTextureSize: Math.min(2048, capabilities.maxTextureSize),
      antialiasing: capabilities.webgl2
    };
  }

  optimizeImageUrl(src: string, width?: number, height?: number, quality = 80): string {
    // Simple URL optimization - in production, this would integrate with CDN
    if (!width && !height) return src;
    
    // For now, return original URL. In production, this would generate optimized URLs
    return src;
  }

  createLazyLoader(callback: (entry: IntersectionObserverEntry) => void): IntersectionObserver {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    return new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, options);
  }

  preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(src)) {
      return Promise.resolve(this.imageCache.get(src)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  measureRenderTime<T>(fn: () => T): { result: T; time: number } {
    const start = performance.now();
    const result = fn();
    const time = performance.now() - start;
    return { result, time };
  }

  throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return ((...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    }) as T;
  }

  debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  }
}

export const performanceOptimizer = new PerformanceOptimizer();
