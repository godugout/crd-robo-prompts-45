
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  cardPosition: THREE.Vector3;
  intensity: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ cardPosition, intensity }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particlePositions = useRef<Float32Array>();
  const particleVelocities = useRef<Float32Array>();
  const particleLifetimes = useRef<Float32Array>();

  useEffect(() => {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);

    // Initialize particles around the card
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = cardPosition.x + (Math.random() - 0.5) * 6;
      positions[i3 + 1] = cardPosition.y + (Math.random() - 0.5) * 6;
      positions[i3 + 2] = cardPosition.z + (Math.random() - 0.5) * 6;
      
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      lifetimes[i] = Math.random() * 100;
    }

    particlePositions.current = positions;
    particleVelocities.current = velocities;
    particleLifetimes.current = lifetimes;
  }, [cardPosition]);

  useFrame(() => {
    if (!particlesRef.current || !particlePositions.current || !particleVelocities.current || !particleLifetimes.current) return;

    const positions = particlePositions.current;
    const velocities = particleVelocities.current;
    const lifetimes = particleLifetimes.current;

    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Update particle positions with physics
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
      
      // Apply gravity
      velocities[i3 + 1] -= 0.0005;
      
      // Apply air resistance
      velocities[i3] *= 0.998;
      velocities[i3 + 1] *= 0.998;
      velocities[i3 + 2] *= 0.998;
      
      // Update lifetime
      lifetimes[i] -= 1;
      
      // Reset particle when it dies
      if (lifetimes[i] <= 0) {
        positions[i3] = cardPosition.x + (Math.random() - 0.5) * 6;
        positions[i3 + 1] = cardPosition.y + (Math.random() - 0.5) * 6;
        positions[i3 + 2] = cardPosition.z + (Math.random() - 0.5) * 6;
        
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        
        lifetimes[i] = Math.random() * 100;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particlePositions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6 * intensity}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
