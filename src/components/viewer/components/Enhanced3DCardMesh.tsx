
import React, { useMemo, useEffect, useState, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
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

// Fallback component when textures fail to load
const FallbackCard: React.FC<{ geometry: any; materialSettings: any }> = ({ geometry, materialSettings }) => {
  return (
    <group>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[geometry.width, geometry.height]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>
      <mesh position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[geometry.width, geometry.height]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>
    </group>
  );
};

// Component to load and render textures
const TexturedCard: React.FC<{ 
  frontUrl: string; 
  backUrl: string; 
  geometry: any; 
  materialSettings: any;
}> = ({ frontUrl, backUrl, geometry, materialSettings }) => {
  try {
    const frontTexture = useLoader(TextureLoader, frontUrl);
    const backTexture = useLoader(TextureLoader, backUrl);

    return (
      <group>
        {/* Card Front */}
        <mesh position={[0, 0, geometry.depth / 2]}>
          <planeGeometry args={[geometry.width, geometry.height]} />
          <meshStandardMaterial 
            map={frontTexture}
            transparent
            opacity={0.95}
            metalness={materialSettings.metalness}
            roughness={materialSettings.roughness}
          />
        </mesh>

        {/* Card Back */}
        <mesh position={[0, 0, -geometry.depth / 2]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[geometry.width, geometry.height]} />
          <meshStandardMaterial 
            map={backTexture}
            transparent
            opacity={0.95}
            metalness={materialSettings.metalness}
            roughness={materialSettings.roughness}
          />
        </mesh>
      </group>
    );
  } catch (error) {
    console.warn('Failed to load textures:', error);
    return <FallbackCard geometry={geometry} materialSettings={materialSettings} />;
  }
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
  const [textureError, setTextureError] = useState(false);

  // Safe image URLs with fallbacks
  const frontImageUrl = useMemo(() => {
    if (!card?.image_url || card.image_url.includes('blob:')) {
      return '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
    }
    return card.image_url;
  }, [card?.image_url]);

  const backImageUrl = useMemo(() => {
    return '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png';
  }, []);

  // Create card geometry with standard proportions
  const cardGeometry = useMemo(() => {
    const width = 4;
    const height = 5.6;
    const depth = 0.1;
    return { width, height, depth };
  }, []);

  // Card edges component
  const CardEdges: React.FC = () => (
    <>
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
    </>
  );

  if (!card) {
    return null;
  }

  return (
    <group 
      rotation={[rotation.x * Math.PI / 180, rotation.y * Math.PI / 180, 0]}
      scale={zoom}
    >
      <Suspense fallback={<FallbackCard geometry={cardGeometry} materialSettings={materialSettings} />}>
        <TexturedCard 
          frontUrl={frontImageUrl}
          backUrl={backImageUrl}
          geometry={cardGeometry}
          materialSettings={materialSettings}
        />
      </Suspense>
      
      <CardEdges />
    </group>
  );
};
