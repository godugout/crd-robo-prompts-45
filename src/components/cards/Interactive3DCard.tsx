
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, TextureLoader, BoxGeometry, EdgesGeometry } from 'three';
import { useLoader } from '@react-three/fiber';

interface Interactive3DCardProps {
  card: {
    title?: string;
    image_url?: string;
    rarity?: string;
  };
  position?: [number, number, number];
  scale?: number;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  card,
  position = [0, 0, 0],
  scale = 1
}) => {
  const meshRef = useRef<Mesh>(null);
  
  // Load the card image as texture
  const texture = card.image_url ? useLoader(TextureLoader, card.image_url) : null;

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow receiveShadow>
      {/* Card geometry - standard trading card proportions */}
      <boxGeometry args={[2.5, 3.5, 0.1]} />
      
      {/* Card material */}
      <meshStandardMaterial
        map={texture}
        roughness={0.3}
        metalness={0.1}
      />
      
      {/* Card border/frame */}
      <lineSegments>
        <edgesGeometry args={[new BoxGeometry(2.5, 3.5, 0.1)]} />
        <lineBasicMaterial color="#888888" />
      </lineSegments>
    </mesh>
  );
};
