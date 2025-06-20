
import React from 'react';
import { Button } from '@/components/ui/button';
import { Move, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageTransform {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

interface ImageTransformControlsProps {
  imageTransform: ImageTransform;
  showImageControls: boolean;
  onToggleControls: () => void;
  onImageTransform: (updates: Partial<ImageTransform>) => void;
  onResetTransform: () => void;
}

export const ImageTransformControls: React.FC<ImageTransformControlsProps> = ({
  imageTransform,
  showImageControls,
  onToggleControls,
  onImageTransform,
  onResetTransform
}) => {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={showImageControls ? "default" : "outline"}
          size="sm"
          onClick={onToggleControls}
          className={showImageControls ? 'bg-crd-green text-black' : ''}
        >
          <Move className="w-4 h-4 mr-2" />
          {showImageControls ? 'Done' : 'Adjust Image'}
        </Button>
      </div>

      {showImageControls && (
        <div className="bg-black/80 rounded-lg p-4 border border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onImageTransform({ scale: Math.min(imageTransform.scale + 0.1, 2) })}
              className="text-white border-white/20"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom In
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onImageTransform({ scale: Math.max(imageTransform.scale - 0.1, 0.5) })}
              className="text-white border-white/20"
            >
              <ZoomOut className="w-4 h-4 mr-2" />
              Zoom Out
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onImageTransform({ rotation: imageTransform.rotation + 90 })}
              className="text-white border-white/20"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Rotate
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onResetTransform}
              className="text-white border-white/20"
            >
              Reset
            </Button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-white/70 text-xs">
              Scale: {Math.round(imageTransform.scale * 100)}% • 
              Rotation: {imageTransform.rotation}°
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
