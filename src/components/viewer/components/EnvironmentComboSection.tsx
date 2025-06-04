
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { EnvironmentScene } from '../types';
import { ENVIRONMENT_SCENES } from '../constants';
import { Loader2 } from 'lucide-react';

interface EnvironmentComboSectionProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
}

export const EnvironmentComboSection: React.FC<EnvironmentComboSectionProps> = ({
  selectedScene,
  onSceneChange
}) => {
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (sceneId: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(sceneId);
      return newSet;
    });
  };

  const handleImageLoadStart = (sceneId: string) => {
    setLoadingImages(prev => new Set(prev).add(sceneId));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {ENVIRONMENT_SCENES.map((scene) => (
          <Button
            key={scene.id}
            onClick={() => onSceneChange(scene)}
            variant={selectedScene.id === scene.id ? "default" : "outline"}
            className={`h-auto p-2 flex flex-col items-center space-y-1 relative overflow-hidden ${
              selectedScene.id === scene.id
                ? 'bg-crd-green text-black border-crd-green'
                : 'border-editor-border hover:border-crd-green hover:bg-crd-green/10'
            }`}
          >
            {/* HDR Preview Image Background */}
            {scene.environmentType === 'hdr' && scene.previewImage && (
              <div className="absolute inset-0 opacity-20">
                {loadingImages.has(scene.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
                <img
                  src={scene.previewImage}
                  alt={`${scene.name} environment`}
                  className="w-full h-full object-cover rounded"
                  onLoadStart={() => handleImageLoadStart(scene.id)}
                  onLoad={() => handleImageLoad(scene.id)}
                  onError={() => handleImageLoad(scene.id)}
                />
              </div>
            )}
            
            {/* Gradient Fallback for non-HDR or failed loads */}
            {(scene.environmentType !== 'hdr' || !scene.previewImage) && (
              <div 
                className="absolute inset-0 opacity-30 rounded"
                style={{ background: scene.gradient }}
              />
            )}
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center space-y-1">
              <span className="text-lg">{scene.icon}</span>
              <span className="text-xs font-medium text-center">{scene.name}</span>
              <span className="text-xs text-center leading-tight opacity-70">
                {scene.description}
              </span>
              
              {/* HDR Badge */}
              {scene.environmentType === 'hdr' && (
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <span className="text-[10px] opacity-60">HDR</span>
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
      
      {/* HDR Info */}
      <div className="text-xs text-gray-400 text-center">
        HDR environments provide realistic lighting and reflections
      </div>
    </div>
  );
};
