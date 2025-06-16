
import React, { useState, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Box, Sparkles, Sun, X } from 'lucide-react';
import { Interactive3DCard } from '@/components/cards/Interactive3DCard';

interface Card3DPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: any;
  imageUrl?: string;
}

const Card3DScene: React.FC<{ cardData: any; imageUrl?: string; lighting: any; environment: string }> = ({
  cardData,
  imageUrl,
  lighting,
  environment
}) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* Lighting setup */}
      <ambientLight intensity={lighting.ambient} />
      <directionalLight
        position={[lighting.directional.x, lighting.directional.y, lighting.directional.z]}
        intensity={lighting.directional.intensity}
        castShadow
      />
      
      {/* Environment */}
      {environment !== 'none' && (
        <Environment preset={environment as any} />
      )}
      
      {/* Card */}
      <Interactive3DCard
        card={{
          ...cardData,
          image_url: imageUrl || cardData.image_url
        }}
        position={[0, 0, 0]}
        scale={1.5}
      />
    </>
  );
};

export const Card3DPreviewModal: React.FC<Card3DPreviewModalProps> = ({
  isOpen,
  onClose,
  cardData,
  imageUrl
}) => {
  const [lighting, setLighting] = useState({
    ambient: 0.4,
    directional: {
      x: 5,
      y: 5,
      z: 5,
      intensity: 1
    }
  });
  
  const [environment, setEnvironment] = useState('studio');

  const environments = [
    { value: 'none', label: 'None' },
    { value: 'studio', label: 'Studio' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'dawn', label: 'Dawn' },
    { value: 'night', label: 'Night' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] bg-editor-dark border-editor-border">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Box className="w-5 h-5" />
            3D Card Preview
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-editor-border"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex h-full gap-4">
          {/* 3D Canvas */}
          <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden">
            <Canvas shadows>
              <Suspense fallback={null}>
                <Card3DScene
                  cardData={cardData}
                  imageUrl={imageUrl}
                  lighting={lighting}
                  environment={environment}
                />
              </Suspense>
            </Canvas>
          </div>
          
          {/* Controls Panel */}
          <div className="w-64 bg-editor-tool rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Lighting
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-crd-lightGray">Ambient</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={lighting.ambient}
                    onChange={(e) => setLighting(prev => ({
                      ...prev,
                      ambient: parseFloat(e.target.value)
                    }))}
                    className="w-full accent-crd-green"
                  />
                  <span className="text-xs text-crd-lightGray">{lighting.ambient}</span>
                </div>
                
                <div>
                  <label className="text-xs text-crd-lightGray">Directional</label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={lighting.directional.intensity}
                    onChange={(e) => setLighting(prev => ({
                      ...prev,
                      directional: {
                        ...prev.directional,
                        intensity: parseFloat(e.target.value)
                      }
                    }))}
                    className="w-full accent-crd-green"
                  />
                  <span className="text-xs text-crd-lightGray">{lighting.directional.intensity}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Environment
              </h3>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-editor-dark border border-editor-border rounded text-white p-2"
              >
                {environments.map(env => (
                  <option key={env.value} value={env.value}>
                    {env.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="pt-4 border-t border-editor-border">
              <p className="text-xs text-crd-lightGray">
                • Drag to rotate
                • Scroll to zoom
                • Right-click to pan
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
