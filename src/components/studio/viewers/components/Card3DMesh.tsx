
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { HolographicMaterial } from '../../shaders/HolographicMaterial';
import { MetallicMaterial } from '../../shaders/MetallicMaterial';
import { ParticleSystem } from '../../effects/ParticleSystem';
import { GlowEffect } from '../../effects/GlowEffect';
import * as THREE from 'three';

interface Card3DMeshProps {
  card: any;
  material: any;
  animation: any;
  effectLayers: any[];
}

export const Card3DMesh: React.FC<Card3DMeshProps> = ({ 
  card, 
  material, 
  animation, 
  effectLayers 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Load card texture
  useEffect(() => {
    if (card?.image) {
      const loader = new THREE.TextureLoader();
      loader.load(card.image, (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  }, [card?.image]);
  
  // Animation logic
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (animation.preset === 'rotate' && animation.isPlaying) {
      meshRef.current.rotation.y += delta * (animation.speed / 50);
    }
    
    if (animation.preset === 'float' && animation.isPlaying) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2 * (animation.amplitude / 100);
    }
    
    if (animation.preset === 'pulse' && animation.isPlaying) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1 * (animation.amplitude / 100);
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Create material based on preset
  const createMaterial = () => {
    const baseProps = {
      transparent: material.transparency > 0,
      opacity: 1 - (material.transparency / 100),
    };

    switch (material.preset) {
      case 'holographic':
        return (
          <meshStandardMaterial
            {...baseProps}
            map={texture}
            metalness={0.3}
            roughness={0.1}
            emissive={new THREE.Color(0x444444)}
            emissiveIntensity={material.emission / 100}
          />
        );
      case 'metallic':
      case 'chrome':
        return (
          <meshStandardMaterial
            {...baseProps}
            map={texture}
            metalness={material.metalness / 100}
            roughness={material.roughness / 100}
            emissive={material.emission > 0 ? new THREE.Color(0x444444) : new THREE.Color(0x000000)}
            emissiveIntensity={material.emission / 100}
            envMapIntensity={2}
          />
        );
      case 'crystal':
        return (
          <meshPhysicalMaterial
            {...baseProps}
            map={texture}
            metalness={0}
            roughness={0}
            transmission={material.transparency / 100}
            thickness={0.5}
            ior={1.5}
          />
        );
      default:
        return (
          <meshStandardMaterial
            {...baseProps}
            map={texture}
            metalness={material.metalness / 100}
            roughness={material.roughness / 100}
            emissive={material.emission > 0 ? new THREE.Color(0x444444) : new THREE.Color(0x000000)}
            emissiveIntensity={material.emission / 100}
          />
        );
    }
  };

  // Check for active effects
  const glowEffect = effectLayers.find(e => e.type === 'glow' && e.enabled);
  const particleEffect = effectLayers.find(e => e.type === 'particle' && e.enabled);
  const holographicEffect = effectLayers.find(e => e.type === 'holographic' && e.enabled);

  return (
    <group>
      {/* Particle effects */}
      {particleEffect && (
        <ParticleSystem
          count={50}
          intensity={particleEffect.intensity}
          enabled={true}
        />
      )}
      
      {/* Main card with glow effect */}
      <GlowEffect
        intensity={glowEffect?.intensity || 0}
        color="#4ade80"
        enabled={!!glowEffect}
      >
        <mesh ref={meshRef}>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          {createMaterial()}
        </mesh>
      </GlowEffect>
      
      {/* Holographic overlay effect */}
      {holographicEffect && material.preset === 'holographic' && (
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[2.3, 3.3]} />
          <HolographicMaterial intensity={holographicEffect.intensity}>
            <meshBasicMaterial transparent opacity={0.5} />
          </HolographicMaterial>
        </mesh>
      )}
    </group>
  );
};
