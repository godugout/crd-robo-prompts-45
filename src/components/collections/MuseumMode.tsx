
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Collection {
  id: string;
  title: string;
  theme: 'sports' | 'fantasy' | 'nature' | 'tech' | 'art';
  cards: Array<{
    id: string;
    title: string;
    rarity: string;
    tags: string[];
    created_at: string;
  }>;
}

interface MuseumModeProps {
  collections: Collection[];
  onCollectionUpdate: (collection: Collection) => void;
}

export const MuseumMode: React.FC<MuseumModeProps> = ({
  collections,
  onCollectionUpdate
}) => {
  const [selectedExhibition, setSelectedExhibition] = useState<Collection | null>(null);

  return (
    <group>
      {/* Museum Gallery Layout */}
      {collections.map((collection, index) => (
        <group key={collection.id} position={[index * 15 - (collections.length * 7.5), 0, 0]}>
          {/* Exhibition Pedestal */}
          <Box
            args={[10, 0.5, 8]}
            position={[0, -2, 0]}
            onClick={() => setSelectedExhibition(collection)}
          >
            <meshStandardMaterial color={new THREE.Color('#8B4513')} />
          </Box>

          {/* Collection Display */}
          <Box args={[8, 10, 0.2]} position={[0, 3, -3]}>
            <meshPhysicalMaterial
              color={new THREE.Color('#ffffff')}
              transparent
              opacity={0.9}
              roughness={0.1}
            />
          </Box>

          {/* Collection Title */}
          <Text
            position={[0, 8, -2.9]}
            fontSize={1}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {collection.title}
          </Text>

          {/* Card Count */}
          <Text
            position={[0, 6.5, -2.9]}
            fontSize={0.5}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            {collection.cards.length} Cards
          </Text>

          {/* Theme Indicator */}
          <Sphere args={[0.5]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={new THREE.Color(getThemeColor(collection.theme))}
              transparent
              opacity={0.7}
            />
          </Sphere>
        </group>
      ))}

      {/* Museum Lighting */}
      <spotLight
        position={[0, 20, 10]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        castShadow
      />
      
      {/* Ambient Museum Lighting */}
      <ambientLight intensity={0.3} />
    </group>
  );
};

const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'sports': return '#1e40af';
    case 'fantasy': return '#7c3aed';
    case 'nature': return '#059669';
    case 'tech': return '#dc2626';
    case 'art': return '#ea580c';
    default: return '#6b7280';
  }
};
