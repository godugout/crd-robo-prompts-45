
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DynamicLightingProps {
  environment: 'cosmic' | 'studio' | 'bedroom' | 'mathematical';
  deviceOrientation: { alpha: number; beta: number; gamma: number };
  cardPosition: [number, number, number];
}

export const DynamicLighting: React.FC<DynamicLightingProps> = ({
  environment,
  deviceOrientation,
  cardPosition
}) => {
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (!mainLightRef.current || !fillLightRef.current || !rimLightRef.current) return;

    // Convert device orientation to light positions
    const { alpha, beta, gamma } = deviceOrientation;
    
    // Main light follows device tilt
    const mainLightX = Math.sin((alpha || 0) * Math.PI / 180) * 5;
    const mainLightY = Math.cos((beta || 0) * Math.PI / 180) * 5 + 3;
    const mainLightZ = Math.sin((gamma || 0) * Math.PI / 180) * 3 + 5;
    
    mainLightRef.current.position.set(mainLightX, mainLightY, mainLightZ);
    mainLightRef.current.target.position.set(...cardPosition);
    
    // Fill light provides soft ambient lighting
    fillLightRef.current.position.set(-mainLightX * 0.5, mainLightY * 0.3, mainLightZ * 0.7);
    
    // Rim light for edge definition
    rimLightRef.current.position.set(
      cardPosition[0] + Math.cos(state.clock.elapsedTime * 0.5) * 3,
      cardPosition[1] + 2,
      cardPosition[2] + Math.sin(state.clock.elapsedTime * 0.5) * 3
    );
  });

  // Environment-specific lighting setups
  const getLightingConfig = () => {
    switch (environment) {
      case 'cosmic':
        return {
          ambient: { intensity: 0.1, color: '#1a1a3e' },
          main: { intensity: 1.2, color: '#4a9eff' },
          fill: { intensity: 0.3, color: '#ff6b9d' },
          rim: { intensity: 0.5, color: '#ffd700' }
        };
      
      case 'studio':
        return {
          ambient: { intensity: 0.4, color: '#ffffff' },
          main: { intensity: 1.0, color: '#ffffff' },
          fill: { intensity: 0.6, color: '#ffffff' },
          rim: { intensity: 0.8, color: '#ffffff' }
        };
      
      case 'bedroom':
        return {
          ambient: { intensity: 0.3, color: '#ffb366' },
          main: { intensity: 0.8, color: '#ffcc80' },
          fill: { intensity: 0.4, color: '#ff8a65' },
          rim: { intensity: 0.6, color: '#ffa726' }
        };
      
      case 'mathematical':
        return {
          ambient: { intensity: 0.2, color: '#00ffff' },
          main: { intensity: 1.1, color: '#00ff00' },
          fill: { intensity: 0.3, color: '#ff00ff' },
          rim: { intensity: 0.7, color: '#ffff00' }
        };
      
      default:
        return {
          ambient: { intensity: 0.4, color: '#ffffff' },
          main: { intensity: 1.0, color: '#ffffff' },
          fill: { intensity: 0.5, color: '#ffffff' },
          rim: { intensity: 0.6, color: '#ffffff' }
        };
    }
  };

  const config = getLightingConfig();

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={config.ambient.intensity} color={config.ambient.color} />
      
      {/* Main directional light */}
      <directionalLight
        ref={mainLightRef}
        intensity={config.main.intensity}
        color={config.main.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light */}
      <directionalLight
        ref={fillLightRef}
        intensity={config.fill.intensity}
        color={config.fill.color}
      />
      
      {/* Rim light */}
      <pointLight
        ref={rimLightRef}
        intensity={config.rim.intensity}
        color={config.rim.color}
        distance={10}
        decay={2}
      />
    </>
  );
};
