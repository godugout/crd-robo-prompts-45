
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { EnvironmentScene } from './types';
import type { CardData } from '@/types/card';
import { EnvironmentBackground } from './components/EnvironmentBackground';
import { SceneLighting } from './components/SceneLighting';
import { Card3D } from './components/Card3D';

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
