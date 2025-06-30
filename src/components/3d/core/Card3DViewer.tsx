
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Card3D } from './Card3D';
import { PerformanceMonitor } from './PerformanceMonitor';
import type { CardData } from '@/types/card';

interface Card3DViewerProps {
  card: CardData;
  enabled?: boolean;
  className?: string;
  onFallback?: () => void;
  onPerformanceIssue?: () => void;
}

export const Card3DViewer: React.FC<Card3DViewerProps> = ({
  card,
  enabled = true,
  className = '',
  onFallback,
  onPerformanceIssue
}) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onError={onFallback}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, -5, 2]} intensity={0.3} color="#4a9eff" />

          {/* Environment */}
          <Environment preset="studio" />

          {/* 3D Card */}
          <Card3D
            card={card}
            quality="high"
            interactive
          />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom
            enableRotate
            minDistance={2}
            maxDistance={8}
            autoRotate={false}
          />

          {/* Performance Monitor */}
          <PerformanceMonitor
            onPerformanceChange={(metrics) => {
              if (metrics.fps < 30) {
                onPerformanceIssue?.();
              }
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
