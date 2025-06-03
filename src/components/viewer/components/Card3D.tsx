import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { EnvironmentScene } from '../types';
import type { CardData } from '@/types/card';
import { ParticleSystem } from './ParticleSystem';

interface Card3DProps {
  scene: EnvironmentScene;
  card?: CardData;
  effectIntensity?: number[];
  selectedEffect?: any;
  autoRotate?: boolean;
  stationaryBackground?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  scene,
  card,
  effectIntensity,
  selectedEffect,
  autoRotate = true,
  stationaryBackground = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [cardTexture, setCardTexture] = React.useState<THREE.Texture | null>(null);
  
  // Physics state for enhanced movement in stationary mode
  const velocity = useRef(new THREE.Vector3());
  const acceleration = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3(0, 0, 0));
  const angularVelocity = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!groupRef.current) return;

    if (stationaryBackground) {
      // Enhanced physics-based movement in stationary mode with reduced movement
      const time = state.clock.getElapsedTime();
      
      // Apply subtle forces for floating effect - reduced intensity
      acceleration.current.set(
        Math.sin(time * 0.5) * 0.0005, // Reduced from 0.001
        Math.cos(time * 0.3) * 0.0005, // Reduced from 0.001
        Math.sin(time * 0.7) * 0.00025 // Reduced from 0.0005
      );
      
      // Add some randomness for more organic movement - reduced intensity
      acceleration.current.x += (Math.random() - 0.5) * 0.0001; // Reduced from 0.0002
      acceleration.current.y += (Math.random() - 0.5) * 0.0001; // Reduced from 0.0002
      acceleration.current.z += (Math.random() - 0.5) * 0.00005; // Reduced from 0.0001
      
      // Update velocity with acceleration and increased damping
      velocity.current.add(acceleration.current);
      velocity.current.multiplyScalar(0.95); // Increased damping from 0.98
      
      // Update position
      position.current.add(velocity.current);
      
      // Tighter boundary constraints to keep card more centered
      const boundary = 1.5; // Reduced from 3
      if (Math.abs(position.current.x) > boundary) {
        position.current.x = Math.sign(position.current.x) * boundary;
        velocity.current.x *= -0.5;
      }
      if (Math.abs(position.current.y) > boundary) {
        position.current.y = Math.sign(position.current.y) * boundary;
        velocity.current.y *= -0.5;
      }
      if (Math.abs(position.current.z) > boundary * 0.3) { // Even tighter Z constraint
        position.current.z = Math.sign(position.current.z) * boundary * 0.3;
        velocity.current.z *= -0.5;
      }
      
      // Apply physics-based rotation - slightly reduced
      angularVelocity.current.set(
        Math.sin(time * 0.4) * 0.0015, // Reduced from 0.002
        Math.cos(time * 0.6) * 0.002, // Reduced from 0.003
        Math.sin(time * 0.8) * 0.0008 // Reduced from 0.001
      );
      
      // Apply transformations
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.x += angularVelocity.current.x;
      groupRef.current.rotation.y += angularVelocity.current.y;
      groupRef.current.rotation.z += angularVelocity.current.z;
      
    } else if (autoRotate && meshRef.current) {
      // Standard auto-rotation for non-stationary mode
      meshRef.current.rotation.y += 0.003;
    }
  });

  // Load card texture
  useEffect(() => {
    if (card?.image_url) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        card.image_url,
        (texture) => {
          setCardTexture(texture);
        },
        undefined,
        (error) => {
          console.log('Failed to load card image:', error);
          setCardTexture(null);
        }
      );
    } else {
      setCardTexture(null);
    }
  }, [card?.image_url]);

  // Create material with visual effects
  const createMaterial = () => {
    const intensity = (effectIntensity?.[0] || 50) / 100;
    
    let material;
    
    if (cardTexture) {
      material = new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.1,
        metalness: 0.05,
        envMapIntensity: 1.2,
      });
    } else {
      // Fallback material when no image
      material = new THREE.MeshStandardMaterial({
        color: '#e5e7eb',
        roughness: 0.3,
        metalness: 0.1,
      });
    }

    // Apply visual effects based on selected effect
    if (selectedEffect && selectedEffect.id) {
      switch (selectedEffect.id) {
        case 'holographic':
          material.roughness = 0.05;
          material.metalness = 0.8;
          material.envMapIntensity = 2 + intensity;
          if (!cardTexture) {
            material.color = new THREE.Color().setHSL(0.5 + intensity * 0.3, 0.8, 0.9);
          }
          break;
        case 'foilspray':
          material.roughness = 0.02;
          material.metalness = 0.9;
          material.envMapIntensity = 1.5 + intensity;
          break;
        case 'chrome':
          material.roughness = 0.01;
          material.metalness = 0.95;
          material.envMapIntensity = 2.5 + intensity;
          if (!cardTexture) {
            material.color = new THREE.Color(0.9 + intensity * 0.1, 0.9 + intensity * 0.1, 0.9 + intensity * 0.1);
          }
          break;
        default:
          // Keep default material properties
          break;
      }
    }

    return material;
  };
  
  return (
    <group ref={groupRef}>
      {/* Particle system for physics effects in stationary mode */}
      {stationaryBackground && (
        <ParticleSystem 
          cardPosition={position.current} 
          intensity={(effectIntensity?.[0] || 50) / 100} 
        />
      )}
      
      {/* Main card mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[3, 4.2, 0.05]} />
        <primitive object={createMaterial()} />
      </mesh>
      
      {/* Card title text */}
      {card?.title && (
        <Text
          position={[0, -2.5, 0.1]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {card.title}
        </Text>
      )}
      
      {/* Card rarity indicator */}
      {card?.rarity && (
        <Text
          position={[0, -3, 0.1]}
          fontSize={0.2}
          color={
            card.rarity === 'legendary' ? '#FFD700' :
            card.rarity === 'epic' ? '#9F7AEA' :
            card.rarity === 'rare' ? '#4299E1' :
            card.rarity === 'uncommon' ? '#48BB78' :
            '#CBD5E0'
          }
          anchorX="center"
          anchorY="middle"
        >
          {card.rarity.toUpperCase()}
        </Text>
      )}
    </group>
  );
};
