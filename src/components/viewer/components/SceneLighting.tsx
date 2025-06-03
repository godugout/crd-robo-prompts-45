
import React from 'react';
import type { EnvironmentScene } from '../types';

interface SceneLightingProps {
  scene: EnvironmentScene;
}

export const SceneLighting: React.FC<SceneLightingProps> = ({ scene }) => {
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
