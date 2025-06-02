
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

const EnvironmentBackground: React.FC<{ scene: EnvironmentScene }> = ({ scene }) => {
  const { scene: threeScene } = useThree();
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    // Get the photo URL for this scene
    const photoUrl = SCENE_PHOTOS[scene.id as keyof typeof SCENE_PHOTOS];
    
    if (photoUrl) {
      textureLoader.load(
        photoUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          threeScene.background = texture;
          threeScene.environment = texture;
        },
        undefined,
        () => {
          // Fallback to simple color background
          threeScene.background = new THREE.Color(scene.lighting.color);
        }
      );
    } else {
      // Simple color fallback
      threeScene.background = new THREE.Color(scene.lighting.color);
    }
    
    return () => {
      // Cleanup
      if (threeScene.background && threeScene.background instanceof THREE.Texture) {
        threeScene.background.dispose();
      }
    };
  }, [scene, threeScene]);
  
  return null;
};

const Card3D: React.FC<{ 
  scene: EnvironmentScene; 
  card?: CardData; 
  effectIntensity?: number[];
  selectedEffect?: any;
}> = ({ scene, card, effectIntensity, selectedEffect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [cardTexture, setCardTexture] = React.useState<THREE.Texture | null>(null);
  
  useFrame(() => {
    if (meshRef.current) {
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

  // Create material with effects
  const createCardMaterial = () => {
    const intensity = (effectIntensity?.[0] || 50) / 100;
    
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0.05,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide,
      map: cardTexture,
    });

    // Apply visual effects
    if (selectedEffect && selectedEffect.id) {
      switch (selectedEffect.id) {
        case 'holographic':
          material.roughness = 0.05;
          material.metalness = 0.8;
          material.envMapIntensity = 2 + intensity;
          material.color = new THREE.Color().setHSL(0.5 + intensity * 0.3, 0.8, 0.9);
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
          material.color = new THREE.Color(0.9 + intensity * 0.1, 0.9 + intensity * 0.1, 0.9 + intensity * 0.1);
          break;
      }
    }

    return material;
  };
  
  return (
    <group>
      {/* Main card mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]} material={createCardMaterial()}>
        <boxGeometry args={[3, 4.2, 0.05]} />
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
  selectedEffect
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
        <EnvironmentBackground scene={scene} />
        <SceneLighting scene={scene} />
        <Card3D 
          scene={scene} 
          card={card} 
          effectIntensity={effectIntensity}
          selectedEffect={selectedEffect}
        />
        {allowRotation && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            minDistance={4}
            maxDistance={15}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        )}
        <fog attach="fog" args={[scene.lighting.color, 15, 25]} />
      </Canvas>
    </div>
  );
};
