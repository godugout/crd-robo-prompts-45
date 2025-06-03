import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import * as THREE from 'three';
import type { EnvironmentScene } from './types';
import type { CardData } from '@/types/card';

interface Enhanced3DEnvironmentProps {
  scene: EnvironmentScene;
  card?: CardData;
  children?: React.ReactNode;
  allowRotation?: boolean;
  effectIntensity?: number[];
  selectedEffect?: any;
  autoRotate?: boolean;
  stationaryBackground?: boolean;
}

// Photo background URLs for each scene type
const SCENE_PHOTOS = {
  studio: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1920&h=1080&fit=crop',
  gallery: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop',
  stadium: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1920&h=1080&fit=crop',
  twilight: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  quarry: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
  coastline: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop',
  hillside: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
  milkyway: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop',
  esplanade: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop',
  neonclub: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop',
  industrial: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop'
};

const EnvironmentBackground: React.FC<{ scene: EnvironmentScene; stationary?: boolean }> = ({ scene, stationary = false }) => {
  const { scene: threeScene, camera } = useThree();
  const backgroundRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const photoUrl = SCENE_PHOTOS[scene.id as keyof typeof SCENE_PHOTOS];
    
    if (photoUrl && stationary) {
      // Create a large sphere for stationary background
      textureLoader.load(
        photoUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          
          // Create background sphere
          const geometry = new THREE.SphereGeometry(50, 32, 16);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
          });
          
          if (backgroundRef.current) {
            threeScene.remove(backgroundRef.current);
          }
          
          const backgroundSphere = new THREE.Mesh(geometry, material);
          backgroundRef.current = backgroundSphere;
          threeScene.add(backgroundSphere);
          
          // Also set as environment for reflections
          threeScene.environment = texture;
          threeScene.background = null;
        },
        undefined,
        () => {
          // Fallback to simple color
          threeScene.background = new THREE.Color(scene.lighting.color);
        }
      );
    } else if (photoUrl) {
      // Standard background that moves with camera
      textureLoader.load(
        photoUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          threeScene.background = texture;
          threeScene.environment = texture;
        },
        undefined,
        () => {
          // Fallback to simple color
          threeScene.background = new THREE.Color(scene.lighting.color);
        }
      );
    } else {
      threeScene.background = new THREE.Color(scene.lighting.color);
    }
    
    return () => {
      if (backgroundRef.current) {
        threeScene.remove(backgroundRef.current);
      }
      if (threeScene.background && threeScene.background instanceof THREE.Texture) {
        threeScene.background.dispose();
      }
    };
  }, [scene, threeScene, stationary]);
  
  return null;
};

