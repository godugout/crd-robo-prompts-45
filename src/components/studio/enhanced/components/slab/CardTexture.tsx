
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

interface CardTextureProps {
  imageUrl: string;
}

export const CardTexture: React.FC<CardTextureProps> = ({ imageUrl }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  
  const material = useMemo(() => {
    // Configure texture for optimal quality
    texture.flipY = false;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    
    return new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.1,
      metalness: 0.02,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.5,
      side: THREE.FrontSide
    });
  }, [texture]);

  return <primitive object={material} attach="material" />;
};
