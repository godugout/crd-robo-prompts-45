
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Enhanced3DCardRendererProps {
  frontImage?: string;
  backImage?: string;
  selectedFrame?: string;
  effects?: {
    holographic?: number;
    metallic?: number;
    chrome?: number;
    particles?: boolean;
  };
  rotation?: { x: number; y: number };
  zoom?: number;
  cardData?: {
    title?: string;
    rarity?: string;
    description?: string;
  };
}

export const Enhanced3DCardRenderer: React.FC<Enhanced3DCardRendererProps> = ({
  frontImage,
  backImage,
  selectedFrame,
  effects = {},
  rotation = { x: 0, y: 0 },
  zoom = 1,
  cardData = {}
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const frontMeshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);

  // Standard trading card dimensions (in mm, scaled down)
  const cardDimensions = {
    width: 2.5,   // 63mm scaled
    height: 3.5,  // 88mm scaled  
    depth: 0.1    // Card thickness
  };

  // Load textures with fallbacks
  const defaultFrontTexture = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
  const defaultBackTexture = '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png';

  const frontTexture = useLoader(TextureLoader, frontImage || defaultFrontTexture);
  const backTexture = useLoader(TextureLoader, backImage || defaultBackTexture);

  // Material properties based on effects
  const materialProps = useMemo(() => {
    const baseProps = {
      roughness: 0.1,
      metalness: 0.2,
      reflectivity: 0.8
    };

    if (effects.chrome) {
      baseProps.metalness = Math.min(1, 0.2 + effects.chrome * 0.8);
      baseProps.roughness = Math.max(0, 0.1 - effects.chrome * 0.1);
    }

    if (effects.metallic) {
      baseProps.metalness = Math.min(1, 0.2 + effects.metallic * 0.6);
      baseProps.reflectivity = Math.min(1, 0.8 + effects.metallic * 0.2);
    }

    return baseProps;
  }, [effects]);

  // Animation frame
  useFrame((state) => {
    if (cardRef.current) {
      // Apply rotation
      cardRef.current.rotation.x = (rotation.x * Math.PI) / 180;
      cardRef.current.rotation.y = (rotation.y * Math.PI) / 180;

      // Gentle floating animation
      const time = state.clock.getElapsedTime();
      cardRef.current.position.y = Math.sin(time * 0.5) * 0.02;

      // Holographic effect
      if (effects.holographic && frontMeshRef.current) {
        const material = frontMeshRef.current.material as THREE.MeshPhysicalMaterial;
        if (material.map) {
          material.map.offset.x = Math.sin(time * 2) * 0.01 * effects.holographic;
          material.map.offset.y = Math.cos(time * 1.5) * 0.01 * effects.holographic;
        }
      }
    }
  });

  return (
    <group ref={cardRef} scale={zoom}>
      {/* Front face */}
      <RoundedBox
        ref={frontMeshRef}
        args={[cardDimensions.width, cardDimensions.height, cardDimensions.depth]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, cardDimensions.depth / 2]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          map={frontTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          {...materialProps}
        />
      </RoundedBox>

      {/* Back face */}
      <RoundedBox
        ref={backMeshRef}
        args={[cardDimensions.width, cardDimensions.height, cardDimensions.depth]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, -cardDimensions.depth / 2]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          map={backTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          {...materialProps}
        />
      </RoundedBox>

      {/* Card edges for realistic thickness */}
      <mesh position={[0, cardDimensions.height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[0, -cardDimensions.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[cardDimensions.width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[-cardDimensions.width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Holographic overlay effect */}
      {effects.holographic && effects.holographic > 0 && (
        <RoundedBox
          args={[cardDimensions.width + 0.01, cardDimensions.height + 0.01, 0.001]}
          radius={0.05}
          smoothness={4}
          position={[0, 0, cardDimensions.depth / 2 + 0.001]}
        >
          <meshPhysicalMaterial
            color="#ff00ff"
            transparent
            opacity={effects.holographic * 0.3}
            roughness={0}
            metalness={1}
            envMapIntensity={2}
          />
        </RoundedBox>
      )}
    </group>
  );
};
