
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Text } from '@react-three/drei';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';
import { HolographicMaterial } from '../shaders/HolographicMaterial';
import { MetallicMaterial } from '../shaders/MetallicMaterial';
import { ParticleSystem } from '../effects/ParticleSystem';
import { GlowEffect } from '../effects/GlowEffect';
import * as THREE from 'three';

interface Card3DProps {
  card: any;
  material: any;
  lighting: any;
  animation: any;
  effectLayers: any[];
}

const Card3D: React.FC<Card3DProps> = ({ card, material, lighting, animation, effectLayers }) => {
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
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Animation controls
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

const Scene: React.FC = () => {
  const { state } = useAdvancedStudio();
  const { selectedCard, material, lighting, animation, environment, effectLayers } = state;
  
  // Map environment presets
  const getEnvironmentPreset = (preset: string) => {
    const presetMap: Record<string, any> = {
      'studio': 'studio',
      'nature': 'forest',
      'sunset': 'sunset',
      'neon': 'night'
    };
    return presetMap[preset] || 'studio';
  };
  
  // Create realistic lighting colors based on temperature
  const lightColor = new THREE.Color();
  const temp = lighting.colorTemperature;
  if (temp < 3500) {
    lightColor.setRGB(1.0, 0.7, 0.4); // Warm
  } else if (temp < 5000) {
    lightColor.setRGB(1.0, 0.9, 0.8); // Neutral warm
  } else if (temp < 6500) {
    lightColor.setRGB(1.0, 1.0, 1.0); // Neutral
  } else {
    lightColor.setRGB(0.8, 0.9, 1.0); // Cool
  }

  return (
    <>
      {/* Environment */}
      <Environment 
        preset={getEnvironmentPreset(environment.preset)} 
        backgroundIntensity={environment.hdriIntensity}
        environmentIntensity={environment.hdriIntensity}
      />
      
      {/* Lighting setup */}
      <ambientLight 
        intensity={lighting.ambientLight / 100} 
        color={lightColor} 
      />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={lighting.intensity / 100}
        color={lightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Dramatic lighting */}
      {lighting.preset === 'dramatic' && (
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={lighting.shadowIntensity / 50}
          color={lightColor}
          castShadow
        />
      )}
      
      {/* Neon lighting */}
      {lighting.preset === 'neon' && (
        <>
          <pointLight position={[3, 3, 3]} intensity={0.5} color="#ff0080" />
          <pointLight position={[-3, 3, 3]} intensity={0.5} color="#0080ff" />
        </>
      )}
      
      {/* Main card */}
      {selectedCard ? (
        <Card3D 
          card={selectedCard}
          material={material}
          lighting={lighting}
          animation={animation}
          effectLayers={effectLayers}
        />
      ) : (
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Select a card to preview
        </Text>
      )}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
        target={[0, 0, 0]}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
};

export const Professional3DViewer: React.FC = () => {
  const { state } = useAdvancedStudio();
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene />
      </Canvas>
      
      {/* Performance indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded px-3 py-1 text-sm text-white">
          Quality: {state.renderQuality.toUpperCase()}
        </div>
      </div>
      
      {/* Animation status */}
      {state.animation.isPlaying && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-crd-green/20 backdrop-blur-sm rounded px-3 py-1 text-sm text-crd-green border border-crd-green/50 animate-pulse">
            Animation Playing - {state.animation.preset}
          </div>
        </div>
      )}
      
      {/* Effect layers indicator */}
      {state.effectLayers.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-crd-green/20 backdrop-blur-sm rounded px-3 py-1 text-sm text-crd-green border border-crd-green/50">
            {state.effectLayers.filter(l => l.enabled).length} Effects Active
          </div>
        </div>
      )}
    </div>
  );
};
