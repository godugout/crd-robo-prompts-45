
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import type { CardData } from '@/types/card';

interface Advanced3DCardRendererProps {
  card: CardData;
  rotation: { x: number; y: number };
  zoom: number;
  materialSettings: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
  effectValues?: Record<string, any>;
  selectedFrame?: string;
  frameConfig?: any;
}

export const Advanced3DCardRenderer: React.FC<Advanced3DCardRendererProps> = ({
  card,
  rotation,
  zoom,
  materialSettings,
  effectValues = {},
  selectedFrame,
  frameConfig
}) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation.x * 0.01;
      meshRef.current.rotation.y = rotation.y * 0.01;
      meshRef.current.scale.setScalar(zoom);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[4, 5.6]} />
        <meshStandardMaterial 
          color="#ffffff"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};
