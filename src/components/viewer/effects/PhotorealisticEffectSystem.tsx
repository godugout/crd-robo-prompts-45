import React, { useMemo, useRef, useEffect } from 'react';
import { PhotorealisticMaterial } from './PhotorealisticMaterials';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PhotorealisticEffectSystemProps {
  texture: THREE.Texture | null;
  effectValues: Record<string, any>;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  mousePosition: { x: number; y: number };
  cardMeshRef?: React.RefObject<THREE.Mesh>;
}

export const PhotorealisticEffectSystem: React.FC<PhotorealisticEffectSystemProps> = ({
  texture,
  effectValues,
  quality,
  mousePosition,
  cardMeshRef
}) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  
  // Determine primary material type based on effect intensities
  const primaryMaterial = useMemo(() => {
    const holographicIntensity = effectValues?.holographic?.intensity || 0;
    const refractorIntensity = effectValues?.refractor?.intensity || 0;
    const galaxyIntensity = effectValues?.galaxy?.intensity || 0;
    const secretRareIntensity = effectValues?.secretrare?.intensity || 0;
    
    const maxIntensity = Math.max(
      holographicIntensity,
      refractorIntensity,
      galaxyIntensity,
      secretRareIntensity
    );
    
    if (maxIntensity < 10) return { type: 'standard', intensity: 0 };
    
    if (holographicIntensity === maxIntensity) {
      return { type: 'holographic', intensity: holographicIntensity / 100 };
    } else if (refractorIntensity === maxIntensity) {
      return { type: 'refractor', intensity: refractorIntensity / 100 };
    } else if (galaxyIntensity === maxIntensity) {
      return { type: 'galaxy', intensity: galaxyIntensity / 100 };
    } else {
      return { type: 'secret-rare', intensity: secretRareIntensity / 100 };
    }
  }, [effectValues]);
  
  // Dynamic lighting based on material type and mouse position
  const lightDirection = useMemo(() => {
    // Convert mouse position to 3D light direction
    const x = (mousePosition.x - 0.5) * 2;
    const y = (mousePosition.y - 0.5) * 2;
    const z = 1;
    
    return new THREE.Vector3(x, y, z).normalize();
  }, [mousePosition]);
  
  // Material-specific parameters
  const materialParameters = useMemo(() => {
    const params: Record<string, number> = {};
    
    switch (primaryMaterial.type) {
      case 'holographic':
        params.rainbowSpread = (effectValues?.holographic?.rainbowSpread || 100) / 100 * 3;
        params.interferenceScale = (effectValues?.holographic?.interferenceScale || 100) / 100 * 30;
        params.warpStrength = (effectValues?.holographic?.warpStrength || 50) / 100;
        break;
        
      case 'refractor':
        params.dispersion = (effectValues?.refractor?.dispersion || 50) / 100 * 0.1;
        params.refractiveIndex = 1.3 + (effectValues?.refractor?.refractiveIndex || 50) / 100 * 0.4;
        break;
        
      case 'galaxy':
        params.colorA = effectValues?.galaxy?.colorA || 0.8;
        params.colorB = effectValues?.galaxy?.colorB || 0.6;
        params.colorC = effectValues?.galaxy?.colorC || 0.4;
        break;
        
      case 'secret-rare':
        params.layer1Intensity = (effectValues?.secretrare?.layer1 || 80) / 100;
        params.layer2Intensity = (effectValues?.secretrare?.layer2 || 60) / 100;
        params.embossStrength = (effectValues?.secretrare?.emboss || 70) / 100;
        break;
    }
    
    return params;
  }, [primaryMaterial.type, effectValues]);
  
  // Update lighting dynamically
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(lightDirection.clone().multiplyScalar(5));
      lightRef.current.target.position.set(0, 0, 0);
      
      // Adjust light intensity based on material type
      const baseIntensity = primaryMaterial.intensity * 2;
      lightRef.current.intensity = Math.max(0.3, baseIntensity);
      
      // Color temperature based on material
      switch (primaryMaterial.type) {
        case 'holographic':
          lightRef.current.color.setHSL(0.6, 0.3, 1); // Cool white
          break;
        case 'galaxy':
          lightRef.current.color.setHSL(0.8, 0.4, 1); // Purple-ish
          break;
        case 'secret-rare':
          lightRef.current.color.setHSL(0.1, 0.3, 1); // Warm white
          break;
        default:
          lightRef.current.color.setHSL(0, 0, 1); // Pure white
      }
    }
    
    if (ambientRef.current) {
      // Ambient light for overall illumination
      ambientRef.current.intensity = 0.4 + primaryMaterial.intensity * 0.2;
    }
  });
  
  return (
    <>
      {/* Enhanced Lighting Setup */}
      <directionalLight
        ref={lightRef}
        intensity={1}
        position={[lightDirection.x * 5, lightDirection.y * 5, lightDirection.z * 5]}
        castShadow={quality === 'ultra'}
        shadow-mapSize-width={quality === 'ultra' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'ultra' ? 2048 : 1024}
      />
      
      <ambientLight
        ref={ambientRef}
        intensity={0.4}
        color="#ffffff"
      />
      
      {/* Point lights for additional material highlights */}
      {primaryMaterial.intensity > 0.5 && quality !== 'low' && (
        <>
          <pointLight
            position={[2, 2, 2]}
            intensity={primaryMaterial.intensity * 0.5}
            color={primaryMaterial.type === 'galaxy' ? '#8A2BE2' : '#ffffff'}
            distance={10}
          />
          
          <pointLight
            position={[-2, 1, 2]}
            intensity={primaryMaterial.intensity * 0.3}
            color={primaryMaterial.type === 'holographic' ? '#00FFFF' : '#ffffff'}
            distance={8}
          />
        </>
      )}
      
      {/* Photorealistic Material */}
      <PhotorealisticMaterial
        texture={texture}
        materialType={primaryMaterial.type as any}
        intensity={primaryMaterial.intensity}
        quality={quality}
        lightDirection={lightDirection}
        parameters={materialParameters}
      />
    </>
  );
};