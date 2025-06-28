
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RotateCw, Move, Crop, Download, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ImageCropEditorProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export const ImageCropEditor: React.FC<ImageCropEditorProps> = ({
  imageUrl,
  onCropComplete,
  onCancel,
  aspectRatio = 2.5 / 3.5 // Standard trading card ratio
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 280 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageAdjustments, setImageAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0
  });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      // Initialize crop area to center of image
      const width = Math.min(img.width * 0.8, img.height * aspectRatio * 0.8);
      const height = width / aspectRatio;
      setCropArea({
        x: (img.width - width) / 2,
        y: (img.height - height) / 2,
        width,
        height
      });
    };
    img.src = imageUrl;
  }, [imageUrl, aspectRatio]);

  useEffect(() => {
    drawCanvas();
  }, [image, cropArea, imageAdjustments]);

  const drawCanvas = () => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fit container while maintaining aspect ratio
    const containerWidth = 600;
    const containerHeight = 400;
    const scale = Math.min(containerWidth / image.width, containerHeight / image.height);
    
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    // Apply image adjustments
    ctx.filter = `brightness(${imageAdjustments.brightness}%) contrast(${imageAdjustments.contrast}%) saturate(${imageAdjustments.saturation}%)`;
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Reset filter for overlay
    ctx.filter = 'none';
    
    // Draw crop overlay
    const scaledCrop = {
      x: cropArea.x * scale,
      y: cropArea.y * scale,
      width: cropArea.width * scale,
      height: cropArea.height * scale
    };
    
    // Dark overlay outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear crop area
    ctx.clearRect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height);
    
    // Redraw image in crop area
    ctx.save();
    ctx.rect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height);
    ctx.clip();
    ctx.filter = `brightness(${imageAdjustments.brightness}%) contrast(${imageAdjustments.contrast}%) saturate(${imageAdjustments.saturation}%)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Draw crop border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height);
    
    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(scaledCrop.x - handleSize/2, scaledCrop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(scaledCrop.x + scaledCrop.width - handleSize/2, scaledCrop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(scaledCrop.x - handleSize/2, scaledCrop.y + scaledCrop.height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(scaledCrop.x + scaledCrop.width - handleSize/2, scaledCrop.y + scaledCrop.height - handleSize/2, handleSize, handleSize);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scale = canvas.width / image.width;
    const scaledCrop = {
      x: cropArea.x * scale,
      y: cropArea.y * scale,
      width: cropArea.width * scale,
      height: cropArea.height * scale
    };
    
    // Check if clicking inside crop area
    if (x >= scaledCrop.x && x <= scaledCrop.x + scaledCrop.width &&
        y >= scaledCrop.y && y <= scaledCrop.y + scaledCrop.height) {
      setIsDragging(true);
      setDragStart({ x: x - scaledCrop.x, y: y - scaledCrop.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scale = canvas.width / image.width;
    const newX = Math.max(0, Math.min((x - dragStart.x) / scale, image.width - cropArea.width));
    const newY = Math.max(0, Math.min((y - dragStart.y) / scale, image.height - cropArea.height));
    
    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    if (!image) return;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Set output size (standard card dimensions)
      canvas.width = 300;
      canvas.height = 420;
      
      // Apply image adjustments
      ctx.filter = `brightness(${imageAdjustments.brightness}%) contrast(${imageAdjustments.contrast}%) saturate(${imageAdjustments.saturation}%)`;
      
      // Draw cropped area
      ctx.drawImage(
        image,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, canvas.width, canvas.height
      );
      
      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(croppedUrl);
          toast.success('Image cropped successfully!');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Crop failed:', error);
      toast.error('Failed to crop image');
    }
  };

  const resetCrop = () => {
    if (!image) return;
    const width = Math.min(image.width * 0.8, image.height * aspectRatio * 0.8);
    const height = width / aspectRatio;
    setCropArea({
      x: (image.width - width) / 2,
      y: (image.height - height) / 2,
      width,
      height
    });
  };

  const resetAdjustments = () => {
    setImageAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      rotation: 0
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-900 rounded-lg">
      {/* Canvas Area */}
      <div className="flex-1">
        <div className="bg-gray-800 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-96 border border-gray-600 rounded cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="w-full lg:w-80 space-y-6">
        {/* Image Adjustments */}
        <Card className="p-4 bg-gray-800 border-gray-600">
          <h3 className="text-white font-semibold mb-4">Image Adjustments</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white text-sm">Brightness</Label>
              <Slider
                value={[imageAdjustments.brightness]}
                onValueChange={([value]) => setImageAdjustments(prev => ({ ...prev, brightness: value }))}
                min={50}
                max={150}
                step={1}
                className="mt-2"
              />
              <span className="text-gray-400 text-xs">{imageAdjustments.brightness}%</span>
            </div>
            
            <div>
              <Label className="text-white text-sm">Contrast</Label>
              <Slider
                value={[imageAdjustments.contrast]}
                onValueChange={([value]) => setImageAdjustments(prev => ({ ...prev, contrast: value }))}
                min={50}
                max={150}
                step={1}
                className="mt-2"
              />
              <span className="text-gray-400 text-xs">{imageAdjustments.contrast}%</span>
            </div>
            
            <div>
              <Label className="text-white text-sm">Saturation</Label>
              <Slider
                value={[imageAdjustments.saturation]}
                onValueChange={([value]) => setImageAdjustments(prev => ({ ...prev, saturation: value }))}
                min={0}
                max={200}
                step={1}
                className="mt-2"
              />
              <span className="text-gray-400 text-xs">{imageAdjustments.saturation}%</span>
            </div>
          </div>

          <Button
            onClick={resetAdjustments}
            variant="outline"
            size="sm"
            className="w-full mt-4 border-gray-600 text-white"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Reset Adjustments
          </Button>
        </Card>

        {/* Crop Controls */}
        <Card className="p-4 bg-gray-800 border-gray-600">
          <h3 className="text-white font-semibold mb-4">Crop Controls</h3>
          
          <div className="space-y-3">
            <Button
              onClick={resetCrop}
              variant="outline"
              className="w-full border-gray-600 text-white"
            >
              <Crop className="w-4 h-4 mr-2" />
              Reset Crop Area
            </Button>
            
            <div className="text-xs text-gray-400">
              <p>• Drag the crop area to reposition</p>
              <p>• Crop maintains card aspect ratio</p>
              <p>• Adjust image before cropping</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-600 text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleCrop}
            className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
};
