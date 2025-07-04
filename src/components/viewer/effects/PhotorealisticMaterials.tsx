import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { 
  HolographicFoilShader, 
  PrismaticRefractorShader, 
  GalaxyFoilShader,
  SecretRareShader 
} from './PhotorealisticShaders';

interface PhotorealisticMaterialProps {
  texture: THREE.Texture | null;
  materialType: 'holographic' | 'refractor' | 'galaxy' | 'secret-rare' | 'standard';
  intensity: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  lightDirection?: THREE.Vector3;
  parameters?: Record<string, number>;
}

export const PhotorealisticMaterial: React.FC<PhotorealisticMaterialProps> = ({
  texture,
  materialType,
  intensity,
  quality,
  lightDirection = new THREE.Vector3(1, 1, 1),
  parameters = {}
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Create high-quality environment map
  const envMap = useMemo(() => {
    if (quality === 'low') return null;
    
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    
    // Generate procedural HDR environment for realistic reflections
    const size = quality === 'ultra' ? 512 : quality === 'high' ? 256 : 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create gradient sky environment
      const gradient = ctx.createLinearGradient(0, 0, 0, size);
      gradient.addColorStop(0, '#87CEEB'); // Sky blue
      gradient.addColorStop(0.7, '#4682B4'); // Steel blue
      gradient.addColorStop(1, '#2F4F4F'); // Dark slate gray
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Add procedural clouds for realistic reflections
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size * 0.6;
        const radius = Math.random() * 30 + 10;
        
        const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = cloudGradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
    }
    
    const cubeTexture = new THREE.CubeTexture();
    cubeTexture.images = Array(6).fill(canvas);
    cubeTexture.needsUpdate = true;
    cubeTexture.format = THREE.RGBAFormat;
    cubeTexture.generateMipmaps = quality === 'ultra';
    
    return cubeTexture;
  }, [quality]);
  
  // Generate normal map for surface detail
  const normalMap = useMemo(() => {
    if (quality === 'low' || materialType === 'standard') return null;
    
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      
      // Generate surface normal variations for material texture
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          
          // Different patterns based on material type
          let nx = 0.5, ny = 0.5, nz = 1.0;
          
          switch (materialType) {
            case 'holographic':
              // Interference pattern bumps
              nx = Math.sin(x * 0.3) * Math.sin(y * 0.2) * 0.1 + 0.5;
              ny = Math.cos(x * 0.2) * Math.cos(y * 0.3) * 0.1 + 0.5;
              break;
              
            case 'galaxy':
              // Swirl pattern
              const centerX = size / 2;
              const centerY = size / 2;
              const angle = Math.atan2(y - centerY, x - centerX);
              const radius = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
              nx = Math.sin(angle * 3 + radius * 0.1) * 0.15 + 0.5;
              ny = Math.cos(angle * 3 + radius * 0.1) * 0.15 + 0.5;
              break;
              
            case 'secret-rare':
              // Embossed texture
              const emboss = Math.sin(x * 0.5) * Math.sin(y * 0.3);
              nx = emboss * 0.2 + 0.5;
              ny = emboss * 0.15 + 0.5;
              nz = 0.8 + emboss * 0.2;
              break;
          }
          
          data[i] = nx * 255;     // Red = X normal
          data[i + 1] = ny * 255; // Green = Y normal  
          data[i + 2] = nz * 255; // Blue = Z normal
          data[i + 3] = 255;      // Alpha
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    const normalTexture = new THREE.CanvasTexture(canvas);
    normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.format = THREE.RGBAFormat;
    
    return normalTexture;
  }, [materialType, quality]);
  
  // Choose shader based on material type
  const shader = useMemo(() => {
    if (quality === 'low' || materialType === 'standard') return null;
    
    switch (materialType) {
      case 'holographic':
        return HolographicFoilShader;
      case 'refractor':
        return PrismaticRefractorShader;
      case 'galaxy':
        return GalaxyFoilShader;
      case 'secret-rare':
        return SecretRareShader;
      default:
        return null;
    }
  }, [materialType, quality]);
  
  // Update uniforms each frame
  useFrame(({ clock }) => {
    if (materialRef.current && shader) {
      const material = materialRef.current;
      
      // Update time for animations
      material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Update intensity
      if (material.uniforms.uIntensity) {
        material.uniforms.uIntensity.value = intensity;
      }
      
      // Update texture
      if (texture && material.uniforms.uTexture) {
        material.uniforms.uTexture.value = texture;
      }
      
      // Update environment map for reflections
      if (envMap && material.uniforms.uEnvMap) {
        material.uniforms.uEnvMap.value = envMap;
      }
      
      // Update normal map
      if (normalMap && material.uniforms.uNormalMap) {
        material.uniforms.uNormalMap.value = normalMap;
      }
      
      // Update light direction
      if (material.uniforms.uLightDirection) {
        material.uniforms.uLightDirection.value = lightDirection;
      }
      
      // Update custom parameters
      Object.entries(parameters).forEach(([key, value]) => {
        const uniformKey = `u${key.charAt(0).toUpperCase() + key.slice(1)}`;
        if (material.uniforms[uniformKey]) {
          material.uniforms[uniformKey].value = value;
        }
      });
    }
  });
  
  // Fallback to enhanced physical material for low quality or standard type
  if (!shader || quality === 'low' || materialType === 'standard') {
    const baseProps: any = {
      map: texture,
      transparent: true,
      opacity: 0.95
    };
    
    if (quality !== 'low') {
      baseProps.envMap = envMap;
      baseProps.normalMap = normalMap;
      baseProps.metalness = materialType === 'standard' ? 0.1 : 0.8;
      baseProps.roughness = materialType === 'standard' ? 0.8 : 0.2;
      baseProps.envMapIntensity = intensity;
    }
    
    return <meshPhysicalMaterial {...baseProps} />;
  }
  
  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={shader.vertexShader}
      fragmentShader={shader.fragmentShader}
      uniforms={{
        ...shader.uniforms,
        uTexture: { value: texture },
        uEnvMap: { value: envMap },
        uNormalMap: { value: normalMap },
        uLightDirection: { value: lightDirection },
        uIntensity: { value: intensity }
      }}
      transparent
      side={THREE.DoubleSide}
      attach="material"
    />
  );
};