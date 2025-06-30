
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface CardMeshProps {
  frontImage: string;
  effects: {
    holographic: number;
    metallic: number;
    chrome: number;
  };
}

const CardMesh: React.FC<CardMeshProps> = ({ frontImage, effects }) => {
  const frontTexture = useLoader(TextureLoader, frontImage);
  const backTexture = useLoader(TextureLoader, '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png');

  // Configure textures - fix the upside-down image issue
  useMemo(() => {
    [frontTexture, backTexture].forEach(texture => {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.flipY = true; // Changed from false to true to fix upside-down rendering
    });
  }, [frontTexture, backTexture]);

  const materialProps = useMemo(() => ({
    roughness: Math.max(0.1, 0.8 - effects.chrome * 0.7),
    metalness: Math.min(0.9, 0.1 + effects.metallic * 0.6 + effects.chrome * 0.3),
    reflectivity: Math.min(1, 0.5 + effects.chrome * 0.5)
  }), [effects]);

  return (
    <group>
      {/* Card Front */}
      <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <meshPhysicalMaterial
          map={frontTexture}
          transparent
          opacity={0.95}
          {...materialProps}
        />
      </mesh>

      {/* Card Back */}
      <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <meshPhysicalMaterial
          map={backTexture}
          transparent
          opacity={0.95}
          {...materialProps}
        />
      </mesh>

      {/* Holographic effect */}
      {effects.holographic > 0 && (
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[2.52, 3.52]} />
          <meshPhysicalMaterial
            color="#ff00ff"
            transparent
            opacity={effects.holographic * 0.3}
            roughness={0}
            metalness={1}
          />
        </mesh>
      )}
    </group>
  );
};

interface SimpleCardRendererProps {
  imageUrl: string;
  effects: {
    holographic: number;
    metallic: number;
    chrome: number;
  };
  className?: string;
}

export const SimpleCardRenderer: React.FC<SimpleCardRendererProps> = ({
  imageUrl,
  effects,
  className = ""
}) => {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl overflow-hidden ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 1]} intensity={0.8} castShadow />
        <pointLight position={[-2, 1, 1]} color="#4a9eff" intensity={0.3} />
        
        <Environment preset="studio" />
        
        <CardMesh frontImage={imageUrl} effects={effects} />
        
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
    </div>
  );
};
