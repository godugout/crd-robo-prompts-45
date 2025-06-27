
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Collection {
  id: string;
  title: string;
  theme: string;
  cards: Array<{
    id: string;
    title: string;
    rarity: string;
  }>;
}

interface LivingCollectionsSystemProps {
  collections: Collection[];
  onCardInteraction: (type: string, data: any) => void;
  onCollectionEvolution: (collectionId: string, newState: any) => void;
}

export const LivingCollectionsSystem: React.FC<LivingCollectionsSystemProps> = ({
  collections,
  onCardInteraction,
  onCollectionEvolution
}) => {
  const [activeEvolution, setActiveEvolution] = useState<string | null>(null);
  const systemRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (systemRef.current) {
      systemRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const handleEvolutionTrigger = (collectionId: string) => {
    setActiveEvolution(collectionId);
    onCollectionEvolution(collectionId, {
      evolution_stage: 'active',
      timestamp: Date.now()
    });
    
    setTimeout(() => setActiveEvolution(null), 3000);
  };

  return (
    <group ref={systemRef}>
      <Text
        position={[0, 10, 0]}
        fontSize={2}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        Living Collections
      </Text>

      {collections.map((collection, index) => {
        const angle = (index / collections.length) * Math.PI * 2;
        const radius = 15;
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ];

        return (
          <group key={collection.id} position={position}>
            {/* Collection Core */}
            <Sphere
              args={[2]}
              onClick={() => handleEvolutionTrigger(collection.id)}
            >
              <meshPhysicalMaterial
                color={new THREE.Color('#4ade80')}
                transparent
                opacity={0.8}
                emissive={new THREE.Color('#4ade80')}
                emissiveIntensity={activeEvolution === collection.id ? 0.5 : 0.2}
              />
            </Sphere>

            {/* Collection Title */}
            <Text
              position={[0, -3, 0]}
              fontSize={0.8}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {collection.title}
            </Text>

            {/* Evolution Indicator */}
            {activeEvolution === collection.id && (
              <Text
                position={[0, 4, 0]}
                fontSize={0.6}
                color="#fbbf24"
                anchorX="center"
                anchorY="middle"
              >
                EVOLVING...
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
};
