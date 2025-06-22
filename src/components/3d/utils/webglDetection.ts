
// WebGL capability detection and performance profiling
export interface WebGLCapabilities {
  supported: boolean;
  version: number;
  maxTextureSize: number;
  maxRenderbufferSize: number;
  devicePixelRatio: number;
  performanceScore: number;
}

export const detectWebGLCapabilities = (): WebGLCapabilities => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return {
        supported: false,
        version: 0,
        maxTextureSize: 0,
        maxRenderbufferSize: 0,
        devicePixelRatio: window.devicePixelRatio || 1,
        performanceScore: 0
      };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    // Performance scoring based on device capabilities
    let performanceScore = 50; // baseline
    
    if (gl instanceof WebGL2RenderingContext) {
      performanceScore += 20;
    }
    
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize >= 4096) performanceScore += 15;
    if (maxTextureSize >= 8192) performanceScore += 10;
    
    // Check for mobile patterns
    const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    if (isMobile) performanceScore -= 15;
    
    // High-end GPU detection
    if (renderer.includes('RTX') || renderer.includes('GTX') || renderer.includes('RX')) {
      performanceScore += 20;
    }
    
    canvas.remove();
    
    return {
      supported: true,
      version: gl instanceof WebGL2RenderingContext ? 2 : 1,
      maxTextureSize,
      maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2), // Cap at 2 for performance
      performanceScore: Math.min(100, Math.max(0, performanceScore))
    };
  } catch (error) {
    console.warn('WebGL detection failed:', error);
    return {
      supported: false,
      version: 0,
      maxTextureSize: 0,
      maxRenderbufferSize: 0,
      devicePixelRatio: 1,
      performanceScore: 0
    };
  }
};

export const getOptimalSettings = (capabilities: WebGLCapabilities) => {
  const { performanceScore, devicePixelRatio } = capabilities;
  
  if (performanceScore >= 80) {
    return {
      quality: 'high' as const,
      shadows: true,
      antialias: true,
      pixelRatio: devicePixelRatio,
      targetFPS: 60,
      maxInstances: 3
    };
  } else if (performanceScore >= 50) {
    return {
      quality: 'medium' as const,
      shadows: true,
      antialias: false,
      pixelRatio: Math.min(devicePixelRatio, 1.5),
      targetFPS: 60,
      maxInstances: 2
    };
  } else {
    return {
      quality: 'low' as const,
      shadows: false,
      antialias: false,
      pixelRatio: 1,
      targetFPS: 30,
      maxInstances: 1
    };
  }
};
