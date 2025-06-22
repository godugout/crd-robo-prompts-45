
import React, { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { textureCache } from '../utils/textureCache';
import { PremiumCardMaterial } from '../materials/PremiumCardMaterial';
import type { CardData } from '@/types/card';

interface Card3DProps {
  card: CardData;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  interactive?: boolean;
  isFlipped?: boolean;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
}

const CardMesh: React.FC<Card3DProps> = ({
  card,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  quality = 'high',
  interactive = true,
  isFlipped = false,
  onHover,
  onClick
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Card dimensions (standard trading card ratio 2.5:3.5)
  const cardWidth = 2.5 * scale;
  const cardHeight = 3.5 * scale;
  const cardDepth = 0.05 * scale;

  // Load textures with caching
  useEffect(() => {
    let mounted = true;
    
    const loadTextures = async () => {
      try {
        setIsLoading(true);
        const frontImageUrl = card.image_url || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
        const backImageUrl = '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png';
        
        const [frontTex, backTex] = await Promise.all([
          textureCache.loadTexture(frontImageUrl),
          textureCache.loadTexture(backImageUrl)
        ]);
        
        if (mounted) {
          setFrontTexture(frontTex);
          setBackTexture(backTex);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Failed to load card textures:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadTextures();

    return () => {
      mounted = false;
      if (card.image_url) {
        textureCache.releaseTexture(card.image_url);
      }
      textureCache.releaseTexture('/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png');
    };
  }, [card.image_url]);

  // Animation with spring physics
  useFrame((state) => {
    if (meshRef.current && interactive) {
      // Smooth flip animation
      const targetRotationY = isFlipped ? Math.PI : 0;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        0.1
      );
      
      // Gentle hover animation
      const targetY = hovered ? 0.1 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        position[1] + targetY,
        0.1
      );

      // Subtle floating animation when not hovered
      if (!hovered && !isFlipped) {
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      }
    }
  });

  const handlePointerEnter = () => {
    if (interactive) {
      setHovered(true);
      onHover?.(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerLeave = () => {
    if (interactive) {
      setHovered(false);
      onHover?.(false);
      document.body.style.cursor = 'auto';
    }
  };

  if (isLoading) {
    return (
      <RoundedBox
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.1}
        smoothness={4}
        position={position}
        rotation={rotation}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1a1a1a" />
      </RoundedBox>
    );
  }

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
    >
      {/* Card Front */}
      <RoundedBox
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <PremiumCardMaterial
          texture={frontTexture}
          rarity={card.rarity as any}
          quality={quality}
        />
      </RoundedBox>

      {/* Card Back */}
      <RoundedBox
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          map={backTexture}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Premium effect overlay for rare cards */}
      {(card.rarity === 'epic' || card.rarity === 'legendary') && quality !== 'low' && (
        <RoundedBox
          args={[cardWidth + 0.01, cardHeight + 0.01, 0.001]}
          radius={0.1}
          smoothness={4}
          position={[0, 0, cardDepth/2 + 0.001]}
        >
          <meshPhysicalMaterial
            color={card.rarity === 'legendary' ? '#ffd700' : '#c084fc'}
            transparent
            opacity={0.2}
            roughness={0}
            metalness={1}
            envMapIntensity={2}
            emissive={card.rarity === 'legendary' ? '#ffaa00' : '#8b5cf6'}
            emissiveIntensity={0.1}
          />
        </RoundedBox>
      )}
    </group>
  );
};

export const Card3D: React.FC<Card3DProps> = (props) => {
  return (
    <Suspense fallback={
      <RoundedBox
        args={[2.5 * (props.scale || 1), 3.5 * (props.scale || 1), 0.05 * (props.scale || 1)]}
        radius={0.1}
        smoothness={4}
        position={props.position}
        rotation={props.rotation}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1a1a1a" />
      </RoundedBox>
    }>
      <CardMesh {...props} />
    </Suspense>
  );
};
