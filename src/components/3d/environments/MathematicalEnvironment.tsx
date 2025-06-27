
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface MathematicalEnvironmentProps {
  intensity: number;
}

export const MathematicalEnvironment: React.FC<MathematicalEnvironmentProps> = ({ intensity }) => {
  const geometryRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (geometryRef.current) {
      geometryRef.current.rotation.y += delta * 0.3;
      geometryRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <>
      <Environment preset="night" backgroundIntensity={0.2} />
      
      {/* Mathematical space background */}
      <mesh scale={50}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(0x001122)}
          side={THREE.BackSide}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating geometric patterns */}
      <group ref={geometryRef}>
        {/* Wireframe torus */}
        <mesh position={[8, 0, 0]}>
          <torusGeometry args={[2, 0.5, 16, 100]} />
          <meshBasicMaterial
            color="#00ffff"
            wireframe
            transparent
            opacity={0.6 * intensity}
          />
        </mesh>

        {/* Wireframe icosahedron */}
        <mesh position={[-8, 0, 0]}>
          <icosahedronGeometry args={[2, 1]} />
          <meshBasicMaterial
            color="#ff00ff"
            wireframe
            transparent
            opacity={0.6 * intensity}
          />
        </mesh>

        {/* Wireframe dodecahedron */}
        <mesh position={[0, 6, 0]}>
          <dodecahedronGeometry args={[1.5]} />
          <meshBasicMaterial
            color="#ffff00"
            wireframe
            transparent
            opacity={0.6 * intensity}
          />
        </mesh>

        {/* Wireframe tetrahedron */}
        <mesh position={[0, -6, 0]}>
          <tetrahedronGeometry args={[2]} />
          <meshBasicMaterial
            color="#00ff00"
            wireframe
            transparent
            opacity={0.6 * intensity}
          />
        </mesh>
      </group>

      {/* Grid floor */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshBasicMaterial
          color="#004400"
          wireframe
          transparent
          opacity={0.4 * intensity}
        />
      </mesh>
    </>
  );
};
