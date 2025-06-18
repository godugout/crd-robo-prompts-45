
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

// Enhanced 3D environment background
const EnvironmentBackground = () => {
  return (
    <>
      <mesh position={[0, 0, -20]} scale={30}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x1a1a2e)}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      <mesh position={[-12, 8, -8]} scale={1.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x4a9eff)}
          transparent
          opacity={0.08}
        />
      </mesh>
      
      <mesh position={[12, -6, -8]} scale={2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0xff6b9d)}
          transparent
          opacity={0.06}
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
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Canvas 
        shadows 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        
        {/* Professional lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[4, 4, 2]} 
          intensity={1.0} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={30}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        <directionalLight 
          position={[-4, 2, 1]} 
          intensity={0.6} 
          color="#4a9eff"
        />
        <pointLight position={[0, -2, 1]} color="#ff6b9d" intensity={0.4} />
        <spotLight 
          position={[0, 0, 4]} 
          intensity={0.3} 
          angle={0.2} 
          penumbra={0.1}
          castShadow
        />
        
        <Environment preset="studio" />
        <EnvironmentBackground />
        
        {/* 3D Card with proper aspect ratio */}
        <Card3DMesh 
          cardData={cardData}
          imageUrl={imageUrl}
          effects={effects}
        />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI - Math.PI / 8}
        />
      </Canvas>
      
      {/* Control overlay */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl text-white z-10 border border-white/10">
        <div className="text-sm space-y-1">
          <div className="font-semibold text-crd-green">3D Controls</div>
          <div className="text-xs opacity-80">🖱️ Drag to rotate</div>
          <div className="text-xs opacity-80">🔍 Scroll to zoom</div>
          <div className="text-xs opacity-80">✨ Hover for effects</div>
        </div>
      </div>
      
      {/* Effects status overlay */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-xl text-white z-10 border border-white/10">
        <div className="text-sm font-medium mb-1">{cardData.title}</div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>Aspect Ratio: 2.5:3.5 • Preserved</div>
          <div className="flex gap-2 flex-wrap">
            {effects.holographic && <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">Holographic</span>}
            {effects.chrome && <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300">Chrome</span>}
            {effects.crystal && <span className="px-2 py-1 bg-cyan-500/20 rounded text-cyan-300">Crystal</span>}
            {effects.vintage && <span className="px-2 py-1 bg-orange-500/20 rounded text-orange-300">Vintage</span>}
            {effects.particles && <span className="px-2 py-1 bg-yellow-500/20 rounded text-yellow-300">Particles</span>}
            {effects.glow && <span className="px-2 py-1 bg-green-500/20 rounded text-green-300">Glow</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
