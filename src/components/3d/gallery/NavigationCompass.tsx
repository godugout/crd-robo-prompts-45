
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Card } from '@/types/cards';

interface NavigationCompassProps {
  position: [number, number, number];
  selectedCard: Card | null;
  cards: Card[];
  cardPositions: Map<string, THREE.Vector3>;
}

export const NavigationCompass: React.FC<NavigationCompassProps> = ({
  position,
  selectedCard,
  cards,
  cardPositions
}) => {
  const compassRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (compassRef.current) {
      // Gentle rotation
      compassRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group ref={compassRef} position={position}>
      {/* Compass base */}
      <mesh>
        <cylinderGeometry args={[1, 1, 0.1, 16]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.8} />
      </mesh>
      
      {/* North indicator */}
      <Text
        position={[0, 0.1, 0.8]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        N
      </Text>
      
      {/* Selected card indicator */}
      {selectedCard && (
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      )}
      
      {/* Collection center indicator */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
    </group>
  );
};
