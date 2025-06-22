
import React, { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { textureCache } from '../utils/textureCache';
import type { CardData } from '@/types/card';

interface Card3DProps {
  card: CardData;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  quality?: 'high' | 'medium' | 'low';
  interactive?: boolean;
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
  onHover,
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Card dimensions (standard trading card ratio 2.5:3.5)
  const cardWidth = 2.5 * scale;
  const cardHeight = 3.5 * scale;
  const cardDepth = 0.05 * scale;

  // Load texture with caching
  useEffect(() => {
    let mounted = true;
    
    const loadTexture = async () => {
      try {
        setIsLoading(true);
        const imageUrl = card.image_url || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
        const tex = await textureCache.loadTexture(imageUrl);
        
        if (mounted) {
          setTexture(tex);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Failed to load card texture:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadTexture();

    return () => {
      mounted = false;
      if (card.image_url) {
        textureCache.releaseTexture(card.image_url);
      }
    };
  }, [card.image_url]);

  // Material properties based on quality
  const materialProps = useMemo(() => {
    switch (quality) {
      case 'high':
        return {
          roughness: 0.1,
          metalness: 0.2,
          envMapIntensity: 1,
          clearcoat: 0.3,
          clearcoatRoughness: 0.1
        };
      case 'medium':
        return {
          roughness: 0.3,
          metalness: 0.1,
          envMapIntensity: 0.5
        };
      case 'low':
        return {
          roughness: 0.5,
          metalness: 0.05
        };
    }
  }, [quality]);

  // Animation
  useFrame((state) => {
    if (meshRef.current && interactive) {
      // Gentle hover animation
      const targetY = hovered ? 0.1 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        position[1] + targetY,
        0.1
      );

      // Subtle floating animation when not hovered
      if (!hovered) {
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
        ref={meshRef}
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
    <group>
      {/* Main card body */}
      <RoundedBox
        ref={meshRef}
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.1}
        smoothness={4}
        position={position}
        rotation={rotation}
        castShadow
        receiveShadow
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
      >
        <meshPhysicalMaterial
          map={texture}
          {...materialProps}
          transparent
          opacity={0.95}
        />
      </RoundedBox>

      {/* Holographic effect overlay for rare cards */}
      {(card.rarity === 'epic' || card.rarity === 'legendary') && quality === 'high' && (
        <RoundedBox
          args={[cardWidth + 0.01, cardHeight + 0.01, 0.001]}
          radius={0.1}
          smoothness={4}
          position={[position[0], position[1], position[2] + cardDepth/2 + 0.001]}
          rotation={rotation}
        >
          <meshPhysicalMaterial
            color={card.rarity === 'legendary' ? '#ffd700' : '#c084fc'}
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
