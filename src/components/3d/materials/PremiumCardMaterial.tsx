
import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, CubeTextureLoader } from 'three';
import * as THREE from 'three';
import { HolographicShader } from '../shaders/HolographicShader';
import { MetallicShader } from '../shaders/MetallicShader';
import { EnergyGlowShader } from '../shaders/EnergyGlowShader';

interface PremiumCardMaterialProps {
  texture: THREE.Texture | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

export const PremiumCardMaterial: React.FC<PremiumCardMaterialProps> = ({
  texture,
  rarity,
  quality
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Load environment map for metallic reflections
  const envMap = useLoader(CubeTextureLoader, [
    '/textures/env/px.jpg', '/textures/env/nx.jpg',
    '/textures/env/py.jpg', '/textures/env/ny.jpg',
    '/textures/env/pz.jpg', '/textures/env/nz.jpg'
  ]);
  
  // Choose shader based on rarity and quality
  const shader = React.useMemo(() => {
    if (quality === 'low') {
      return null; // Use standard material for low quality
    }
    
    switch (rarity) {
      case 'legendary':
        return EnergyGlowShader;
      case 'epic':
        return HolographicShader;
      case 'rare':
        return MetallicShader;
      default:
        return null;
    }
  }, [rarity, quality]);
  
  // Update uniforms
  useFrame(({ clock }) => {
    if (materialRef.current && shader) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      
      if (texture && materialRef.current.uniforms.uTexture) {
        materialRef.current.uniforms.uTexture.value = texture;
      }
      
      if (shader === MetallicShader && materialRef.current.uniforms.uEnvMap) {
        materialRef.current.uniforms.uEnvMap.value = envMap;
      }
    }
  });
  
  useEffect(() => {
    if (materialRef.current && texture) {
      if (materialRef.current.uniforms.uTexture) {
        materialRef.current.uniforms.uTexture.value = texture;
      }
    }
  }, [texture]);
  
  // Fallback to standard material for low quality or common cards
  if (!shader || quality === 'low') {
    return (
      <meshPhysicalMaterial
        map={texture}
        metalness={rarity === 'rare' ? 0.3 : 0.1}
        roughness={0.4}
        transparent
        opacity={0.95}
      />
    );
  }
  
  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={shader.vertexShader}
      fragmentShader={shader.fragmentShader}
      uniforms={shader.uniforms}
      transparent
      attach="material"
    />
  );
};
