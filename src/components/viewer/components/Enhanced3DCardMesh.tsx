
import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, DoubleSide } from 'three';
import type { CardData } from '@/types/card';

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
  // Load the card image as a texture
  const frontTexture = useLoader(
    TextureLoader, 
    card.image_url || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png'
  );

  // Load a default back texture (you can customize this)
  const backTexture = useLoader(
    TextureLoader, 
    '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png'
  );

  // Create card geometry with thickness
  const cardGeometry = useMemo(() => {
    // Standard trading card proportions (2.5" x 3.5")
    const width = 4;
    const height = 5.6;
    const depth = 0.1; // Card thickness
    
    return { width, height, depth };
  }, []);

  return (
    <group 
      rotation={[rotation.x * Math.PI / 180, rotation.y * Math.PI / 180, 0]}
      scale={zoom}
    >
      {/* Card Front */}
      <mesh position={[0, 0, cardGeometry.depth / 2]}>
        <planeGeometry args={[cardGeometry.width, cardGeometry.height]} />
        <meshStandardMaterial 
          map={frontTexture}
          transparent
          opacity={0.95}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
          clearcoat={materialSettings.clearcoat}
        />
      </mesh>

      {/* Card Back */}
      <mesh position={[0, 0, -cardGeometry.depth / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cardGeometry.width, cardGeometry.height]} />
        <meshStandardMaterial 
          map={backTexture}
          transparent
          opacity={0.95}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
          clearcoat={materialSettings.clearcoat}
        />
      </mesh>

      {/* Card Edges */}
      {/* Top Edge */}
      <mesh position={[0, cardGeometry.height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cardGeometry.width, cardGeometry.depth]} />
        <meshStandardMaterial 
          color="#e5e5e5"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Bottom Edge */}
      <mesh position={[0, -cardGeometry.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cardGeometry.width, cardGeometry.depth]} />
        <meshStandardMaterial 
          color="#e5e5e5"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Left Edge */}
      <mesh position={[-cardGeometry.width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[cardGeometry.depth, cardGeometry.height]} />
        <meshStandardMaterial 
          color="#e5e5e5"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Right Edge */}
      <mesh position={[cardGeometry.width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[cardGeometry.depth, cardGeometry.height]} />
        <meshStandardMaterial 
          color="#e5e5e5"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>
    </group>
  );
};
