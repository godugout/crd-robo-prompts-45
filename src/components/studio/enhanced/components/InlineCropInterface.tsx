
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Move, ZoomIn, Grid3X3, Check, X } from 'lucide-react';

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface InlineCropInterfaceProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export const InlineCropInterface: React.FC<InlineCropInterfaceProps> = ({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 2.5 / 3.5
}) => {
  const [cropBox, setCropBox] = useState<CropBox>({
    x: 50,
    y: 50,
    width: 200,
    height: 280,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    if (action === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    if (isDragging) {
      setCropBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(rect.width - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(rect.height - prev.height, prev.y + deltaY))
      }));
    } else if (isResizing) {
      setCropBox(prev => {
        const newWidth = Math.max(50, prev.width + deltaX);
        const newHeight = newWidth / aspectRatio;
        
        return {
          ...prev,
          width: Math.min(newWidth, rect.width - prev.x),
          height: Math.min(newHeight, rect.height - prev.y)
        };
      });
    }

    setDragStart({ x: currentX, y: currentY });
  }, [isDragging, isResizing, dragStart, aspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const applyCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;

    canvas.width = cropBox.width * scaleX;
    canvas.height = cropBox.height * scaleY;

    // Apply rotation if needed
    if (cropBox.rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((cropBox.rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    ctx.drawImage(
      img,
      cropBox.x * scaleX,
      cropBox.y * scaleY,
      cropBox.width * scaleX,
      cropBox.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        onCropComplete(croppedUrl);
      }
    }, 'image/png', 1);
  };

  return (
    <div className="bg-black/90 rounded-lg p-4 space-y-4">
      {/* Crop Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Crop Image</h3>
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
            onClick={onCancel}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image with Crop Overlay */}
      <div 
        ref={containerRef}
        className="relative bg-gray-900 rounded-lg overflow-hidden"
        style={{ aspectRatio: '4/3', minHeight: '300px' }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Crop preview"
          className="w-full h-full object-contain"
          style={{ transform: `scale(${zoom})` }}
        />

        {/* Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        )}

        {/* Crop Box */}
        <div
          className="absolute border-2 border-crd-green shadow-lg"
          style={{
            left: cropBox.x,
            top: cropBox.y,
            width: cropBox.width,
            height: cropBox.height,
            transform: `rotate(${cropBox.rotation}deg)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'drag')}
        >
          {/* Corner Handles */}
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green border border-white cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, 'resize');
            }}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-crd-green border border-white cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, 'resize');
            }}
          />
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-crd-green border border-white cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, 'resize');
            }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-crd-green border border-white cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e, 'resize');
            }}
          />

          {/* Center Move Handle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-crd-green/80 rounded-full p-1 pointer-events-auto cursor-move">
              <Move className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        {/* Overlay Dimming */}
        <div 
          className="absolute inset-0 bg-black/50 pointer-events-none"
          style={{
            clipPath: `polygon(0% 0%, 0% 100%, ${cropBox.x}px 100%, ${cropBox.x}px ${cropBox.y}px, ${cropBox.x + cropBox.width}px ${cropBox.y}px, ${cropBox.x + cropBox.width}px ${cropBox.y + cropBox.height}px, ${cropBox.x}px ${cropBox.y + cropBox.height}px, ${cropBox.x}px 100%, 100% 100%, 100% 0%)`
          }}
        />
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Zoom Control */}
        <div className="flex items-center gap-3">
          <ZoomIn className="w-4 h-4 text-white" />
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={0.5}
            max={2}
            step={0.1}
            className="flex-1"
          />
          <span className="text-white text-sm min-w-[40px]">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Rotation Control */}
        <div className="flex items-center gap-3">
          <RotateCw className="w-4 h-4 text-white" />
          <Slider
            value={[cropBox.rotation]}
            onValueChange={(value) => setCropBox(prev => ({ ...prev, rotation: value[0] }))}
            min={-45}
            max={45}
            step={1}
            className="flex-1"
          />
          <span className="text-white text-sm min-w-[40px]">{cropBox.rotation}°</span>
        </div>

        {/* Apply Button */}
        <Button
          onClick={applyCrop}
          className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          <Check className="w-4 h-4 mr-2" />
          Apply Crop
        </Button>
      </div>
    </div>
  );
};
