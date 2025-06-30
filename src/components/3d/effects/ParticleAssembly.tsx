
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleAssemblyProps {
  targetPosition: [number, number, number];
  targetDimensions: { width: number; height: number; depth: number };
  progress: number;
  particleCount: number;
}

export const ParticleAssembly: React.FC<ParticleAssemblyProps> = ({
  targetPosition,
  targetDimensions,
  progress,
  particleCount
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const targetPositions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random starting positions in cosmic space
      initialPositions[i * 3] = (Math.random() - 0.5) * 20;
      initialPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      initialPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Target positions on card surface
      const u = Math.random();
      const v = Math.random();
      targetPositions[i * 3] = targetPosition[0] + (u - 0.5) * targetDimensions.width;
      targetPositions[i * 3 + 1] = targetPosition[1] + (v - 0.5) * targetDimensions.height;
      targetPositions[i * 3 + 2] = targetPosition[2] + (Math.random() - 0.5) * targetDimensions.depth;
      
      // Initialize current positions
      positions[i * 3] = initialPositions[i * 3];
      positions[i * 3 + 1] = initialPositions[i * 3 + 1];
      positions[i * 3 + 2] = initialPositions[i * 3 + 2];
      
      // Cosmic dust colors
      const hue = Math.random() * 0.6 + 0.4; // Blue to purple range
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Particle sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, colors, sizes, targetPositions, initialPositions };
  }, [particleCount, targetPosition, targetDimensions]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const { targetPositions, initialPositions } = particleData;
    
    for (let i = 0; i < particleCount; i++) {
      // Interpolate between initial and target positions
      const startX = initialPositions[i * 3];
      const startY = initialPositions[i * 3 + 1];
      const startZ = initialPositions[i * 3 + 2];
      
      const targetX = targetPositions[i * 3];
      const targetY = targetPositions[i * 3 + 1];
      const targetZ = targetPositions[i * 3 + 2];
      
      // Smooth interpolation with easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      positions[i * 3] = startX + (targetX - startX) * easeProgress;
      positions[i * 3 + 1] = startY + (targetY - startY) * easeProgress;
      positions[i * 3 + 2] = startZ + (targetZ - startZ) * easeProgress;
      
      // Add some swirling motion
      const swirl = Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.1 * (1 - easeProgress);
      positions[i * 3] += swirl;
      positions[i * 3 + 1] += Math.cos(state.clock.elapsedTime * 2 + i * 0.1) * 0.1 * (1 - easeProgress);
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
