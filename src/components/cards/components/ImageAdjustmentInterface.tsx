
import React, { useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FramedImagePreview } from './FramedImagePreview';
import { ALL_FRAME_CONFIGS } from '@/components/editor/frames/VintageFrameConfigs';
import type { FramedImage } from '../types/bulkUploadTypes';

interface ImageAdjustmentInterfaceProps {
  framedImage: FramedImage;
  onImageAdjusted: (updatedImage: FramedImage) => void;
}

export const ImageAdjustmentInterface: React.FC<ImageAdjustmentInterfaceProps> = ({
  framedImage,
  onImageAdjusted
}) => {
  const [localImage, setLocalImage] = useState(framedImage);

  const updatePosition = (updates: Partial<typeof localImage.position>) => {
    const updatedImage = {
      ...localImage,
      position: { ...localImage.position, ...updates }
    };
    setLocalImage(updatedImage);
    onImageAdjusted(updatedImage);
  };

  const changeFrame = (frameId: string) => {
    const newFrameConfig = ALL_FRAME_CONFIGS.find(config => config.id === frameId);
    if (newFrameConfig) {
      const updatedImage = {
        ...localImage,
        frameId,
        frameConfig: newFrameConfig
      };
      setLocalImage(updatedImage);
      onImageAdjusted(updatedImage);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Preview</h3>
        <div className="flex justify-center">
          <FramedImagePreview
            framedImage={localImage}
            size="large"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white">Adjustments</h3>
        
        {/* Position Controls */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Position & Scale</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-crd-lightGray mb-2 block">X Position</label>
              <Slider
                value={[localImage.position.x]}
                onValueChange={([value]) => updatePosition({ x: value })}
                min={-50}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm text-crd-lightGray mb-2 block">Y Position</label>
              <Slider
                value={[localImage.position.y]}
                onValueChange={([value]) => updatePosition({ y: value })}
                min={-50}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm text-crd-lightGray mb-2 block">Scale</label>
              <Slider
                value={[localImage.position.scale]}
                onValueChange={([value]) => updatePosition({ scale: value })}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm text-crd-lightGray mb-2 block">Rotation</label>
              <Slider
                value={[localImage.position.rotation]}
                onValueChange={([value]) => updatePosition({ rotation: value })}
                min={-45}
                max={45}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => updatePosition({ scale: localImage.position.scale + 0.1 })}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-white"
            >
              <ZoomIn className="w-4 h-4 mr-1" />
              Zoom In
            </Button>
            <Button
              onClick={() => updatePosition({ scale: Math.max(0.5, localImage.position.scale - 0.1) })}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-white"
            >
              <ZoomOut className="w-4 h-4 mr-1" />
              Zoom Out
            </Button>
            <Button
              onClick={() => updatePosition({ rotation: localImage.position.rotation + 15 })}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-white"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              Rotate
            </Button>
            <Button
              onClick={() => updatePosition({ x: 0, y: 0, scale: 1, rotation: 0 })}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-white"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Frame Selection */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Frame Style</h4>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {ALL_FRAME_CONFIGS.map((config) => (
              <button
                key={config.id}
                onClick={() => changeFrame(config.id)}
                className={`p-2 rounded border text-sm transition-colors ${
                  localImage.frameId === config.id
                    ? 'border-crd-green bg-crd-green/20 text-crd-green'
                    : 'border-crd-mediumGray text-crd-lightGray hover:border-crd-lightGray'
                }`}
              >
                {config.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
