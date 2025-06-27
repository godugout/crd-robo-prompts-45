
import React from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface StudioEnvironmentProps {
  intensity: number;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({ intensity }) => {
  return (
    <>
      <Environment preset="studio" backgroundIntensity={intensity} />
      
      {/* Studio floor */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#f5f5f5"
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Studio backdrop */}
      <mesh position={[0, 0, -8]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>

      {/* Softbox lighting rigs */}
      <group position={[5, 3, 3]}>
        <mesh>
          <boxGeometry args={[2, 1.5, 0.2]} />
          <meshBasicMaterial color="#f0f0f0" />
        </mesh>
        <rectAreaLight
          intensity={10 * intensity}
          width={2}
          height={1.5}
          color="#ffffff"
          position={[0, 0, 0.2]}
        />
      </group>

      <group position={[-5, 3, 3]}>
        <mesh>
          <boxGeometry args={[2, 1.5, 0.2]} />
          <meshBasicMaterial color="#f0f0f0" />
        </mesh>
        <rectAreaLight
          intensity={5 * intensity}
          width={2}
          height={1.5}
          color="#ffffff"
          position={[0, 0, 0.2]}
        />
      </group>
    </>
  );
};
