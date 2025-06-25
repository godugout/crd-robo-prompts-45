
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Card3D } from './Card3D';
import { PerformanceMonitor, usePerformanceMetrics } from './PerformanceMonitor';
import { detectWebGLCapabilities, getOptimalSettings } from '../utils/webglDetection';
import type { CardData } from '@/types/card';

interface Card3DViewerProps {
  card: CardData;
  enabled?: boolean;
  className?: string;
  onFallback?: () => void;
  onPerformanceIssue?: () => void;
}

const Scene: React.FC<{ 
  card: CardData; 
  quality: 'high' | 'medium' | 'low';
  shadows: boolean; 
}> = ({ card, quality, shadows }) => {
  return (
    <>
      {/* Enhanced lighting setup for better card visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.2} 
        castShadow={shadows}
        shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.4} />
      <pointLight position={[5, -5, 5]} intensity={0.3} />
      
      {/* Environment for reflections */}
      {quality === 'high' && <Environment preset="studio" />}
      
      {/* The 3D card with enhanced scale for better visibility */}
      <Card3D 
        card={card}
        position={[0, 0, 0]}
        scale={[1.8, 1.8, 1.8]}
        quality={quality}
        interactive={true}
      />
      
      {/* Performance monitoring */}
      <PerformanceMonitor 
        targetFPS={60}
        autoAdjustQuality={true}
        showDebug={process.env.NODE_ENV === 'development'}
      />
    </>
  );
};

export const Card3DViewer: React.FC<Card3DViewerProps> = ({
  card,
  enabled = true,
  className = '',
  onFallback,
  onPerformanceIssue
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [settings, setSettings] = useState(getOptimalSettings(detectWebGLCapabilities()));
  const [hasError, setHasError] = useState(false);
  const { metrics, updateMetrics } = usePerformanceMetrics();

  // WebGL capability detection
  useEffect(() => {
    const capabilities = detectWebGLCapabilities();
    setWebglSupported(capabilities.supported);
    setSettings(getOptimalSettings(capabilities));
    
    if (!capabilities.supported) {
      onFallback?.();
    }
  }, [onFallback]);

  // Performance monitoring
  useEffect(() => {
    if (metrics.fps < 30 && metrics.fps > 0) {
      onPerformanceIssue?.();
    }
  }, [metrics.fps, onPerformanceIssue]);

  // Error boundary for Canvas
  const handleCanvasError = (event: React.SyntheticEvent<HTMLDivElement, Event>) => {
    console.error('3D Canvas error:', event);
    setHasError(true);
    onFallback?.();
  };

  if (!enabled || webglSupported === false || hasError) {
    return null; // Fallback handled by parent
  }

  if (webglSupported === null) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-white text-sm">Loading 3D viewer...</div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        ref={canvasRef}
        shadows={settings.shadows}
        dpr={settings.pixelRatio}
        gl={{
          antialias: settings.antialias,
          alpha: true,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 0, 4], fov: 60 }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor(new THREE.Color('#000000'), 0);
          gl.shadowMap.enabled = settings.shadows;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          
          // Optimize camera for better card visibility
          camera.position.set(0, 0, 4);
          camera.lookAt(0, 0, 0);
        }}
        onError={handleCanvasError}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={60} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2.5}
          maxDistance={8}
          autoRotate={false}
          maxPolarAngle={Math.PI}
          target={[0, 0, 0]}
        />
        
        <Suspense fallback={null}>
          <Scene 
            card={card} 
            quality={settings.quality}
            shadows={settings.shadows}
          />
        </Suspense>
      </Canvas>
      
      {/* Performance indicator in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs p-2 rounded">
          FPS: {metrics.fps} | Quality: {settings.quality}
        </div>
      )}
    </div>
  );
};
