
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  enabled?: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 100,
  rarity,
  enabled = true
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const particleCount = enabled ? count : 0;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position around card
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
      
      // Color based on rarity
      switch (rarity) {
        case 'legendary':
          colors[i3] = 1.0; // Red
          colors[i3 + 1] = 0.8; // Green
          colors[i3 + 2] = 0.0; // Blue
          break;
        case 'epic':
          colors[i3] = 0.8;
          colors[i3 + 1] = 0.3;
          colors[i3 + 2] = 1.0;
          break;
        case 'rare':
          colors[i3] = 0.0;
          colors[i3 + 1] = 0.8;
          colors[i3 + 2] = 1.0;
          break;
        default:
          colors[i3] = 0.8;
          colors[i3 + 1] = 0.8;
          colors[i3 + 2] = 0.8;
      }
      
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    return { positions, colors, sizes };
  }, [count, rarity, enabled]);
  
  useFrame(({ clock }) => {
    if (!pointsRef.current || !enabled) return;
    
    const time = clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Floating animation
      positions[i + 1] += Math.sin(time + i) * 0.002;
      
      // Spiral motion for legendary cards
      if (rarity === 'legendary') {
        const angle = time * 0.5 + i * 0.1;
        positions[i] += Math.cos(angle) * 0.001;
        positions[i + 2] += Math.sin(angle) * 0.001;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!enabled) return null;
  
  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};
