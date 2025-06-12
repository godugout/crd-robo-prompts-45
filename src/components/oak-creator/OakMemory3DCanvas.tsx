
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ZoomIn, ZoomOut, Maximize, Eye, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OakTemplate } from '@/types/oakTemplates';
import { OakMemory3DCard } from './OakMemory3DCard';
import { OakMemoryErrorBoundary } from './OakMemoryErrorBoundary';
import { useOakMemory3DInteraction } from './hooks/useOakMemory3DInteraction';

interface OakMemory3DCanvasProps {
  selectedTemplate: OakTemplate | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

// Enhanced loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47]">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#ffd700] text-sm">Loading 3D Viewer...</p>
    </div>
  </div>
);

// 3D Error fallback component
const ThreeDErrorFallback: React.FC<{ template: OakTemplate | null, onRetry: () => void }> = ({ template, onRetry }) => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47]">
    <div className="text-center p-8">
      <div className="w-16 h-16 rounded-full bg-[#ffd700]/20 flex items-center justify-center mx-auto mb-4">
        <Box className="w-8 h-8 text-[#ffd700]" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">3D Viewer Error</h3>
      <p className="text-white/80 text-sm mb-4">
        The 3D viewer couldn't load. Showing 2D preview instead.
      </p>
      {template && (
        <div className="relative mb-4">
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-48 h-64 object-cover rounded-lg shadow-xl mx-auto"
            onError={(e) => {
              console.warn('Template image failed to load:', template.thumbnail);
              e.currentTarget.src = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
            }}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <h4 className="text-lg font-bold mb-1">{template.name}</h4>
              <p className="text-sm opacity-90">2D Preview Mode</p>
            </div>
          </div>
        </div>
      )}
      <Button
        onClick={onRetry}
        className="bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90"
      >
        Try 3D Again
      </Button>
    </div>
  </div>
);

export const OakMemory3DCanvas: React.FC<OakMemory3DCanvasProps> = ({
  selectedTemplate,
  zoom,
  onZoomIn,
  onZoomOut
}) => {
  const [is3DMode, setIs3DMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cardFinish, setCardFinish] = useState<'matte' | 'glossy' | 'foil'>('glossy');
  const [threeDError, setThreeDError] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
  const {
    cameraPosition,
    cardRotation,
    autoRotate,
    setAutoRotate,
    resetView
  } = useOakMemory3DInteraction();

  // Add loading timeout with shorter duration
  useEffect(() => {
    if (is3DMode && !threeDError && !isCanvasReady) {
      const timeout = setTimeout(() => {
        console.warn('3D Canvas loading timeout - falling back to 2D');
        setThreeDError(true);
      }, 5000); // Reduced to 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [is3DMode, threeDError, isCanvasReady]);

  // Debug logging
  useEffect(() => {
    if (selectedTemplate) {
      console.log('OakMemory3DCanvas - Selected template:', {
        name: selectedTemplate.name,
        thumbnail: selectedTemplate.thumbnail,
        is3DMode,
        threeDError,
        isCanvasReady
      });
    }
  }, [selectedTemplate, is3DMode, threeDError, isCanvasReady]);

  const handleCanvasCreated = (state: any) => {
    console.log('Canvas created successfully');
    setIsCanvasReady(true);
    setThreeDError(false);
  };

  const handleCanvasError = (error: any) => {
    console.error('Canvas error:', error);
    setThreeDError(true);
    setIsCanvasReady(false);
  };

  const retryThreeD = () => {
    console.log('Retrying 3D viewer...');
    setThreeDError(false);
    setIsCanvasReady(false);
    setIs3DMode(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggle3DMode = () => {
    console.log('Toggling 3D mode from', is3DMode, 'to', !is3DMode);
    setIs3DMode(!is3DMode);
    setAutoRotate(false);
    if (!is3DMode) {
      setThreeDError(false);
      setIsCanvasReady(false);
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  // Validate template data
  const isValidTemplate = selectedTemplate && 
    typeof selectedTemplate === 'object' && 
    selectedTemplate.id && 
    selectedTemplate.name && 
    selectedTemplate.thumbnail;

  // Safe zoom values
  const safeZoom = Math.max(50, Math.min(200, zoom || 100));

  return (
    <OakMemoryErrorBoundary>
      <main className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col relative">
        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur rounded-lg shadow-lg p-2 z-10">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              className="hover:bg-gray-100"
              disabled={safeZoom <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {safeZoom}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              className="hover:bg-gray-100"
              disabled={safeZoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* View Controls */}
          <div className="flex flex-col gap-1">
            <Button
              variant={is3DMode && !threeDError ? "default" : "outline"}
              size="sm"
              onClick={toggle3DMode}
              className={is3DMode && !threeDError ? "bg-[#0f4c3a] text-[#ffd700]" : "hover:bg-gray-100"}
            >
              <Box className="w-4 h-4 mr-2" />
              {is3DMode && !threeDError ? '3D' : '2D'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="hover:bg-gray-100"
            >
              <Maximize className="w-4 h-4" />
            </Button>

            {is3DMode && !threeDError && (
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
              width: isFullscreen ? '90vw' : `${(400 * safeZoom) / 100}px`,
              height: isFullscreen ? '90vh' : `${(600 * safeZoom) / 100}px`,
              maxWidth: '90%',
              maxHeight: '80%',
            }}
          >
            {isValidTemplate ? (
              is3DMode && !threeDError ? (
                <OakMemoryErrorBoundary 
                  fallback={<ThreeDErrorFallback template={selectedTemplate} onRetry={retryThreeD} />}
                >
                  <Canvas
                    shadows
                    camera={{ position: cameraPosition, fov: 50 }}
                    gl={{ 
                      antialias: true, 
                      alpha: false,
                      powerPreference: "high-performance",
                      failIfMajorPerformanceCaveat: false
                    }}
                    dpr={[1, 2]}
                    onCreated={handleCanvasCreated}
                    onError={handleCanvasError}
                  >
                    <Suspense fallback={null}>
                      {/* Simplified lighting */}
                      <ambientLight intensity={0.6} />
                      <directionalLight
                        position={[5, 5, 5]}
                        intensity={0.8}
                        castShadow
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
                      />

                      {/* Simple environment */}
                      <Environment preset="studio" />
                    </Suspense>
                  </Canvas>

                  {/* Loading overlay */}
                  {!isCanvasReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47]">
                      <LoadingFallback />
                    </div>
                  )}
                </OakMemoryErrorBoundary>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47]">
                  <div className="relative">
                    <img
                      src={selectedTemplate.thumbnail}
                      alt={selectedTemplate.name}
                      className="w-64 h-96 object-cover rounded-lg shadow-xl"
                      onError={(e) => {
                        console.warn('Failed to load template image:', selectedTemplate.thumbnail);
                        e.currentTarget.src = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                      <div className="text-center text-white">
                        <h3 className="text-lg font-bold mb-2">{selectedTemplate.name}</h3>
                        <p className="text-sm opacity-90">
                          {threeDError ? '2D Mode (3D Error)' : '2D Preview Mode'}
                        </p>
                        {threeDError && (
                          <Button
                            onClick={retryThreeD}
                            className="mt-2 bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90 text-xs px-3 py-1"
                          >
                            Retry 3D
                          </Button>
                        )}
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
    </OakMemoryErrorBoundary>
  );
};
