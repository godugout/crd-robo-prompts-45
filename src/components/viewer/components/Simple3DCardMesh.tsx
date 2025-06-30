
import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { CardData } from '@/types/card';
import { Responsive3DCardMesh } from './Responsive3DCardMesh';

interface Simple3DCardMeshProps {
  card: CardData;
  rotation: { x: number; y: number };
  zoom: number;
}

export const Simple3DCardMesh: React.FC<Simple3DCardMeshProps> = ({
  card,
  rotation,
  zoom
}) => {
  // Simple material settings for basic 3D rendering
  const materialSettings = useMemo(() => ({
    metalness: 0.1,
    roughness: 0.8,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 0.2
  }), []);

  return (
    <Responsive3DCardMesh 
      card={card}
      rotation={rotation}
      zoom={zoom}
      materialSettings={materialSettings}
    />
  );
};
