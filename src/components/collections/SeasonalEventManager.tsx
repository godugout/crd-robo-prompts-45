
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';

interface Collection {
  id: string;
  title: string;
  theme: string;
}

interface SeasonalEventManagerProps {
  collections: Collection[];
  onSeasonalEffect: (effect: any) => void;
}

export const SeasonalEventManager: React.FC<SeasonalEventManagerProps> = ({
  collections,
  onSeasonalEffect
}) => {
  const [currentSeason, setCurrentSeason] = useState('spring');
  const managerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (managerRef.current) {
      managerRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  const getSeasonColor = (season: string) => {
    const colors: { [key: string]: string } = {
      spring: '#22c55e',
      summer: '#fbbf24',
      autumn: '#f97316',
      winter: '#3b82f6'
    };
    return colors[season] || '#6b7280';
  };

  return (
    <group ref={managerRef}>
      <Text
        position={[0, 8, 0]}
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Seasonal Events
      </Text>

      {/* Season Display */}
      <Box args={[8, 2, 1]} position={[0, 4, 0]}>
        <meshStandardMaterial color={new THREE.Color(getSeasonColor(currentSeason))} />
      </Box>

      <Text
        position={[0, 4, 0.6]}
        fontSize={1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {currentSeason.toUpperCase()}
      </Text>

      {/* Collections affected by season */}
      {collections.slice(0, 3).map((collection, index) => (
        <group key={collection.id} position={[index * 6 - 6, -2, 0]}>
          <Box args={[4, 3, 0.5]}>
            <meshStandardMaterial 
              color={new THREE.Color(getSeasonColor(currentSeason))}
              transparent
              opacity={0.7}
            />
          </Box>
          <Text
            position={[0, 0, 0.3]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {collection.title}
          </Text>
        </group>
      ))}
    </group>
  );
};
