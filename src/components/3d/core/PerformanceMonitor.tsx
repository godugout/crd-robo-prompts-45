
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { PerformanceMetrics } from '@/types/three';

interface PerformanceMonitorProps {
  targetFPS?: number;
  autoAdjustQuality?: boolean;
  showDebug?: boolean;
  onPerformanceChange?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  targetFPS = 60,
  autoAdjustQuality = false,
  showDebug = false,
  onPerformanceChange
}) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
    memoryUsage: 0
  });

  useFrame((state) => {
    frameCount.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.current;

    // Update FPS every second
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCount.current;
      
      const newMetrics: PerformanceMetrics = {
        fps,
        frameTime,
        drawCalls: state.gl.info?.render?.calls || 0,
        triangles: state.gl.info?.render?.triangles || 0,
        memoryUsage: (state.gl.info?.memory?.geometries || 0) + (state.gl.info?.memory?.textures || 0)
      };

      setMetrics(newMetrics);
      onPerformanceChange?.(newMetrics);

      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  return showDebug ? (
    <mesh position={[2, 2, 0]}>
      <planeGeometry args={[1, 0.5]} />
      <meshBasicMaterial color="black" transparent opacity={0.7} />
    </mesh>
  ) : null;
};

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
    memoryUsage: 0
  });

  const updateMetrics = (newMetrics: PerformanceMetrics): void => {
    setMetrics(newMetrics);
  };

  return { metrics, updateMetrics };
};
