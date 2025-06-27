
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
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Wireframe sphere overlay */}
      <lineSegments scale={50}>
        <edgesGeometry>
          <sphereGeometry args={[1, 16, 16]} />
        </edgesGeometry>
        <lineBasicMaterial
          color={new THREE.Color(0x001122)}
          transparent={true}
          opacity={0.2}
        />
      </lineSegments>

      {/* Floating geometric patterns */}
      <group ref={geometryRef}>
        {/* Wireframe torus */}
        <lineSegments position={[8, 0, 0]}>
          <edgesGeometry>
            <torusGeometry args={[2, 0.5, 16, 100]} />
          </edgesGeometry>
          <lineBasicMaterial
            color="#00ffff"
            transparent={true}
            opacity={0.6 * intensity}
          />
        </lineSegments>

        {/* Wireframe icosahedron */}
        <lineSegments position={[-8, 0, 0]}>
          <edgesGeometry>
            <icosahedronGeometry args={[2, 1]} />
          </edgesGeometry>
          <lineBasicMaterial
            color="#ff00ff"
            transparent={true}
            opacity={0.6 * intensity}
          />
        </lineSegments>

        {/* Wireframe dodecahedron */}
        <lineSegments position={[0, 6, 0]}>
          <edgesGeometry>
            <dodecahedronGeometry args={[1.5]} />
          </edgesGeometry>
          <lineBasicMaterial
            color="#ffff00"
            transparent={true}
            opacity={0.6 * intensity}
          />
        </lineSegments>

        {/* Wireframe tetrahedron */}
        <lineSegments position={[0, -6, 0]}>
          <edgesGeometry>
            <tetrahedronGeometry args={[2]} />
          </edgesGeometry>
          <lineBasicMaterial
            color="#00ff00"
            transparent={true}
            opacity={0.6 * intensity}
          />
        </lineSegments>
      </group>

      {/* Grid floor */}
      <lineSegments position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry>
          <planeGeometry args={[30, 30, 30, 30]} />
        </edgesGeometry>
        <lineBasicMaterial
          color="#004400"
          transparent={true}
          opacity={0.4 * intensity}
        />
      </lineSegments>
    </>
  );
};
