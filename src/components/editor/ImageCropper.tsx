
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crop, RotateCw, Download, Target } from 'lucide-react';
import { toast } from 'sonner';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string, originalFile?: File) => void;
  aspectRatio?: number; // width/height ratio, defaults to free crop
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio,
  className = ''
}) => {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart initial crop detection
  const detectInitialCrop = useCallback((img: HTMLImageElement) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    // Get displayed image dimensions
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    let cropWidth, cropHeight;

    if (aspectRatio) {
      // Use provided aspect ratio (e.g., 2.5/3.5 for trading cards)
      cropWidth = Math.min(displayWidth * 0.6, displayHeight * aspectRatio * 0.6);
      cropHeight = cropWidth / aspectRatio;
      
      // Adjust if height is too large
      if (cropHeight > displayHeight * 0.8) {
        cropHeight = displayHeight * 0.8;
        cropWidth = cropHeight * aspectRatio;
      }
    } else {
      // Default to center 60% of image
      cropWidth = displayWidth * 0.6;
      cropHeight = displayHeight * 0.6;
    }

    // Center the crop
    const x = (displayWidth - cropWidth) / 2;
    const y = (displayHeight - cropHeight) / 2;

    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropWidth, displayWidth),
      height: Math.min(cropHeight, displayHeight)
    });
  }, [aspectRatio]);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      detectInitialCrop(imageRef.current);
      setImageLoaded(true);
    }
  }, [detectInitialCrop]);

  // Auto-fit functionality
  const autoFitRectangle = useCallback(() => {
    if (!imageRef.current) return;

    // Simple edge detection for auto-fit
    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    // For now, use smart defaults based on aspect ratio
    let cropWidth, cropHeight;
    
    if (aspectRatio) {
      // Trading card optimization
      cropWidth = Math.min(displayWidth * 0.7, displayHeight * aspectRatio * 0.7);
      cropHeight = cropWidth / aspectRatio;
    } else {
      // General rectangle detection
      cropWidth = displayWidth * 0.8;
      cropHeight = displayHeight * 0.6;
    }

    // Ensure it fits
    if (cropHeight > displayHeight * 0.9) {
      cropHeight = displayHeight * 0.9;
      cropWidth = aspectRatio ? cropHeight * aspectRatio : cropWidth;
    }

    const x = (displayWidth - cropWidth) / 2;
    const y = (displayHeight - cropHeight) / 2;

    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropWidth, displayWidth),
      height: Math.min(cropHeight, displayHeight)
    });

    toast.success('Auto-fit applied');
  }, [aspectRatio]);

  // Mouse event handlers for crop manipulation
  const handleMouseDown = useCallback((e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle || 'move');
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const img = imageRef.current;

    setCropArea(prev => {
      let newCrop = { ...prev };

      switch (dragHandle) {
        case 'move':
          newCrop.x = Math.max(0, Math.min(prev.x + deltaX, img.clientWidth - prev.width));
          newCrop.y = Math.max(0, Math.min(prev.y + deltaY, img.clientHeight - prev.height));
          break;
        
        case 'tl': // Top-left
          newCrop.x = Math.max(0, prev.x + deltaX);
          newCrop.y = Math.max(0, prev.y + deltaY);
          newCrop.width = prev.width - deltaX;
          newCrop.height = prev.height - deltaY;
          break;
        
        case 'tr': // Top-right
          newCrop.y = Math.max(0, prev.y + deltaY);
          newCrop.width = prev.width + deltaX;
          newCrop.height = prev.height - deltaY;
          break;
        
        case 'bl': // Bottom-left
          newCrop.x = Math.max(0, prev.x + deltaX);
          newCrop.width = prev.width - deltaX;
          newCrop.height = prev.height + deltaY;
          break;
        
        case 'br': // Bottom-right
          newCrop.width = prev.width + deltaX;
          newCrop.height = prev.height + deltaY;
          break;
      }

      // Ensure minimum size
      newCrop.width = Math.max(50, newCrop.width);
      newCrop.height = Math.max(50, newCrop.height);

      // Ensure within bounds
      newCrop.width = Math.min(newCrop.width, img.clientWidth - newCrop.x);
      newCrop.height = Math.min(newCrop.height, img.clientHeight - newCrop.y);

      // Maintain aspect ratio if required
      if (aspectRatio && dragHandle !== 'move') {
        if (dragHandle?.includes('r')) {
          newCrop.height = newCrop.width / aspectRatio;
        } else {
          newCrop.width = newCrop.height * aspectRatio;
        }
      }

      return newCrop;
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragHandle, dragStart, aspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Extract the cropped area
  const extractCrop = useCallback(async () => {
    if (!imageRef.current || !imageLoaded) {
      toast.error('Image not ready');
      return;
    }

    setExtracting(true);
    
    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Calculate scale factors between display and natural image size
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      // Convert display coordinates to natural image coordinates
      const sourceX = cropArea.x * scaleX;
      const sourceY = cropArea.y * scaleY;
      const sourceWidth = cropArea.width * scaleX;
      const sourceHeight = cropArea.height * scaleY;

      // Set canvas dimensions for high quality output
      const outputWidth = Math.min(1200, sourceWidth); // Cap at reasonable size
      const outputHeight = Math.min(1600, sourceHeight);
      
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Draw the cropped area
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, outputWidth, outputHeight
      );

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(croppedUrl);
          toast.success('Crop extracted successfully!');
        }
      }, 'image/png', 0.95);

    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Failed to extract crop');
    } finally {
      setExtracting(false);
    }
  }, [cropArea, imageLoaded, onCropComplete]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={autoFitRectangle}
          variant="outline"
          size="sm"
          disabled={!imageLoaded}
        >
          <Target className="w-4 h-4 mr-2" />
          Auto-Fit
        </Button>
        
        <Button
          onClick={extractCrop}
          disabled={!imageLoaded || extracting}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          {extracting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              Extracting...
            </>
          ) : (
            <>
              <Crop className="w-4 h-4 mr-2" />
              Extract Crop
            </>
          )}
        </Button>

        {aspectRatio && (
          <div className="text-sm text-crd-lightGray">
            Aspect Ratio: {aspectRatio.toFixed(2)}:1
          </div>
        )}
      </div>

      {/* Image and Crop Area */}
      <Card className="relative overflow-hidden bg-editor-dark border-editor-border">
        <div ref={containerRef} className="relative">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop source"
            className="max-w-full max-h-[600px] w-auto h-auto"
            onLoad={handleImageLoad}
            draggable={false}
          />
          
          {/* Crop Overlay */}
          {imageLoaded && (
            <div className="absolute inset-0">
              {/* Darkened areas outside crop */}
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              
              {/* Crop area */}
              <div
                className="absolute border-2 border-crd-green cursor-move"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'move')}
              >
                {/* Corner handles */}
                {['tl', 'tr', 'bl', 'br'].map((handle) => (
                  <div
                    key={handle}
                    className="absolute w-3 h-3 bg-crd-green border border-white cursor-pointer hover:bg-crd-green/80"
                    style={{
                      top: handle.includes('t') ? -6 : 'auto',
                      bottom: handle.includes('b') ? -6 : 'auto',
                      left: handle.includes('l') ? -6 : 'auto',
                      right: handle.includes('r') ? -6 : 'auto',
                      cursor: handle === 'tl' || handle === 'br' ? 'nw-resize' : 'ne-resize'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, handle)}
                  />
                ))}
                
                {/* Crop info */}
                <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
