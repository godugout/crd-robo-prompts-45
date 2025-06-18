
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';
import type { CardData } from '@/hooks/useCardEditor';
import { Card3DMesh } from './components/Card3DMesh';

// Enhanced 3D environment background - CONTAINED
const EnvironmentBackground = () => {
  return (
    <>
      <mesh position={[0, 0, -20]} scale={30}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x1a1a2e)}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      <mesh position={[-8, 6, -6]} scale={1}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x4a9eff)}
          transparent
          opacity={0.06}
        />
      </mesh>
      
      <mesh position={[8, -4, -6]} scale={1.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0xff6b9d)}
          transparent
          opacity={0.04}
        />
      </mesh>
    </>
  );
};

interface Advanced3DCardRendererProps {
  cardData: CardData;
  imageUrl?: string;
  effects?: {
    holographic?: boolean;
    metalness?: number;
    roughness?: number;
    particles?: boolean;
    glow?: boolean;
    glowColor?: string;
    chrome?: boolean;
    crystal?: boolean;
    vintage?: boolean;
  };
  onInteraction?: (type: string, data: any) => void;
}

export const Advanced3DCardRenderer: React.FC<Advanced3DCardRendererProps> = ({
  cardData,
  imageUrl,
  effects = {},
  onInteraction
}) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl">
      <Canvas 
        shadows 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }}
        gl={{ 
          antialias: true, 
          alpha: false, // Changed to false to contain effects
          preserveDrawingBuffer: true
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        onCreated={({ gl, scene }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.setClearColor(new THREE.Color('#0f0f23')); // Contained background
          
          // Set scene fog to contain lighting effects
          scene.fog = new THREE.Fog(0x0f0f23, 8, 15);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        
        {/* CONTAINED Professional lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[3, 3, 2]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <directionalLight 
          position={[-3, 1.5, 1]} 
          intensity={0.4} 
          color="#4a9eff"
        />
        <pointLight position={[0, -2, 1]} color="#ff6b9d" intensity={0.3} />
        <spotLight 
          position={[0, 0, 3]} 
          intensity={0.2} 
          angle={0.3} 
          penumbra={0.2}
          castShadow
        />
        
        <Environment preset="studio" />
        <EnvironmentBackground />
        
        {/* 3D Card with proper aspect ratio - CONTAINED */}
        <Card3DMesh 
          cardData={cardData}
          imageUrl={imageUrl}
          effects={effects}
        />
        
        {/* Camera controls - CONTAINED */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2.5}
          maxDistance={8}
          autoRotate={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Control overlay - CONTAINED */}
      <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md p-3 rounded-xl text-white z-10 border border-white/20">
        <div className="text-sm space-y-1">
          <div className="font-semibold text-crd-green">3D Controls</div>
          <div className="text-xs opacity-80">🖱️ Drag to rotate</div>
          <div className="text-xs opacity-80">🔍 Scroll to zoom</div>
          <div className="text-xs opacity-80">✨ Effects contained</div>
        </div>
      </div>
      
      {/* Effects status overlay - CONTAINED */}
      <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md p-3 rounded-xl text-white z-10 border border-white/20 max-w-xs">
        <div className="text-sm font-medium mb-1 truncate">{cardData.title}</div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>Aspect: 2.5:3.5 • Contained Lighting</div>
          <div className="flex gap-1 flex-wrap">
            {effects.holographic && <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-purple-300 text-xs">Holo</span>}
            {effects.chrome && <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-blue-300 text-xs">Chrome</span>}
            {effects.crystal && <span className="px-1.5 py-0.5 bg-cyan-500/20 rounded text-cyan-300 text-xs">Crystal</span>}
            {effects.vintage && <span className="px-1.5 py-0.5 bg-orange-500/20 rounded text-orange-300 text-xs">Vintage</span>}
            {effects.particles && <span className="px-1.5 py-0.5 bg-yellow-500/20 rounded text-yellow-300 text-xs">Particles</span>}
            {effects.glow && <span className="px-1.5 py-0.5 bg-green-500/20 rounded text-green-300 text-xs">Glow</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
