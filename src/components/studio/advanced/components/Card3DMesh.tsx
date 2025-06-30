
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import type { CardData } from '@/hooks/useCardEditor';

interface Card3DMeshProps {
  cardData: CardData;
  imageUrl?: string;
  effects?: {
    holographic?: boolean;
    metalness?: number;
    roughness?: number;
    particles?: boolean;
    glow?: boolean;
    glowColor?: string;
    chrome?: boolean;
    crystal?: boolean;
    vintage?: boolean;
  };
}

export const Card3DMesh: React.FC<Card3DMeshProps> = ({
  cardData,
  imageUrl,
  effects = {}
}) => {
  const cardRef = useRef<THREE.Group>(null);
  
  // Load texture if provided
  const texture = imageUrl ? useLoader(TextureLoader, imageUrl) : null;
  
  // Create card back texture
  const backTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 356;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Card back design
      const gradient = ctx.createLinearGradient(0, 0, 256, 356);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 356);
      
      // Border
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, 240, 340);
      
      // Logo placeholder
      ctx.fillStyle = '#4a9eff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CRD', 128, 180);
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Animation
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
  });

  const materialProps = useMemo(() => {
    if (effects.chrome) {
      return {
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 2,
      };
    } else if (effects.crystal) {
      return {
        metalness: 0.1,
        roughness: 0.0,
        transmission: 0.9,
        thickness: 0.5,
      };
    } else if (effects.vintage) {
      return {
        metalness: 0.2,
        roughness: 0.8,
      };
    } else {
      return {
        metalness: effects.metalness || 0.3,
        roughness: effects.roughness || 0.4,
      };
    }
  }, [effects]);

  return (
    <group ref={cardRef}>
      {/* Card Front */}
      <mesh position={[0, 0, 0.025]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.5, 0.05]} />
        <meshPhysicalMaterial
          map={texture}
          transparent
          opacity={0.95}
          {...materialProps}
        />
      </mesh>

      {/* Card Back */}
      <mesh position={[0, 0, -0.025]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.5, 0.05]} />
        <meshStandardMaterial
          map={backTexture}
          {...materialProps}
        />
      </mesh>

      {/* Glow Effect */}
      {effects.glow && (
        <mesh position={[0, 0, 0.051]}>
          <boxGeometry args={[2.52, 3.52, 0.001]} />
          <meshBasicMaterial
            color={effects.glowColor || '#00ffff'}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};
