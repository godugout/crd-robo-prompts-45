
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import type { CardData } from '@/types/card';
import * as THREE from 'three';

interface Responsive3DCardMeshProps {
  card: CardData;
  rotation: { x: number; y: number };
  zoom: number;
  materialSettings?: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
}

export const Responsive3DCardMesh: React.FC<Responsive3DCardMeshProps> = ({
  card,
  rotation,
  zoom,
  materialSettings = {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  }
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);
  const edgeRefs = useRef<THREE.Mesh[]>([]);
  const { viewport } = useThree();
  
  // Calculate responsive card size based on viewport
  const cardDimensions = useMemo(() => {
    const aspectRatio = 3.5 / 2.5; // Standard card ratio (height/width)
    const maxWidth = viewport.width * 0.6; // 60% of viewport width
    const maxHeight = viewport.height * 0.7; // 70% of viewport height
    
    let width, height;
    
    if (maxWidth * aspectRatio <= maxHeight) {
      width = maxWidth;
      height = maxWidth * aspectRatio;
    } else {
      height = maxHeight;
      width = maxHeight / aspectRatio;
    }
    
    return {
      width: Math.max(2, width), // Minimum size
      height: Math.max(2.8, height),
      depth: 0.05
    };
  }, [viewport.width, viewport.height]);

  // Load textures with fallbacks
  const frontImageUrl = useMemo(() => {
    if (!card?.image_url || typeof card.image_url !== 'string') {
      return '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
    }
    return card.image_url;
  }, [card?.image_url]);

  const backImageUrl = '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png';

  // Load textures
  const frontTexture = useLoader(TextureLoader, frontImageUrl);
  const backTexture = useLoader(TextureLoader, backImageUrl);

  // Animation
  useFrame(() => {
    if (meshRef.current && backMeshRef.current) {
      // Apply rotation
      const rotX = (rotation.x * Math.PI) / 180;
      const rotY = (rotation.y * Math.PI) / 180;
      
      meshRef.current.rotation.x = rotX;
      meshRef.current.rotation.y = rotY;
      
      backMeshRef.current.rotation.x = rotX;
      backMeshRef.current.rotation.y = rotY;
      
      // Update edge meshes
      edgeRefs.current.forEach(edge => {
        if (edge) {
          edge.rotation.x = rotX;
          edge.rotation.y = rotY;
        }
      });
    }
  });

  return (
    <group scale={zoom} position={[0, 0, 0]}>
      {/* Card Front */}
      <mesh
        ref={meshRef}
        position={[0, 0, cardDimensions.depth / 2]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.height]} />
        <meshStandardMaterial
          map={frontTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Card Back */}
      <mesh
        ref={backMeshRef}
        position={[0, 0, -cardDimensions.depth / 2]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.height]} />
        <meshStandardMaterial
          map={backTexture}
          transparent
          opacity={0.95}
          side={THREE.FrontSide}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
        />
      </mesh>

      {/* Card Edges for thickness */}
      {/* Top Edge */}
      <mesh
        ref={el => el && (edgeRefs.current[0] = el)}
        position={[0, cardDimensions.height / 2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Bottom Edge */}
      <mesh
        ref={el => el && (edgeRefs.current[1] = el)}
        position={[0, -cardDimensions.height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[cardDimensions.width, cardDimensions.depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Left Edge */}
      <mesh
        ref={el => el && (edgeRefs.current[2] = el)}
        position={[-cardDimensions.width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Right Edge */}
      <mesh
        ref={el => el && (edgeRefs.current[3] = el)}
        position={[cardDimensions.width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[cardDimensions.depth, cardDimensions.height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};
