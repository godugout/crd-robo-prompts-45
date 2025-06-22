
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Card } from '@/types/cards';

interface FloatingInfoPanelProps {
  card: Card;
  position: [number, number, number];
  visible: boolean;
}

export const FloatingInfoPanel: React.FC<FloatingInfoPanelProps> = ({
  card,
  position,
  visible
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });
  
  if (!visible) return null;
  
  return (
    <group ref={groupRef} position={position}>
      {/* Background panel */}
      <mesh>
        <planeGeometry args={[3, 1.5]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Card info */}
      <Html
        position={[0, 0, 0.01]}
        center
        transform
        occlude
        style={{
          width: '300px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          pointerEvents: 'none'
        }}
      >
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">{card.title}</h3>
          {card.description && (
            <p className="text-sm text-gray-300 mb-2">{card.description}</p>
          )}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Rarity: {card.rarity}</span>
            {card.tags && card.tags.length > 0 && (
              <span>Tags: {card.tags.slice(0, 2).join(', ')}</span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
