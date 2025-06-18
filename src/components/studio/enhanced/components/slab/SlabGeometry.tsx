
import React from 'react';
import { RoundedBox } from '@react-three/drei';

export const SlabGeometry: React.FC = () => {
  return (
    <>
      {/* Main Slab Case - Professional Clear Plastic */}
      <RoundedBox
        args={[4.0, 5.8, 0.35]}
        radius={0.08}
        smoothness={6}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          transmission={0.98}
          opacity={0.05}
          thickness={0.2}
          roughness={0.02}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          envMapIntensity={2.0}
          ior={1.52}
          reflectivity={0.1}
          side={2}
        />
      </RoundedBox>

      {/* Inner Card Holder Cavity - White Plastic */}
      <RoundedBox
        args={[3.6, 5.4, 0.28]}
        radius={0.04}
        smoothness={4}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#fafafa"
          roughness={0.15}
          metalness={0.02}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
          envMapIntensity={0.8}
        />
      </RoundedBox>

      {/* Security Holographic Strip */}
      <mesh position={[1.6, 0, 0.18]} rotation={[0, 0, 0.15]}>
        <planeGeometry args={[0.12, 3.5]} />
        <meshPhysicalMaterial
          color="#10b981"
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={3.0}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 800]}
          emissive="#065f46"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Bottom Security Strip */}
      <mesh position={[0, -2.6, 0.18]}>
        <planeGeometry args={[3.4, 0.08]} />
        <meshPhysicalMaterial
          color="#10b981"
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={2.5}
          iridescence={0.8}
          iridescenceIOR={1.2}
          iridescenceThicknessRange={[50, 400]}
        />
      </mesh>

      {/* Subtle Corner Reinforcements */}
      {[-1.8, 1.8].map((x) =>
        [-2.6, 2.6].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.19]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} />
            <meshPhysicalMaterial
              color="#e5e7eb"
              roughness={0.3}
              metalness={0.1}
              clearcoat={0.2}
            />
          </mesh>
        ))
      )}
    </>
  );
};
