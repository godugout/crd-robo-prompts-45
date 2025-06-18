
import React from 'react';
import { Environment } from '@react-three/drei';

export const SlabLighting: React.FC = () => {
  return (
    <>
      {/* Key Light - Main illumination */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Fill Light - Soft ambient */}
      <ambientLight intensity={0.3} color="#f8fafc" />

      {/* Rim Light - Edge definition */}
      <directionalLight
        position={[-5, 8, -4]}
        intensity={0.6}
        color="#e0f2fe"
      />

      {/* Accent Light - Card highlight */}
      <spotLight
        position={[0, 8, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        target-position={[0, 0, 0]}
      />

      {/* Bottom Bounce Light */}
      <pointLight
        position={[0, -6, 2]}
        intensity={0.3}
        color="#f1f5f9"
        distance={15}
        decay={2}
      />

      {/* Professional Studio Environment */}
      <Environment 
        preset="studio" 
        background={false}
        blur={0.8}
      />
    </>
  );
};
