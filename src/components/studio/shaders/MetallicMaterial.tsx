
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MetallicMaterialProps {
  metalness: number;
  roughness: number;
  color?: string;
  envMap?: THREE.CubeTexture;
}

export const MetallicMaterial: React.FC<MetallicMaterialProps> = ({ 
  metalness, 
  roughness, 
  color = '#ffffff',
  envMap 
}) => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: metalness / 100,
      roughness: roughness / 100,
      envMap: envMap || null,
      envMapIntensity: 1.5
    });
  }, [metalness, roughness, color, envMap]);
  
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.metalness = metalness / 100;
      materialRef.current.roughness = roughness / 100;
    }
  });
  
  return <primitive ref={materialRef} object={material} />;
};
