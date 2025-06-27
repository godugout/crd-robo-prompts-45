
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Text } from '@react-three/drei';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';
import * as THREE from 'three';

interface Card3DProps {
  card: any;
  material: any;
  lighting: any;
  animation: any;
}

const Card3D: React.FC<Card3DProps> = ({ card, material, lighting, animation }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Basic rotation animation
    if (animation.preset === 'rotate' && animation.isPlaying) {
      meshRef.current.rotation.y += 0.01 * (animation.speed / 50);
    }
    
    // Float animation
    if (animation.preset === 'float' && animation.isPlaying) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 * (animation.amplitude / 100);
    }
  });

  // Create material based on settings
  const cardMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),
    metalness: material.metalness / 100,
    roughness: material.roughness / 100,
    transparent: material.transparency > 0,
    opacity: 1 - (material.transparency / 100),
  });

  // Add emission for glow effects
  if (material.emission > 0) {
    cardMaterial.emissive = new THREE.Color(0x444444);
    cardMaterial.emissiveIntensity = material.emission / 100;
  }

  return (
    <group>
      {/* Card geometry */}
      <mesh ref={meshRef} material={cardMaterial}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
      </mesh>
      
      {/* Card image texture */}
      {card && (
        <mesh position={[0, 0, 0.051]}>
          <planeGeometry args={[2.3, 3.3]} />
          <meshBasicMaterial>
            <primitive object={new THREE.TextureLoader().load(card.image)} attach="map" />
          </meshBasicMaterial>
        </mesh>
      )}
      
      {/* Holographic effect overlay */}
      {material.preset === 'holographic' && (
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[2.3, 3.3]} />
          <meshBasicMaterial 
            transparent 
            opacity={0.3}
            color={new THREE.Color().setHSL(Math.sin(Date.now() * 0.001) * 0.5 + 0.5, 1, 0.5)}
          />
        </mesh>
      )}
    </group>
  );
};

const Scene: React.FC = () => {
  const { state } = useAdvancedStudio();
  const { selectedCard, material, lighting, animation, environment } = state;
  
  // Create dynamic lighting based on settings
  const lightColor = new THREE.Color();
  
  // Convert color temperature to RGB (simplified approximation)
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
      {/* Environment and lighting */}
      <Environment preset={environment.preset} backgroundIntensity={environment.hdriIntensity} />
      
      {/* Dynamic lighting */}
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
      />
      
      {/* Spot light for dramatic effects */}
      {lighting.preset === 'dramatic' && (
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={lighting.shadowIntensity / 100}
          color={lightColor}
          castShadow
        />
      )}
      
      {/* Main card */}
      {selectedCard ? (
        <Card3D 
          card={selectedCard}
          material={material}
          lighting={lighting}
          animation={animation}
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
      >
        <Scene />
      </Canvas>
      
      {/* Performance indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded px-3 py-1 text-sm text-white">
          Quality: {state.renderQuality.toUpperCase()}
        </div>
      </div>
      
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
