
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCw, 
  RotateCcw, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Crop,
  Check,
  X,
  Grid3X3
} from 'lucide-react';

interface ImageAdjustment {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  crop: { x: number; y: number; width: number; height: number };
}

interface ImageAdjustmentInterfaceProps {
  imageUrl: string;
  onAdjust: (adjustment: ImageAdjustment) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const ImageAdjustmentInterface: React.FC<ImageAdjustmentInterfaceProps> = ({
  imageUrl,
  onAdjust,
  onComplete,
  onCancel
}) => {
  const [adjustment, setAdjustment] = useState<ImageAdjustment>({
    scale: 1,
    rotation: 0,
    position: { x: 0, y: 0 },
    crop: { x: 0, y: 0, width: 100, height: 100 }
  });
  
  const [showGrid, setShowGrid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleAdjustmentChange = useCallback((newAdjustment: Partial<ImageAdjustment>) => {
    const updated = { ...adjustment, ...newAdjustment };
    setAdjustment(updated);
    onAdjust(updated);
  }, [adjustment, onAdjust]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    
    handleAdjustmentChange({
      position: { x: Math.max(-50, Math.min(50, x)), y: Math.max(-50, Math.min(50, y)) }
    });
  }, [isDragging, handleAdjustmentChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const resetAdjustments = () => {
    const reset = {
      scale: 1,
      rotation: 0,
      position: { x: 0, y: 0 },
      crop: { x: 0, y: 0, width: 100, height: 100 }
    };
    setAdjustment(reset);
    onAdjust(reset);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Adjust Image</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowGrid(!showGrid)}
            className={`border-white/20 text-white hover:bg-white/10 ${showGrid ? 'bg-crd-green/20' : ''}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetAdjustments}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Image Preview with Adjustments */}
      <Card className="bg-black/20 border-white/10 p-4">
        <div 
          ref={containerRef}
          className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[2.5/3.5] cursor-move"
          onMouseDown={handleMouseDown}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Adjustable preview"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200"
            style={{
              transform: `
                scale(${adjustment.scale}) 
                rotate(${adjustment.rotation}deg) 
                translate(${adjustment.position.x}px, ${adjustment.position.y}px)
              `,
              transformOrigin: 'center center',
            }}
          />

          {/* Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="adjustment-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#adjustment-grid)" />
              </svg>
            </div>
          )}

          {/* Center Guide */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-crd-green rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-crd-green/50" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-crd-green/50" />
          </div>
        </div>
      </Card>

      {/* Adjustment Controls */}
      <div className="space-y-4">
        {/* Scale Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm flex items-center">
              <ZoomIn className="w-4 h-4 mr-2" />
              Scale
            </span>
            <span className="text-white text-sm">{Math.round(adjustment.scale * 100)}%</span>
          </div>
          <Slider
            value={[adjustment.scale]}
            onValueChange={([value]) => handleAdjustmentChange({ scale: value })}
            min={0.5}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Rotation Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm flex items-center">
              <RotateCw className="w-4 h-4 mr-2" />
              Rotation
            </span>
            <span className="text-white text-sm">{adjustment.rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAdjustmentChange({ rotation: adjustment.rotation - 90 })}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Slider
              value={[adjustment.rotation]}
              onValueChange={([value]) => handleAdjustmentChange({ rotation: value })}
              min={-180}
              max={180}
              step={1}
              className="flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAdjustmentChange({ rotation: adjustment.rotation + 90 })}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Position Fine-tuning */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-white text-sm">Position X</span>
            <Slider
              value={[adjustment.position.x]}
              onValueChange={([value]) => handleAdjustmentChange({ 
                position: { ...adjustment.position, x: value } 
              })}
              min={-50}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <span className="text-white text-sm">Position Y</span>
            <Slider
              value={[adjustment.position.y]}
              onValueChange={([value]) => handleAdjustmentChange({ 
                position: { ...adjustment.position, y: value } 
              })}
              min={-50}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={onComplete}
          className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          <Check className="w-4 h-4 mr-2" />
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
