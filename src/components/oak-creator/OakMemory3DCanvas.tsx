
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ZoomIn, ZoomOut, Maximize, Eye, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OakTemplate } from '@/types/oakTemplates';
import { OakMemory3DCard } from './OakMemory3DCard';
import { useOakMemory3DInteraction } from './hooks/useOakMemory3DInteraction';

interface OakMemory3DCanvasProps {
  selectedTemplate: OakTemplate | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const OakMemory3DCanvas: React.FC<OakMemory3DCanvasProps> = ({
  selectedTemplate,
  zoom,
  onZoomIn,
  onZoomOut
}) => {
  const [is3DMode, setIs3DMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cardFinish, setCardFinish] = useState<'matte' | 'glossy' | 'foil'>('glossy');
  
  const {
    cameraPosition,
    cardRotation,
    autoRotate,
    setAutoRotate,
    resetView
  } = useOakMemory3DInteraction();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggle3DMode = () => {
    setIs3DMode(!is3DMode);
    setAutoRotate(false);
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col relative">
      {/* Enhanced Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur rounded-lg shadow-lg p-2 z-10">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="hover:bg-gray-100"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="hover:bg-gray-100"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* View Controls */}
        <div className="flex flex-col gap-1">
          <Button
            variant={is3DMode ? "default" : "outline"}
            size="sm"
            onClick={toggle3DMode}
            className={is3DMode ? "bg-[#0f4c3a] text-[#ffd700]" : "hover:bg-gray-100"}
          >
            <Box className="w-4 h-4 mr-2" />
            {is3DMode ? '3D' : '2D'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="hover:bg-gray-100"
          >
            <Maximize className="w-4 h-4" />
          </Button>

          {is3DMode && (
            <Button
              variant={autoRotate ? "default" : "outline"}
              size="sm"
              onClick={toggleAutoRotate}
              className={autoRotate ? "bg-[#0f4c3a] text-[#ffd700]" : "hover:bg-gray-100"}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Finish Controls */}
        <div className="flex flex-col gap-1 border-t pt-2">
          <span className="text-xs text-gray-600 text-center">Finish</span>
          {(['matte', 'glossy', 'foil'] as const).map((finish) => (
            <Button
              key={finish}
              variant={cardFinish === finish ? "default" : "outline"}
              size="sm"
              onClick={() => setCardFinish(finish)}
              className={`text-xs ${
                cardFinish === finish 
                  ? "bg-[#0f4c3a] text-[#ffd700]" 
                  : "hover:bg-gray-100"
              }`}
            >
              {finish.charAt(0).toUpperCase() + finish.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        className={`flex-1 flex items-center justify-center transition-all duration-500 ${
          isFullscreen ? 'fixed inset-0 z-50 bg-gray-100' : 'p-8'
        }`}
      >
        <div 
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
          style={{
            width: isFullscreen ? '90vw' : `${(400 * zoom) / 100}px`,
            height: isFullscreen ? '90vh' : `${(600 * zoom) / 100}px`,
            maxWidth: '90%',
            maxHeight: '80%',
          }}
        >
          {selectedTemplate ? (
            is3DMode ? (
              <Canvas
                shadows
                camera={{ position: cameraPosition, fov: 50 }}
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  {/* Oakland A's Themed Lighting */}
                  <ambientLight intensity={0.4} />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                  />
                  <pointLight
                    position={[-10, -10, -5]}
                    intensity={0.3}
                    color="#ffd700"
                  />

                  {/* 3D Card */}
                  <OakMemory3DCard
                    template={selectedTemplate}
                    rotation={cardRotation}
                    finish={cardFinish}
                    scale={0.8}
                  />

                  {/* Controls */}
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={autoRotate}
                    autoRotateSpeed={1}
                    minDistance={3}
                    maxDistance={8}
                    maxPolarAngle={Math.PI}
                  />

                  {/* Oakland Stadium Environment */}
                  <Environment
                    background
                    files={[
                      'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=2048&h=1024&fit=crop',
                    ]}
                    ground={{ height: 15, radius: 60, scale: 100 }}
                  />
                </Suspense>
              </Canvas>
            ) : (
              // 2D Fallback
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47]">
                <div className="relative">
                  <img
                    src={selectedTemplate.thumbnail}
                    alt={selectedTemplate.name}
                    className="w-64 h-96 object-cover rounded-lg shadow-xl"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <h3 className="text-lg font-bold mb-2">{selectedTemplate.name}</h3>
                      <p className="text-sm opacity-90">2D Preview Mode</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#0f4c3a] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#ffd700] font-bold text-2xl">A</span>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  Select a template to begin
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Choose from Oakland A's themed designs
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
