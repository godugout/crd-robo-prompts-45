
import React, { useMemo } from 'react';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface GalleryEffectsProps {
  layoutType: string;
  environmentSettings: any;
  cardCount: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

export const GalleryEffects: React.FC<GalleryEffectsProps> = ({
  layoutType,
  environmentSettings,
  cardCount,
  quality
}) => {
  const particleCount = useMemo(() => {
    switch (quality) {
      case 'ultra':
        return Math.min(cardCount * 20, 1000);
      case 'high':
        return Math.min(cardCount * 10, 500);
      case 'medium':
        return Math.min(cardCount * 5, 250);
      default:
        return Math.min(cardCount * 2, 100);
    }
  }, [cardCount, quality]);

  const showAdvancedEffects = quality === 'high' || quality === 'ultra';
  const showBasicEffects = quality !== 'low';

  return (
    <group>
      {/* Environment lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        castShadow={showAdvancedEffects}
      />
      
      {/* Background effects based on layout */}
      {layoutType === 'spiral' && showBasicEffects && (
        <Sparkles
          count={particleCount}
          scale={[20, 20, 20]}
          size={2}
          speed={0.5}
          color="#gold"
        />
      )}
      
      {layoutType === 'circle' && showBasicEffects && (
        <Stars
          radius={50}
          depth={10}
          count={Math.min(particleCount / 2, 200)}
          factor={2}
          saturation={0.5}
        />
      )}
      
      {/* Advanced lighting for high quality */}
      {showAdvancedEffects && (
        <>
          <pointLight position={[-10, -10, -10]} color="#blue" intensity={0.3} />
          <pointLight position={[10, 10, 10]} color="#orange" intensity={0.3} />
          <fog attach="fog" args={['#202040', 10, 100]} />
        </>
      )}
      
      {/* Atmospheric effects */}
      {quality === 'ultra' && (
        <mesh>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial 
            color="#000011" 
            transparent 
            opacity={0.1} 
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
};
