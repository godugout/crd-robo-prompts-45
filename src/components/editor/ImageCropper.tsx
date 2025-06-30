
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, ZoomIn, ZoomOut, Move, Crop } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number; // width/height ratio
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio = 3/4
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 300, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (imageRef.current) {
      drawCanvas();
    }
  }, [scale, rotation, position, cropArea]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(position.x, position.y);

    // Draw image
    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;
    ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

    // Restore context
    ctx.restore();

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw crop border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    // Move crop area
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + deltaX, canvas.width - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY, canvas.height - prev.height))
    }));

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    // Set crop canvas size based on aspect ratio
    const cropWidth = 300;
    const cropHeight = cropWidth / aspectRatio;
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;

    // Get the image data from the crop area
    const imageData = canvas.getContext('2d')?.getImageData(
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height
    );

    if (imageData) {
      // Create temporary canvas to hold the crop area
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = cropArea.width;
      tempCanvas.height = cropArea.height;
      
      if (tempCtx) {
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw the cropped area to the final canvas, scaled to fit
        cropCtx.drawImage(tempCanvas, 0, 0, cropWidth, cropHeight);
      }
    }

    // Convert to blob and call onCropComplete
    cropCanvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        onCropComplete(croppedUrl);
      }
    }, 'image/png');
  };

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setCropArea({ x: 150, y: 100, width: 300, height: 400 });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border border-crd-mediumGray rounded-lg cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop source"
              className="hidden"
              onLoad={drawCanvas}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="w-64 p-4 border-l border-editor-border space-y-6">
          <div>
            <h4 className="text-white font-medium mb-3">Transform</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-crd-lightGray mb-2 block">Scale</label>
                <Slider
                  value={[scale]}
                  onValueChange={([value]) => setScale(value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-crd-lightGray">{scale.toFixed(1)}x</span>
              </div>
              
              <div>
                <label className="text-sm text-crd-lightGray mb-2 block">Rotation</label>
                <Slider
                  value={[rotation]}
                  onValueChange={([value]) => setRotation(value)}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-crd-lightGray">{rotation}°</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => setScale(prev => Math.min(prev + 0.1, 3))}
              variant="outline"
              size="sm"
              className="w-full border-crd-mediumGray text-white"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom In
            </Button>
            
            <Button
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
              variant="outline"
              size="sm"
              className="w-full border-crd-mediumGray text-white"
            >
              <ZoomOut className="w-4 h-4 mr-2" />
              Zoom Out
            </Button>
            
            <Button
              onClick={() => setRotation(prev => prev + 90)}
              variant="outline"
              size="sm"
              className="w-full border-crd-mediumGray text-white"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Rotate 90°
            </Button>
            
            <Button
              onClick={resetTransform}
              variant="outline"
              size="sm"
              className="w-full border-crd-mediumGray text-white"
            >
              Reset
            </Button>
          </div>

          <div className="pt-4 border-t border-editor-border">
            <Button
              onClick={handleCrop}
              className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            >
              <Crop className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