// Particle system for physics effects
const ParticleSystem: React.FC<{ cardPosition: THREE.Vector3; intensity: number }> = ({ cardPosition, intensity }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particlePositions = useRef<Float32Array>();
  const particleVelocities = useRef<Float32Array>();
  const particleLifetimes = useRef<Float32Array>();

  useEffect(() => {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);

    // Initialize particles around the card
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = cardPosition.x + (Math.random() - 0.5) * 6;
      positions[i3 + 1] = cardPosition.y + (Math.random() - 0.5) * 6;
      positions[i3 + 2] = cardPosition.z + (Math.random() - 0.5) * 6;
      
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      lifetimes[i] = Math.random() * 100;
    }

    particlePositions.current = positions;
    particleVelocities.current = velocities;
    particleLifetimes.current = lifetimes;
  }, [cardPosition]);

  useFrame(() => {
    if (!particlesRef.current || !particlePositions.current || !particleVelocities.current || !particleLifetimes.current) return;

    const positions = particlePositions.current;
    const velocities = particleVelocities.current;
    const lifetimes = particleLifetimes.current;

    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Update particle positions with physics
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
      
      // Apply gravity
      velocities[i3 + 1] -= 0.0005;
      
      // Apply air resistance
      velocities[i3] *= 0.998;
      velocities[i3 + 1] *= 0.998;
      velocities[i3 + 2] *= 0.998;
      
      // Update lifetime
      lifetimes[i] -= 1;
      
      // Reset particle when it dies
      if (lifetimes[i] <= 0) {
        positions[i3] = cardPosition.x + (Math.random() - 0.5) * 6;
        positions[i3 + 1] = cardPosition.y + (Math.random() - 0.5) * 6;
        positions[i3 + 2] = cardPosition.z + (Math.random() - 0.5) * 6;
        
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        
        lifetimes[i] = Math.random() * 100;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particlePositions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6 * intensity}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Card3D: React.FC<{ 
  scene: EnvironmentScene; 
  card?: CardData; 
  effectIntensity?: number[];
  selectedEffect?: any;
  autoRotate?: boolean;
  stationaryBackground?: boolean;
}> = ({ scene, card, effectIntensity, selectedEffect, autoRotate = true, stationaryBackground = false }) => {
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
      // Enhanced physics-based movement in stationary mode
      const time = state.clock.getElapsedTime();
      
      // Apply subtle forces for floating effect
      acceleration.current.set(
        Math.sin(time * 0.5) * 0.001,
        Math.cos(time * 0.3) * 0.001,
        Math.sin(time * 0.7) * 0.0005
      );
      
      // Add some randomness for more organic movement
      acceleration.current.x += (Math.random() - 0.5) * 0.0002;
      acceleration.current.y += (Math.random() - 0.5) * 0.0002;
      acceleration.current.z += (Math.random() - 0.5) * 0.0001;
      
      // Update velocity with acceleration and damping
      velocity.current.add(acceleration.current);
      velocity.current.multiplyScalar(0.98); // Damping
      
      // Update position
      position.current.add(velocity.current);
      
      // Boundary constraints to keep card visible
      const boundary = 3;
      if (Math.abs(position.current.x) > boundary) {
        position.current.x = Math.sign(position.current.x) * boundary;
        velocity.current.x *= -0.5;
      }
      if (Math.abs(position.current.y) > boundary) {
        position.current.y = Math.sign(position.current.y) * boundary;
        velocity.current.y *= -0.5;
      }
      if (Math.abs(position.current.z) > boundary * 0.5) {
        position.current.z = Math.sign(position.current.z) * boundary * 0.5;
        velocity.current.z *= -0.5;
      }
      
      // Apply physics-based rotation
      angularVelocity.current.set(
        Math.sin(time * 0.4) * 0.002,
        Math.cos(time * 0.6) * 0.003,
        Math.sin(time * 0.8) * 0.001
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

const SceneLighting: React.FC<{ scene: EnvironmentScene }> = ({ scene }) => {
  return (
    <>
      <ambientLight intensity={scene.lighting.ambient * 1.2} color={scene.lighting.color} />
      <directionalLight 
        intensity={scene.lighting.directional * 0.8}
        position={[8, 8, 5]}
        color={scene.lighting.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        intensity={0.4}
        position={[-5, 3, -5]}
        color={scene.lighting.color}
      />
      <pointLight 
        intensity={0.3}
        position={[5, -3, 5]}
        color="#ffffff"
      />
    </>
  );
};

export const Enhanced3DEnvironment: React.FC<Enhanced3DEnvironmentProps> = ({
  scene,
  card,
  children,
  allowRotation = true,
  effectIntensity,
  selectedEffect,
  autoRotate = true,
  stationaryBackground = false
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <EnvironmentBackground scene={scene} stationary={stationaryBackground} />
        <SceneLighting scene={scene} />
        <Card3D 
          scene={scene} 
          card={card} 
          effectIntensity={effectIntensity}
          selectedEffect={selectedEffect}
          autoRotate={autoRotate}
          stationaryBackground={stationaryBackground}
        />
        {allowRotation && (
          <OrbitControls 
            enablePan={stationaryBackground}
            enableZoom={true}
            minDistance={stationaryBackground ? 2 : 4}
            maxDistance={stationaryBackground ? 25 : 15}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            panSpeed={stationaryBackground ? 2 : 0}
            rotateSpeed={stationaryBackground ? 1.5 : 1}
          />
        )}
        <fog attach="fog" args={[scene.lighting.color, 15, 25]} />
      </Canvas>
    </div>
  );
};
