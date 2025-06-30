
import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface CardMaterialSystemProps {
  card: any;
  environment: 'cosmic' | 'studio' | 'bedroom' | 'mathematical';
  deviceOrientation: { alpha: number; beta: number; gamma: number };
}

export const CardMaterialSystem: React.FC<CardMaterialSystemProps> = ({
  card,
  environment,
  deviceOrientation
}) => {
  // Load textures
  const frontTexture = useLoader(TextureLoader, card?.image_url || '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png');
  const backTexture = useLoader(TextureLoader, '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png');

  // Configure textures
  useMemo(() => {
    const textures = [frontTexture, backTexture];
    textures.forEach(texture => {
      if (texture && !Array.isArray(texture)) {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.flipY = true;
      }
    });
  }, [frontTexture, backTexture]);

  // Environment-specific material properties
  const getMaterialProps = () => {
    const baseOrientation = Math.abs(deviceOrientation.beta) / 90;
    
    switch (environment) {
      case 'cosmic':
        return {
          roughness: 0.1,
          metalness: 0.8,
          reflectivity: 0.9,
          envMapIntensity: 2.0,
          emissive: new THREE.Color(0x112244),
          emissiveIntensity: 0.1 + baseOrientation * 0.2
        };
      
      case 'studio':
        return {
          roughness: 0.3,
          metalness: 0.1,
          reflectivity: 0.8,
          envMapIntensity: 1.0,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0
        };
      
      case 'bedroom':
        return {
          roughness: 0.4,
          metalness: 0.2,
          reflectivity: 0.6,
          envMapIntensity: 0.8,
          emissive: new THREE.Color(0x332211),
          emissiveIntensity: 0.05
        };
      
      case 'mathematical':
        return {
          roughness: 0.0,
          metalness: 0.9,
          reflectivity: 1.0,
          envMapIntensity: 3.0,
          emissive: new THREE.Color(0x001122),
          emissiveIntensity: 0.2 + Math.sin(Date.now() * 0.001) * 0.1
        };
      
      default:
        return {
          roughness: 0.2,
          metalness: 0.3,
          reflectivity: 0.7,
          envMapIntensity: 1.0,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0
        };
    }
  };

  const materialProps = getMaterialProps();

  return (
    <>
      {/* Front face */}
      <meshPhysicalMaterial
        attach="material-0"
        map={frontTexture}
        transparent
        opacity={0.95}
        {...materialProps}
      />
      
      {/* Back face */}
      <meshPhysicalMaterial
        attach="material-1"
        map={backTexture}
        transparent
        opacity={0.95}
        {...materialProps}
      />
      
      {/* Other faces use standard material */}
      {Array.from({ length: 4 }).map((_, index) => (
        <meshStandardMaterial
          key={index}
          attach={`material-${index + 2}`}
          color="#f0f0f0"
          roughness={0.8}
          metalness={0.1}
        />
      ))}
    </>
  );
};
