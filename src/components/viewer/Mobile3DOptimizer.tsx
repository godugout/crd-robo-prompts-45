
import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { performanceOptimizer } from '@/lib/performance';

interface Mobile3DOptimizerProps {
  children: React.ReactNode;
  enableShadows?: boolean;
  pixelRatio?: number;
}

export const Mobile3DOptimizer: React.FC<Mobile3DOptimizerProps> = ({
  children,
  enableShadows = true,
  pixelRatio
}) => {
  const isMobile = useIsMobile();
  const { getOptimalSettings, isLowPowerMode } = useMobileOptimizations();
  const frameRef = useRef<number>(0);
  
  const canvasSettings = useMemo(() => {
    const optimal = getOptimalSettings();
    const deviceCapabilities = performanceOptimizer.getDeviceCapabilities();
    
    return {
      dpr: pixelRatio || Math.min(window.devicePixelRatio, isMobile ? 2 : 3),
      antialias: optimal.antialiasing && deviceCapabilities.webgl2,
      alpha: true,
      powerPreference: (isLowPowerMode ? 'low-power' : 'high-performance') as WebGLPowerPreference,
      failIfMajorPerformanceCaveat: false,
      stencil: false,
      depth: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    };
  }, [isMobile, pixelRatio, getOptimalSettings, isLowPowerMode]);

  const frameloop = useMemo(() => {
    // Reduce frame rate on mobile or low power mode
    return (isMobile || isLowPowerMode) ? 'demand' : 'always';
  }, [isMobile, isLowPowerMode]);

  // Performance monitoring
  useEffect(() => {
    let lastFrameTime = performance.now();
    let frameCount = 0;
    
    const checkPerformance = () => {
      frameCount++;
      const now = performance.now();
      
      if (frameCount % 60 === 0) { // Check every 60 frames
        const fps = 1000 / ((now - lastFrameTime) / 60);
        
        if (fps < 30) {
          console.warn('Low FPS detected:', fps.toFixed(1));
          // Trigger performance degradation if needed
        }
        
        lastFrameTime = now;
      }
      
      frameRef.current = requestAnimationFrame(checkPerformance);
    };
    
    frameRef.current = requestAnimationFrame(checkPerformance);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <Canvas
      gl={canvasSettings}
      shadows={enableShadows && !isLowPowerMode}
      frameloop={frameloop}
      performance={{
        min: isMobile ? 0.2 : 0.5,
        max: 1,
        debounce: 200
      }}
      style={{
        touchAction: 'none', // Prevent scrolling during 3D interactions
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <React.Suspense fallback={null}>
        {children}
      </React.Suspense>
    </Canvas>
  );
};
