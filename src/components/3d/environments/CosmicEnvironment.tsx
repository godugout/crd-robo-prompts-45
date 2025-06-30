
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface CosmicEnvironmentProps {
  intensity: number;
}

export const CosmicEnvironment: React.FC<CosmicEnvironmentProps> = ({ intensity }) => {
  const nebulaRef = useRef<THREE.Points>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Animated nebula particles
  const nebulaCount = 500;
  const starCount = 1000;

  const nebulaGeometry = React.useMemo(() => {
    const positions = new Float32Array(nebulaCount * 3);
    const colors = new Float32Array(nebulaCount * 3);
    const sizes = new Float32Array(nebulaCount);

    for (let i = 0; i < nebulaCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const hue = Math.random() * 0.3 + 0.6; // Purple to blue
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 5 + 1;
    }

    return { positions, colors, sizes };
  }, []);

  const starGeometry = React.useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, sizes };
  }, []);

  useFrame((state, delta) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += delta * 0.1;
      nebulaRef.current.rotation.x += delta * 0.05;
    }
    
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <>
      <Environment preset="night" backgroundIntensity={0.1} />
      
      {/* Cosmic background sphere */}
      <mesh scale={80}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(0x000011)}
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Nebula particles */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nebulaCount}
            array={nebulaGeometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nebulaCount}
            array={nebulaGeometry.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={nebulaCount}
            array={nebulaGeometry.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.6 * intensity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Star field */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={starGeometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starCount}
            array={starGeometry.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#ffffff"
          transparent
          opacity={0.8 * intensity}
          sizeAttenuation
        />
      </points>
    </>
  );
};
