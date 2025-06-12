
import React, { useMemo, useEffect, useState, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { CardData } from '@/types/card';
import { Responsive3DCardMesh } from './Responsive3DCardMesh';

interface Enhanced3DCardMeshProps {
  card: CardData;
  rotation: { x: number; y: number };
  zoom: number;
  materialSettings?: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
}

// Fallback component when textures fail to load
const FallbackCard: React.FC<{ materialSettings: any }> = ({ materialSettings }) => {
  return (
    <group>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[4, 5.6]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>
      <mesh position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[4, 5.6]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>
    </group>
  );
};

export const Enhanced3DCardMesh: React.FC<Enhanced3DCardMeshProps> = ({
  card,
  rotation,
  zoom,
  materialSettings = {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  }
}) => {
  // Validate card data
  if (!card || typeof card !== 'object') {
    console.warn('Invalid card data provided to Enhanced3DCardMesh:', card);
    return <FallbackCard materialSettings={materialSettings} />;
  }

  // Validate rotation data
  const safeRotation = useMemo(() => ({
    x: typeof rotation?.x === 'number' && !isNaN(rotation.x) ? rotation.x : 0,
    y: typeof rotation?.y === 'number' && !isNaN(rotation.y) ? rotation.y : 0
  }), [rotation]);

  // Validate zoom
  const safeZoom = useMemo(() => {
    const zoomValue = typeof zoom === 'number' && !isNaN(zoom) && zoom > 0 ? zoom : 1;
    return Math.max(0.1, Math.min(5, zoomValue)); // Clamp between 0.1 and 5
  }, [zoom]);

  return (
    <Suspense fallback={<FallbackCard materialSettings={materialSettings} />}>
      <Responsive3DCardMesh 
        card={card}
        rotation={safeRotation}
        zoom={safeZoom}
        materialSettings={materialSettings}
      />
    </Suspense>
  );
};
