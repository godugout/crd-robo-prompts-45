
import React from 'react';
import { RoundedBox } from '@react-three/drei';

export const SlabGeometry: React.FC = () => {
  return (
    <>
      {/* Main Slab Case - Clear Plastic */}
      <RoundedBox
        args={[3.2, 4.2, 0.3]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          transmission={0.95}
          opacity={0.1}
          thickness={0.1}
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
          ior={1.5}
        />
      </RoundedBox>

      {/* Card Holder Cavity */}
      <RoundedBox
        args={[2.8, 3.8, 0.25]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#f8f9fa"
          roughness={0.1}
          metalness={0.05}
          clearcoat={0.3}
        />
      </RoundedBox>

      {/* Holographic Security Strip */}
      <mesh position={[1.3, 0, 0.16]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[0.1, 2]} />
        <meshPhysicalMaterial
          color="#10b981"
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={2}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 800]}
        />
      </mesh>
    </>
  );
};
