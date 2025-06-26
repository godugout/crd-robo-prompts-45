
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import { Mesh } from 'three';

interface Advanced3DCardProps {
  cardData: {
    title: string;
    description: string;
    image_url: string;
    rarity: string;
    design_metadata?: any;
  };
  layers: any[];
  effects: any[];
  materials: any[];
  isPlaying: boolean;
  previewMode: string;
}

export const Advanced3DCard: React.FC<Advanced3DCardProps> = ({
  cardData,
  layers,
  effects,
  materials,
  isPlaying,
  previewMode
}) => {
  const meshRef = useRef<Mesh>(null);

  // Load card image texture if available
  let texture;
  try {
    if (cardData.image_url) {
      texture = useLoader(TextureLoader, cardData.image_url);
    }
  } catch (error) {
    console.warn('Failed to load card texture:', error);
  }

  // Determine card color based on rarity
  const rarityColors = {
    common: '#6b7280',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
  };

  const cardColor = rarityColors[cardData.rarity as keyof typeof rarityColors] || '#6b7280';

  // Animation
  useFrame((state) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group>
      {/* Main Card Body */}
      <RoundedBox
        ref={meshRef}
        args={[2.5, 3.5, 0.05]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color={cardColor}
          map={texture}
          roughness={0.1}
          metalness={0.2}
          reflectivity={0.8}
        />
      </RoundedBox>

      {/* Card Title */}
      <Text
        position={[0, 1.2, 0.05]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
        font="/fonts/inter-bold.woff"
      >
        {cardData.title || 'Card Title'}
      </Text>

      {/* Card Description */}
      {cardData.description && (
        <Text
          position={[0, -1.2, 0.05]}
          fontSize={0.12}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
        >
          {cardData.description}
        </Text>
      )}

      {/* Rarity Indicator */}
      <RoundedBox
        args={[0.3, 0.3, 0.02]}
        radius={0.05}
        position={[1, -1.5, 0.05]}
      >
        <meshPhysicalMaterial
          color={cardColor}
          emissive={cardColor}
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      {/* Card Back */}
      <RoundedBox
        args={[2.5, 3.5, 0.05]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
        position={[0, 0, -0.05]}
        rotation={[0, Math.PI, 0]}
      >
        <meshPhysicalMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Holographic Effect for Epic+ rarities */}
      {(cardData.rarity === 'epic' || cardData.rarity === 'legendary') && (
        <RoundedBox
          args={[2.52, 3.52, 0.001]}
          radius={0.1}
          position={[0, 0, 0.051]}
        >
          <meshPhysicalMaterial
            color="#ffd700"
            transparent
            opacity={0.2}
            roughness={0}
            metalness={1}
            envMapIntensity={2}
          />
        </RoundedBox>
      )}
    </group>
  );
};
