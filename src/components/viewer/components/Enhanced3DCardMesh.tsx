
import React, { useMemo, useEffect, useState } from 'react';
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
  const [imageError, setImageError] = useState(false);
  const [backError, setBackError] = useState(false);

  // Safe image URL with fallback
  const safeImageUrl = useMemo(() => {
    if (!card.image_url || imageError) {
      return '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
    }
    return card.image_url;
  }, [card.image_url, imageError]);

  // Safe back texture URL with fallback
  const safeBackUrl = useMemo(() => {
    if (backError) {
      return '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
    }
    return '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png';
  }, [backError]);

  // Load textures with error handling
  const frontTexture = useLoader(TextureLoader, safeImageUrl);
  const backTexture = useLoader(TextureLoader, safeBackUrl);

  // Handle texture loading errors
  useEffect(() => {
    if (card.image_url && !card.image_url.startsWith('blob:')) {
      const img = new Image();
      img.onload = () => setImageError(false);
      img.onerror = () => {
        console.warn('Failed to load card image:', card.image_url);
        setImageError(true);
      };
      img.src = card.image_url;
    }
  }, [card.image_url]);

  // Create card geometry with standard proportions
  const cardGeometry = useMemo(() => {
    const width = 4;
    const height = 5.6;
    const depth = 0.1;
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
