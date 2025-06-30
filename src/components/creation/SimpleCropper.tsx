
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crop, RotateCw, Move, ZoomIn, ZoomOut } from 'lucide-react';

interface SimpleCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export const SimpleCropper: React.FC<SimpleCropperProps> = ({
  imageUrl,
  onCropComplete,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 250, height: 350 }); // 2.5:3.5 ratio
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        // Auto-center the crop area
        const img = imageRef.current!;
        const containerWidth = 400;
        const containerHeight = 300;
        
        const centerX = (containerWidth - cropArea.width) / 2;
        const centerY = (containerHeight - cropArea.height) / 2;
        
        setCropArea(prev => ({
          ...prev,
          x: Math.max(0, centerX),
          y: Math.max(0, centerY)
        }));
      };
    }
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropArea.x, y: e.clientY - cropArea.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(400 - prev.width, newX)),
      y: Math.max(0, Math.min(300 - prev.height, newY))
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to card dimensions
    canvas.width = 250;
    canvas.height = 350;
    
    // Calculate source dimensions
    const scaleX = img.naturalWidth / (400 * scale);
    const scaleY = img.naturalHeight / (300 * scale);
    
    // Draw cropped image
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      250,
      350
    );
    
    // Convert to blob and call onCropComplete
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        onCropComplete(croppedUrl);
      }
    }, 'image/png', 0.9);
  };

  return (
    <Card className="p-6 theme-bg-secondary">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold theme-text-primary mb-2">Crop Your Image</h3>
          <p className="text-sm theme-text-muted">Drag the crop area to position your image within the card boundaries</p>
        </div>

        {/* Crop Interface */}
        <div className="relative mx-auto" style={{ width: '400px', height: '300px' }}>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            className="w-full h-full object-cover rounded"
            style={{ transform: `scale(${scale})` }}
          />
          
          {/* Crop Overlay */}
          <div
            className="absolute border-2 border-crd-green bg-crd-green/10 cursor-move"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-crd-green/80 text-black px-2 py-1 rounded text-xs font-medium">
                2.5" × 3.5"
              </div>
            </div>
          </div>
          
          {/* Grid Lines */}
          <div 
            className="absolute border border-dashed border-white/30 pointer-events-none"
            style={{
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            }}
          >
            <div className="absolute w-full h-px bg-white/20 top-1/3"></div>
            <div className="absolute w-full h-px bg-white/20 top-2/3"></div>
            <div className="absolute h-full w-px bg-white/20 left-1/3"></div>
            <div className="absolute h-full w-px bg-white/20 left-2/3"></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm theme-text-muted">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.min(2, scale + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleCrop} className="bg-crd-green hover:bg-crd-green/90 text-black">
              <Crop className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
};
