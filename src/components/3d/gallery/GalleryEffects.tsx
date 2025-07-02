
import React from 'react';
import { useFrame } from '@react-three/fiber';
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
  // Particle system for atmospheric effects
  const particleCount = quality === 'low' ? 50 : quality === 'medium' ? 100 : 200;
  
  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute particles throughout the gallery space
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;
      
      // Use environment colors for particles
      const color = new THREE.Color(environmentSettings.background);
      colors[i3] = color.r * 0.5;
      colors[i3 + 1] = color.g * 0.5;
      colors[i3 + 2] = color.b * 0.5;
    }
    
    return { positions, colors };
  }, [particleCount, environmentSettings.background]);
  
  const pointsRef = React.useRef<THREE.Points>(null);
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const time = clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animate particles with gentle floating motion
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.001;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  if (quality === 'low') return null;
  
  return (
    <group>
      {/* Atmospheric particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Layout-specific effects */}
      {layoutType === 'spiral' && (quality === 'high' || quality === 'ultra') && (
        <SpiralTrail cardCount={cardCount} />
      )}
      
      {layoutType === 'circle' && (quality === 'high' || quality === 'ultra') && (
        <CircleGlow cardCount={cardCount} />
      )}
    </group>
  );
};

// Layout-specific effect components
const SpiralTrail: React.FC<{ cardCount: number }> = ({ cardCount }) => {
  const points = React.useMemo(() => {
    const trailPoints = [];
    const spiralRadius = 10;
    const spiralHeight = cardCount * 0.5;
    
    for (let i = 0; i <= cardCount; i++) {
      const angle = (i / cardCount) * Math.PI * 4;
      const height = (i / cardCount) * spiralHeight;
      
      trailPoints.push(
        spiralRadius * Math.cos(angle),
        height,
        spiralRadius * Math.sin(angle)
      );
    }
    
    return new Float32Array(trailPoints);
  }, [cardCount]);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4a90e2" transparent opacity={0.3} />
    </line>
  );
};

const CircleGlow: React.FC<{ cardCount: number }> = ({ cardCount }) => {
  const radius = Math.max(5, cardCount * 0.3);
  
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.5, radius + 0.5, 64]} />
      <meshBasicMaterial 
        color="#4a90e2" 
        transparent 
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
