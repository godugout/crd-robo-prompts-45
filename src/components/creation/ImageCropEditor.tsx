import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Canvas as FabricCanvas, FabricImage, Rect } from 'fabric';
import { RotateCw, RotateCcw, Check, X, Move, RotateCcw as Reset } from 'lucide-react';
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
  aspectRatio = 2.5 / 3.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [brightness, setBrightness] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [saturation, setSaturation] = useState([0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);

  // Initialize canvas and load image
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8f9fa',
      selection: false
    });

    setFabricCanvas(canvas);

    // Load the image
    FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        // Scale image to fit canvas while maintaining aspect ratio
        const canvasWidth = canvas.width || 800;
        const canvasHeight = canvas.height || 600;
        const imgAspectRatio = img.width! / img.height!;
        const canvasAspectRatio = canvasWidth / canvasHeight;

        let scaleFactor;
        if (imgAspectRatio > canvasAspectRatio) {
          scaleFactor = (canvasWidth * 0.8) / img.width!;
        } else {
          scaleFactor = (canvasHeight * 0.8) / img.height!;
        }

        img.scale(scaleFactor);
        img.set({
          left: (canvasWidth - img.getScaledWidth()) / 2,
          top: (canvasHeight - img.getScaledHeight()) / 2,
          selectable: false,
          evented: false
        });

        canvas.add(img);
        setOriginalImage(img);

        // Create initial crop rectangle
        const cropWidth = Math.min(200, img.getScaledWidth() * 0.8);
        const cropHeight = cropWidth / aspectRatio;

        const rect = new Rect({
          left: img.left! + (img.getScaledWidth() - cropWidth) / 2,
          top: img.top! + (img.getScaledHeight() - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight,
          fill: 'transparent',
          stroke: '#10b981',
          strokeWidth: 2,
          strokeDashArray: [10, 5],
          selectable: true,
          evented: true,
          lockRotation: false,
          hasRotatingPoint: true,
          rotatingPointOffset: 30
        });

        // Add resize controls
        rect.setControlsVisibility({
          tl: true, tr: true, bl: true, br: true,
          ml: false, mt: false, mr: false, mb: false,
          mtr: true
        });

        // Custom control behavior to maintain aspect ratio
        rect.on('scaling', function(e) {
          const target = e.target as Rect;
          const pointer = canvas.getPointer(e.e);
          const currentWidth = target.width! * target.scaleX!;
          const currentHeight = target.height! * target.scaleY!;
          
          // Maintain aspect ratio during scaling
          const newWidth = currentWidth;
          const newHeight = newWidth / aspectRatio;
          
          target.set({
            scaleX: newWidth / target.width!,
            scaleY: newHeight / target.height!
          });
          
          canvas.renderAll();
        });

        // Constrain movement within image bounds
        rect.on('moving', function(e) {
          const target = e.target as Rect;
          const imgBounds = originalImage!.getBoundingRect();
          const rectBounds = target.getBoundingRect();
          
          // Keep crop within image bounds
          if (rectBounds.left < imgBounds.left) {
            target.set('left', target.left! + (imgBounds.left - rectBounds.left));
          }
          if (rectBounds.top < imgBounds.top) {
            target.set('top', target.top! + (imgBounds.top - rectBounds.top));
          }
          if (rectBounds.left + rectBounds.width > imgBounds.left + imgBounds.width) {
            target.set('left', target.left! - ((rectBounds.left + rectBounds.width) - (imgBounds.left + imgBounds.width)));
          }
          if (rectBounds.top + rectBounds.height > imgBounds.top + imgBounds.height) {
            target.set('top', target.top! - ((rectBounds.top + rectBounds.height) - (imgBounds.top + imgBounds.height)));
          }
        });

        canvas.add(rect);
        setCropRect(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
      })
      .catch((error) => {
        console.error('Failed to load image:', error);
        toast.error('Failed to load image');
      });

    return () => {
      canvas.dispose();
    };
  }, [imageUrl, aspectRatio]);

  // Apply image adjustments
  useEffect(() => {
    if (!originalImage || !fabricCanvas) return;

    const brightnessValue = brightness[0];
    const contrastValue = contrast[0];
    const saturationValue = saturation[0];

    // Apply filters
    const filters: any[] = [];
    
    if (brightnessValue !== 0) {
      filters.push(new (window as any).fabric.Image.filters.Brightness({
        brightness: brightnessValue / 100
      }));
    }
    
    if (contrastValue !== 0) {
      filters.push(new (window as any).fabric.Image.filters.Contrast({
        contrast: contrastValue / 100
      }));
    }
    
    if (saturationValue !== 0) {
      filters.push(new (window as any).fabric.Image.filters.Saturation({
        saturation: saturationValue / 100
      }));
    }

    originalImage.filters = filters;
    originalImage.applyFilters();
    fabricCanvas.renderAll();
  }, [brightness, contrast, saturation, originalImage, fabricCanvas]);

  const handleRotateImage = (degrees: number) => {
    if (!originalImage || !fabricCanvas) return;
    
    const newRotation = imageRotation + degrees;
    setImageRotation(newRotation);
    
    originalImage.set('angle', newRotation);
    fabricCanvas.renderAll();
  };

  const handleResetRotation = () => {
    if (!originalImage || !fabricCanvas) return;
    
    setImageRotation(0);
    originalImage.set('angle', 0);
    fabricCanvas.renderAll();
  };

  const handleCropComplete = async () => {
    if (!fabricCanvas || !originalImage || !cropRect) {
      toast.error('No crop area selected');
      return;
    }

    setIsProcessing(true);

    try {
      // Get crop bounds
      const cropBounds = cropRect.getBoundingRect();
      const imageBounds = originalImage.getBoundingRect();
      
      // Calculate relative crop position
      const relativeX = (cropBounds.left - imageBounds.left) / originalImage.scaleX!;
      const relativeY = (cropBounds.top - imageBounds.top) / originalImage.scaleY!;
      const relativeWidth = cropBounds.width / originalImage.scaleX!;
      const relativeHeight = cropBounds.height / originalImage.scaleY!;

      // Create temporary canvas for cropping
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas size to crop dimensions (standard card size)
      tempCanvas.width = 300;
      tempCanvas.height = 420;

      // Load original image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Apply rotation if needed
        if (imageRotation !== 0) {
          tempCtx.save();
          tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
          tempCtx.rotate((imageRotation * Math.PI) / 180);
          tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        }

        // Draw cropped region
        tempCtx.drawImage(
          img,
          relativeX, relativeY, relativeWidth, relativeHeight,
          0, 0, tempCanvas.width, tempCanvas.height
        );

        if (imageRotation !== 0) {
          tempCtx.restore();
        }

        // Convert to blob and create URL
        tempCanvas.toBlob((blob) => {
          if (blob) {
            const croppedUrl = URL.createObjectURL(blob);
            onCropComplete(croppedUrl);
            toast.success('Image cropped successfully!');
          } else {
            toast.error('Failed to create cropped image');
          }
          setIsProcessing(false);
        }, 'image/png', 1.0);
      };

      img.onerror = () => {
        toast.error('Failed to process image');
        setIsProcessing(false);
      };

      img.src = imageUrl;

    } catch (error) {
      console.error('Crop failed:', error);
      toast.error('Failed to crop image');
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* Main Canvas Area */}
      <div className="flex-1 p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">Crop & Edit Image</h2>
          <p className="text-gray-400">Drag to move, resize corners, or rotate the crop frame</p>
        </div>
        
        <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-900">
          <canvas ref={canvasRef} className="block" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-gray-600 text-gray-300"
            disabled={isProcessing}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Button
            onClick={handleCropComplete}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Apply Crop
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-80 bg-gray-800/50 border-l border-gray-600 p-6 space-y-6">
        {/* Rotation Controls */}
        <Card className="p-4 bg-gray-800/50 border-gray-600">
          <h3 className="text-white font-medium mb-4">Image Rotation</h3>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => handleRotateImage(-15)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleRotateImage(15)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleResetRotation}
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Reset className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-400">
            Rotation: {imageRotation}°
          </div>
        </Card>

        {/* Image Adjustments */}
        <Card className="p-4 bg-gray-800/50 border-gray-600">
          <h3 className="text-white font-medium mb-4">Image Adjustments</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white text-sm mb-2 block">
                Brightness: {brightness[0]}
              </Label>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                min={-50}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">
                Contrast: {contrast[0]}
              </Label>
              <Slider
                value={contrast}
                onValueChange={setContrast}
                min={-50}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-white text-sm mb-2 block">
                Saturation: {saturation[0]}
              </Label>
              <Slider
                value={saturation}
                onValueChange={setSaturation}
                min={-50}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Crop Info */}
        <Card className="p-4 bg-gray-800/50 border-gray-600">
          <h3 className="text-white font-medium mb-2">Crop Settings</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <div>Aspect Ratio: {aspectRatio.toFixed(2)}:1</div>
            <div>Output Size: 300×420px</div>
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="flex items-center gap-2 text-xs">
                <Move className="w-3 h-3" />
                Drag to move crop area
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <div className="w-3 h-3 border border-gray-400 rounded-sm" />
                Drag corners to resize
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <RotateCw className="w-3 h-3" />
                Use rotation handle to rotate
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
