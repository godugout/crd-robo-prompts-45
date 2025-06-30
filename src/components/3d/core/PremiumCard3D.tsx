
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Card3D } from './Card3D';
import { ParticleSystem } from '../effects/ParticleSystem';
import { GestureHandler } from '../gestures/GestureHandler';
import { PremiumCardMaterial } from '../materials/PremiumCardMaterial';
import type { CardData } from '@/types/card';

interface PremiumCard3DProps {
  card: CardData;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  autoRotate?: boolean;
  enableParticles?: boolean;
  enableGestures?: boolean;
  onInteraction?: (type: string, data: any) => void;
}

const PremiumCardScene: React.FC<{
  card: CardData;
  quality: PremiumCard3DProps['quality'];
  enableParticles: boolean;
  onInteraction?: (type: string, data: any) => void;
}> = ({ card, quality, enableParticles, onInteraction }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onInteraction?.('flip', { isFlipped: !isFlipped });
  };
  
  const handleZoom = (scale: number) => {
    onInteraction?.('zoom', { scale });
  };
  
  const handleRotate = (rotation: { x: number; y: number }) => {
    onInteraction?.('rotate', rotation);
  };
  
  return (
    <>
      {/* Premium lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.2} 
        castShadow={quality !== 'low'}
        shadow-mapSize-width={quality === 'ultra' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'ultra' ? 2048 : 1024}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#4a9eff" />
      <spotLight 
        position={[0, 10, 5]} 
        intensity={0.8} 
        angle={0.3} 
        penumbra={0.5}
        castShadow={quality === 'ultra'}
      />
      
      {/* Environment for reflections */}
      {quality !== 'low' && <Environment preset="studio" />}
      
      {/* Enhanced 3D card with gestures */}
      <GestureHandler
        onFlip={handleFlip}
        onZoom={handleZoom}
        onRotate={handleRotate}
        enableHaptic={quality !== 'low'}
      >
        <Card3D 
          card={card}
          position={[0, 0, 0]}
          quality={quality}
          interactive={true}
          isFlipped={isFlipped}
        />
        
        {/* Particle effects for premium cards */}
        {enableParticles && (card.rarity === 'epic' || card.rarity === 'legendary') && (
          <ParticleSystem 
            count={quality === 'ultra' ? 150 : quality === 'high' ? 100 : 50}
            rarity={card.rarity}
            enabled={quality !== 'low'}
          />
        )}
      </GestureHandler>
    </>
  );
};

export const PremiumCard3D: React.FC<PremiumCard3DProps> = ({
  card,
  quality = 'high',
  autoRotate = false,
  enableParticles = true,
  enableGestures = true,
  onInteraction
}) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows={quality !== 'low'}
        dpr={quality === 'ultra' ? [1, 2] : [1, 1.5]}
        gl={{
          antialias: quality !== 'low',
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color('#000000'), 0);
          if (quality !== 'low') {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        
        {enableGestures ? (
          <Suspense fallback={null}>
            <PremiumCardScene 
              card={card}
              quality={quality}
              enableParticles={enableParticles}
              onInteraction={onInteraction}
            />
          </Suspense>
        ) : (
          <>
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={10}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
            />
            <Suspense fallback={null}>
              <PremiumCardScene 
                card={card}
                quality={quality}
                enableParticles={enableParticles}
                onInteraction={onInteraction}
              />
            </Suspense>
          </>
        )}
      </Canvas>
      
      {/* Quality indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded">
          Quality: {quality} | Rarity: {card.rarity}
        </div>
      )}
    </div>
  );
};
