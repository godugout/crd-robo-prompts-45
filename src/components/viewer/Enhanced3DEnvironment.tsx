
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import * as THREE from 'three';
import type { EnvironmentScene } from './types';

interface Enhanced3DEnvironmentProps {
  scene: EnvironmentScene;
  children?: React.ReactNode;
  allowRotation?: boolean;
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
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Create color overlay gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    switch (scene.id) {
      case 'studio':
        gradient.addColorStop(0, 'rgba(74, 85, 104, 0.3)');
        gradient.addColorStop(0.5, 'rgba(45, 55, 72, 0.5)');
        gradient.addColorStop(1, 'rgba(26, 32, 44, 0.7)');
        break;
      case 'gallery':
        gradient.addColorStop(0, 'rgba(247, 250, 252, 0.2)');
        gradient.addColorStop(0.5, 'rgba(226, 232, 240, 0.3)');
        gradient.addColorStop(1, 'rgba(203, 213, 224, 0.4)');
        break;
      case 'stadium':
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
        gradient.addColorStop(0.3, 'rgba(34, 139, 34, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 100, 0, 0.5)');
        break;
      case 'twilight':
        gradient.addColorStop(0, 'rgba(255, 127, 80, 0.4)');
        gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.5)');
        gradient.addColorStop(1, 'rgba(25, 25, 112, 0.6)');
        break;
      case 'quarry':
        gradient.addColorStop(0, 'rgba(255, 235, 59, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 152, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(211, 47, 47, 0.5)');
        break;
      case 'coastline':
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
        gradient.addColorStop(0.5, 'rgba(70, 130, 180, 0.4)');
        gradient.addColorStop(1, 'rgba(47, 79, 79, 0.5)');
        break;
      case 'hillside':
        gradient.addColorStop(0, 'rgba(144, 238, 144, 0.3)');
        gradient.addColorStop(0.5, 'rgba(34, 139, 34, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 100, 0, 0.5)');
        break;
      case 'milkyway':
        gradient.addColorStop(0, 'rgba(25, 25, 112, 0.4)');
        gradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        break;
      case 'esplanade':
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 140, 0, 0.5)');
        break;
      case 'neonclub':
        gradient.addColorStop(0, 'rgba(255, 105, 180, 0.4)');
        gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0.4)');
        break;
      case 'industrial':
        gradient.addColorStop(0, 'rgba(105, 105, 105, 0.4)');
        gradient.addColorStop(0.5, 'rgba(220, 20, 60, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0.6)');
        break;
      default:
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
        gradient.addColorStop(1, 'rgba(70, 130, 180, 0.4)');
    }

    // Try to load photo background
    const photoUrl = SCENE_PHOTOS[scene.id as keyof typeof SCENE_PHOTOS];
    
    if (photoUrl) {
      textureLoader.load(
        photoUrl,
        (photoTexture) => {
          // Photo loaded successfully - create composite
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            // Draw photo
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Apply color overlay
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.mapping = THREE.EquirectangularReflectionMapping;
            threeScene.background = texture;
            threeScene.environment = texture;
          };
          img.src = photoUrl;
        },
        undefined,
        () => {
          // Fallback to gradient only
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const texture = new THREE.CanvasTexture(canvas);
          texture.mapping = THREE.EquirectangularReflectionMapping;
          threeScene.background = texture;
          threeScene.environment = texture;
        }
      );
    } else {
      // Fallback to gradient only
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      threeScene.background = texture;
      threeScene.environment = texture;
    }
    
    return () => {
      // Cleanup textures
      if (threeScene.background && threeScene.background instanceof THREE.Texture) {
        threeScene.background.dispose();
      }
    };
  }, [scene, threeScene]);
  
  return null;
};

const Card3D: React.FC<{ scene: EnvironmentScene }> = ({ scene }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[4, 5.6, 0.1]} />
      <meshStandardMaterial 
        color="#ffffff"
        roughness={0.1}
        metalness={0.05}
        envMapIntensity={1.2}
        side={THREE.DoubleSide}
      />
    </mesh>
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
  children,
  allowRotation = true
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <EnvironmentBackground scene={scene} />
        <SceneLighting scene={scene} />
        <Card3D scene={scene} />
        {allowRotation && (
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            minDistance={6}
            maxDistance={20}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        )}
        <fog attach="fog" args={[scene.lighting.color, 20, 35]} />
      </Canvas>
    </div>
  );
};
