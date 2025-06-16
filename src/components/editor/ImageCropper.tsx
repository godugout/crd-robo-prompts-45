
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Crop } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio = 2.5 / 3.5,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200 / aspectRatio
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const containerWidth = Math.min(img.naturalWidth, 400);
      const containerHeight = containerWidth / aspectRatio;
      
      setCrop({
        x: (img.naturalWidth - containerWidth) / 2,
        y: (img.naturalHeight - containerHeight) / 2,
        width: containerWidth,
        height: containerHeight
      });
      setImageLoaded(true);
    }
  }, [aspectRatio]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + deltaX, imageRef.current!.naturalWidth - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY, imageRef.current!.naturalHeight - prev.height))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      img,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedImageUrl = URL.createObjectURL(blob);
        onCropComplete(croppedImageUrl);
      }
    }, 'image/png');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative inline-block">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Crop preview"
          className="max-w-full max-h-96 object-contain"
          onLoad={handleImageLoad}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {imageLoaded && (
          <div
            className="absolute border-2 border-crd-green bg-crd-green/20 cursor-move"
            style={{
              left: `${(crop.x / imageRef.current!.naturalWidth) * imageRef.current!.clientWidth}px`,
              top: `${(crop.y / imageRef.current!.naturalHeight) * imageRef.current!.clientHeight}px`,
              width: `${(crop.width / imageRef.current!.naturalWidth) * imageRef.current!.clientWidth}px`,
              height: `${(crop.height / imageRef.current!.naturalHeight) * imageRef.current!.clientHeight}px`
            }}
          />
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleCrop}
          disabled={!imageLoaded}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Crop className="w-4 h-4 mr-2" />
          Apply Crop
        </Button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
