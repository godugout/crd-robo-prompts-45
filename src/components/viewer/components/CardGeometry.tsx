
import React from 'react';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface CardGeometryProps {
  frontImageUrl: string;
  backImageUrl: string;
  dimensions: { width: number; height: number; depth: number };
  materialSettings: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
}

export const CardGeometry: React.FC<CardGeometryProps> = ({
  frontImageUrl,
  backImageUrl,
  dimensions,
  materialSettings
}) => {
  // Load textures
  const frontTexture = useLoader(TextureLoader, frontImageUrl);
  const backTexture = useLoader(TextureLoader, backImageUrl);

  return (
    <>
      {/* Card Front */}
      <mesh
        position={[0, 0, dimensions.depth / 2]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshStandardMaterial
          map={frontTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Card Back */}
      <mesh
        position={[0, 0, -dimensions.depth / 2]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshStandardMaterial
          map={backTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Card Thickness - Single box geometry instead of 4 planes */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </>
  );
};
