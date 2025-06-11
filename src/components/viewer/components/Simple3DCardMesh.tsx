
import React from 'react';
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
  return (
    <mesh 
      position={[0, 0, 0]}
      rotation={[rotation.x * Math.PI / 180, rotation.y * Math.PI / 180, 0]}
      scale={zoom}
    >
      <planeGeometry args={[4, 5.6]} />
      <meshStandardMaterial 
        map={card.image_url ? undefined : undefined}
        color="#ffffff"
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};
