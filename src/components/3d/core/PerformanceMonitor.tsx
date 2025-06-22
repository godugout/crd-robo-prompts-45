import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Perf } from 'r3f-perf';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  quality: 'high' | 'medium' | 'low';
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  targetFPS?: number;
  autoAdjustQuality?: boolean;
  showDebug?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  targetFPS = 60,
  autoAdjustQuality = true,
  showDebug = process.env.NODE_ENV === 'development'
}) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const qualityLevel = useRef<'high' | 'medium' | 'low'>('high');

  useFrame(() => {
    const now = performance.now();
    const deltaTime = now - lastTime.current;
    
    frameCount.current++;
    
    // Calculate FPS every second
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / deltaTime);
      fpsHistory.current.push(fps);
      
      // Keep only last 10 readings
      if (fpsHistory.current.length > 10) {
        fpsHistory.current.shift();
      }
      
      const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
      
      // Auto-adjust quality based on performance
      if (autoAdjustQuality && fpsHistory.current.length >= 5) {
        if (avgFPS < targetFPS * 0.8 && qualityLevel.current !== 'low') {
          qualityLevel.current = avgFPS < targetFPS * 0.6 ? 'low' : 'medium';
        } else if (avgFPS > targetFPS * 0.95 && qualityLevel.current !== 'high') {
          qualityLevel.current = 'high';
        }
      }
      
      // Report metrics
      const metrics: PerformanceMetrics = {
        fps: Math.round(avgFPS),
        frameTime: deltaTime / frameCount.current,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        quality: qualityLevel.current
      };
      
      onMetricsUpdate?.(metrics);
      
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return showDebug ? <Perf position="top-left" /> : null;
};

// Hook for accessing performance metrics
export const usePerformanceMetrics = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    quality: 'high'
  });

  const updateMetrics = (metrics: PerformanceMetrics) => {
    metricsRef.current = metrics;
  };

  return {
    metrics: metricsRef.current,
    updateMetrics
  };
};
