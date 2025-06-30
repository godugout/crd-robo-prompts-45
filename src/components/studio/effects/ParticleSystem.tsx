
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count: number;
  intensity: number;
  enabled: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ count, intensity, enabled }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Random positions around card
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      // Random colors (magical sparkles)
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.9);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = Math.random() * 2 + 1;
    }
    
    return { positions, colors, sizes };
  }, [count]);
  
  useFrame((state) => {
    if (!meshRef.current || !enabled) return;
    
    const time = state.clock.elapsedTime;
    const positionArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Floating animation
      positionArray[i * 3 + 1] += Math.sin(time + i) * 0.001;
      
      // Gentle orbital motion
      const angle = time * 0.2 + i * 0.1;
      positionArray[i * 3] += Math.cos(angle) * 0.0005;
      positionArray[i * 3 + 2] += Math.sin(angle) * 0.0005;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!enabled) return null;
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1 * (intensity / 100)}
        vertexColors
        transparent
        opacity={intensity / 100}
        sizeAttenuation
      />
    </points>
  );
};
