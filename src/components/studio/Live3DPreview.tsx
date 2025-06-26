
import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';
import { Enhanced3DCardRenderer } from '@/components/3d/Enhanced3DCardRenderer';
import * as THREE from 'three';

interface Live3DPreviewProps {
  frontImage?: string;
  backImage?: string;
  selectedFrame?: string;
  effects?: {
    holographic?: number;
    metallic?: number;
    chrome?: number;
    particles?: boolean;
  };
  cardData?: {
    title?: string;
    rarity?: string;
    description?: string;
  };
  className?: string;
}

export const Live3DPreview: React.FC<Live3DPreviewProps> = ({
  frontImage,
  backImage,
  selectedFrame,
  effects = {},
  cardData = {},
  className = ""
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);

  const handleResetView = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setAutoRotate(prev => !prev);
  }, []);

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true, 
          alpha: false,
          preserveDrawingBuffer: true
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[3, 3, 2]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight 
          position={[-3, 1.5, 1]} 
          intensity={0.4} 
          color="#4a9eff"
        />
        <pointLight position={[0, -2, 1]} color="#ff6b9d" intensity={0.3} />
        
        <Environment preset="studio" />
        
        {/* Enhanced Card Renderer */}
        <Enhanced3DCardRenderer
          frontImage={frontImage}
          backImage={backImage}
          selectedFrame={selectedFrame}
          effects={effects}
          rotation={rotation}
          zoom={zoom}
          cardData={cardData}
        />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          target={[0, 0, 0]}
          onChange={(e) => {
            if (e?.target) {
              const spherical = new THREE.Spherical();
              spherical.setFromVector3(e.target.object.position);
              setRotation({
                x: (spherical.phi - Math.PI / 2) * (180 / Math.PI),
                y: spherical.theta * (180 / Math.PI)
              });
            }
          }}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/20 z-10">
        <div className="flex flex-col gap-2">
          <div className="text-white text-xs font-medium mb-2">3D Controls</div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAutoRotate}
              className={`text-white hover:bg-white/20 h-8 w-8 p-0 ${autoRotate ? 'bg-crd-green/20' : ''}`}
            >
              {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetView}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/20 z-10 max-w-xs">
        <div className="text-white text-sm">
          <div className="font-semibold truncate mb-1">
            {cardData.title || 'Untitled Card'}
          </div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>Rarity: {cardData.rarity || 'Common'}</div>
            {selectedFrame && <div>Frame: {selectedFrame}</div>}
            <div className="flex gap-1 flex-wrap mt-2">
              {effects.holographic && effects.holographic > 0 && (
                <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-purple-300 text-xs">
                  Holo {Math.round(effects.holographic * 100)}%
                </span>
              )}
              {effects.chrome && effects.chrome > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-blue-300 text-xs">
                  Chrome {Math.round(effects.chrome * 100)}%
                </span>
              )}
              {effects.metallic && effects.metallic > 0 && (
                <span className="px-1.5 py-0.5 bg-yellow-500/20 rounded text-yellow-300 text-xs">
                  Metal {Math.round(effects.metallic * 100)}%
                </span>
              )}
              {effects.particles && (
                <span className="px-1.5 py-0.5 bg-green-500/20 rounded text-green-300 text-xs">
                  Particles
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {!frontImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-sm">Loading card preview...</div>
          </div>
        </div>
      )}
    </div>
  );
};
