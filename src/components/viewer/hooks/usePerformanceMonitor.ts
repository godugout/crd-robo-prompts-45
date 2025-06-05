import { useRef, useCallback, useState } from 'react';

interface PerformanceMetrics {
  averageFrameTime: number;
  frameRate: number;
  memoryUsage: number;
  effectComplexity: number;
  renderTime: number;
}

interface PerformanceConfig {
  targetFPS: number;
  maxFrameTime: number;
  memoryThreshold: number;
}

export const usePerformanceMonitor = (config: PerformanceConfig = {
  targetFPS: 60,
  maxFrameTime: 16.67, // 60fps = ~16.67ms per frame
  memoryThreshold: 50 // MB
}) => {
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const renderStartRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    averageFrameTime: 0,
    frameRate: 60,
    memoryUsage: 0,
    effectComplexity: 0,
    renderTime: 0
  });

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // End performance measurement
  const endMeasurement = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    const renderTime = now - renderStartRef.current;
    
    // Update frame times (keep last 60 frames for average)
    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }
    
    // Calculate metrics
    const averageFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
    const frameRate = Math.min(60, 1000 / averageFrameTime);
    
    // Get memory usage if available
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    
    setMetrics({
      averageFrameTime,
      frameRate,
      memoryUsage,
      effectComplexity: 0, // Will be set by effect system
      renderTime
    });
    
    lastFrameTimeRef.current = now;
  }, []);

  // Check if performance is acceptable
  const isPerformanceGood = useCallback((): boolean => {
    return metrics.frameRate >= config.targetFPS * 0.8 && // Allow 20% deviation
           metrics.averageFrameTime <= config.maxFrameTime * 1.2 &&
           metrics.memoryUsage <= config.memoryThreshold;
  }, [metrics, config]);

  // Get performance recommendations
  const getPerformanceRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.frameRate < config.targetFPS * 0.8) {
      recommendations.push('Reduce effect complexity for better frame rate');
    }
    
    if (metrics.averageFrameTime > config.maxFrameTime * 1.5) {
      recommendations.push('Consider lowering effect quality settings');
    }
    
    if (metrics.memoryUsage > config.memoryThreshold) {
      recommendations.push('Clear effect cache to reduce memory usage');
    }
    
    if (metrics.renderTime > 100) {
      recommendations.push('Enable effect caching for faster rendering');
    }
    
    return recommendations;
  }, [metrics, config]);

  // Adaptive quality adjustment
  const getAdaptiveQualityLevel = useCallback((): 'low' | 'medium' | 'high' => {
    if (!isPerformanceGood()) {
      if (metrics.frameRate < 30 || metrics.averageFrameTime > 33) {
        return 'low';
      }
      return 'medium';
    }
    return 'high';
  }, [metrics, isPerformanceGood]);

  return {
    metrics,
    startMeasurement,
    endMeasurement,
    isPerformanceGood,
    getPerformanceRecommendations,
    getAdaptiveQualityLevel
  };
};
