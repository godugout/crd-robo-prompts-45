
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
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
  
  // Create a simple environment map instead of loading external files
  const envMap = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    // Create a simple procedural environment map
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#4a9eff');
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    
    const cubeTexture = new THREE.CubeTexture();
    const canvasTexture = new THREE.CanvasTexture(canvas);
    
    // Use the same texture for all 6 faces
    cubeTexture.images = [
      canvas, canvas, canvas, canvas, canvas, canvas
    ];
    cubeTexture.needsUpdate = true;
    
    return cubeTexture;
  }, []);
  
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
