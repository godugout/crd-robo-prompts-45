
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

const EnvironmentBackground: React.FC<{ scene: EnvironmentScene }> = ({ scene }) => {
  const { scene: threeScene } = useThree();
  
  useEffect(() => {
    // Create a gradient texture based on the scene
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient based on scene type
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    switch (scene.id) {
      case 'studio':
        gradient.addColorStop(0, '#4a5568');
        gradient.addColorStop(0.5, '#2d3748');
        gradient.addColorStop(1, '#1a202c');
        break;
      case 'gallery':
        gradient.addColorStop(0, '#f7fafc');
        gradient.addColorStop(0.5, '#e2e8f0');
        gradient.addColorStop(1, '#cbd5e0');
        break;
      case 'stadium':
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.3, '#228b22');
        gradient.addColorStop(1, '#006400');
        break;
      case 'twilight':
        gradient.addColorStop(0, '#ff7f50');
        gradient.addColorStop(0.5, '#8a2be2');
        gradient.addColorStop(1, '#191970');
        break;
      case 'quarry':
        gradient.addColorStop(0, '#ffeb3b');
        gradient.addColorStop(0.5, '#ff9800');
        gradient.addColorStop(1, '#d32f2f');
        break;
      case 'coastline':
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.5, '#4682b4');
        gradient.addColorStop(1, '#2f4f4f');
        break;
      case 'hillside':
        gradient.addColorStop(0, '#90ee90');
        gradient.addColorStop(0.5, '#228b22');
        gradient.addColorStop(1, '#006400');
        break;
      case 'milkyway':
        gradient.addColorStop(0, '#191970');
        gradient.addColorStop(0.5, '#4b0082');
        gradient.addColorStop(1, '#000000');
        break;
      case 'esplanade':
        gradient.addColorStop(0, '#ffd700');
        gradient.addColorStop(0.5, '#ffa500');
        gradient.addColorStop(1, '#ff8c00');
        break;
      case 'neonclub':
        gradient.addColorStop(0, '#ff69b4');
        gradient.addColorStop(0.5, '#8a2be2');
        gradient.addColorStop(1, '#00ffff');
        break;
      case 'industrial':
        gradient.addColorStop(0, '#696969');
        gradient.addColorStop(0.5, '#dc143c');
        gradient.addColorStop(1, '#ff4500');
        break;
      default:
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#4682b4');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    
    threeScene.background = texture;
    threeScene.environment = texture;
    
    return () => {
      texture.dispose();
    };
  }, [scene, threeScene]);
  
  return null;
};

const Card3D: React.FC<{ scene: EnvironmentScene }> = ({ scene }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2.8, 0.05]} />
      <meshStandardMaterial 
        color="#ffffff"
        roughness={0.1}
        metalness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
};

const SceneLighting: React.FC<{ scene: EnvironmentScene }> = ({ scene }) => {
  return (
    <>
      <ambientLight intensity={scene.lighting.ambient} color={scene.lighting.color} />
      <directionalLight 
        intensity={scene.lighting.directional}
        position={[5, 5, 5]}
        color={scene.lighting.color}
        castShadow
      />
      <pointLight 
        intensity={0.3}
        position={[-5, 3, -5]}
        color={scene.lighting.color}
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
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <EnvironmentBackground scene={scene} />
        <SceneLighting scene={scene} />
        <Card3D scene={scene} />
        {allowRotation && <OrbitControls enablePan={false} enableZoom={true} />}
        <fog attach="fog" args={[scene.lighting.color, 10, 20]} />
      </Canvas>
    </div>
  );
};
