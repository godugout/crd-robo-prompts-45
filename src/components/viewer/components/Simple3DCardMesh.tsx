
import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { CardData } from '@/types/card';

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
  // Load the card image as a texture
  const texture = useLoader(
    TextureLoader, 
    card.image_url || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
  );

  // Memoize the material to prevent unnecessary re-renders
  const material = useMemo(() => {
    return {
      map: texture,
      transparent: true,
      opacity: 0.95,
    };
  }, [texture]);

  return (
    <mesh 
      position={[0, 0, 0]}
      rotation={[rotation.x * Math.PI / 180, rotation.y * Math.PI / 180, 0]}
      scale={zoom}
    >
      <planeGeometry args={[4, 5.6]} />
      <meshStandardMaterial 
        map={texture}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
};
