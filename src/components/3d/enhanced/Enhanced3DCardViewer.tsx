
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Enhanced3DCardMesh } from '@/components/viewer/components/Enhanced3DCardMesh';
import { EffectProvider } from '@/components/viewer/contexts/EffectContext';
import { Card } from '@/types/card';

interface Enhanced3DCardViewerProps {
  card: Card;
  className?: string;
  autoEnable?: boolean;
  effects?: Record<string, any>;
  frameConfig?: any;
  selectedFrame?: string;
  onModeChange?: (enabled: boolean) => void;
  fallbackComponent?: React.ReactElement;
}

const CardScene: React.FC<{
  card: Card;
  effects?: Record<string, any>;
  frameConfig?: any;
  selectedFrame?: string;
}> = ({ card, effects, frameConfig, selectedFrame }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxDistance={12}
        minDistance={4}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
      />
      
      <Environment preset="studio" />
      
      <Enhanced3DCardMesh
        card={card}
        rotation={{ x: 0, y: 0 }}
        zoom={1}
        selectedFrame={selectedFrame}
        frameConfig={frameConfig}
        materialSettings={{
          metalness: 0.3,
          roughness: 0.4,
          clearcoat: 0.1,
          transmission: 0.0,
          reflectivity: 60
        }}
      />
    </>
  );
};

export const Enhanced3DCardViewer: React.FC<Enhanced3DCardViewerProps> = ({
  card,
  className = "",
  autoEnable = true,
  effects = {},
  frameConfig,
  selectedFrame,
  onModeChange,
  fallbackComponent
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <EffectProvider 
        initialEffects={effects}
        initialValues={{
          effectValues: effects,
          showEffects: true,
          effectIntensity: Object.values(effects).map((effect: any) => 
            typeof effect?.intensity === 'number' ? effect.intensity : 0
          )
        }}
      >
        <Canvas shadows className="w-full h-full">
          <Suspense fallback={fallbackComponent || null}>
            <CardScene 
              card={card}
              effects={effects}
              frameConfig={frameConfig}
              selectedFrame={selectedFrame}
            />
          </Suspense>
        </Canvas>
      </EffectProvider>
    </div>
  );
};
