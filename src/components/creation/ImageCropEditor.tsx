
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Rect, FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { RotateCcw, RotateCw, Move, Square, Check, X } from 'lucide-react';
import { exportCroppedImage } from '@/utils/cropUtils';

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
  const [imageRotation, setImageRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
      selection: false
    });

    setFabricCanvas(canvas);

    // Load the image
    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      // Scale image to fit canvas
      const scale = Math.min(
        (canvas.width! * 0.8) / img.width!,
        (canvas.height! * 0.8) / img.height!
      );
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        selectable: false
      });

      canvas.add(img);
      setOriginalImage(img);

      // Create crop rectangle
      const cropWidth = img.width! * scale * 0.6;
      const cropHeight = cropWidth / aspectRatio;
      
      const rect = new Rect({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        width: cropWidth,
        height: cropHeight,
        fill: 'transparent',
        stroke: '#00ff00',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        originX: 'center',
        originY: 'center',
        lockRotation: false,
        hasControls: true,
        hasBorders: true,
        cornerStyle: 'circle',
        cornerSize: 12,
        borderColor: '#00ff00',
        cornerColor: '#00ff00'
      });

      canvas.add(rect);
      setCropRect(rect);
      canvas.setActiveObject(rect);
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, [imageUrl, aspectRatio]);

  // Handle crop rectangle transform events
  useEffect(() => {
    if (!fabricCanvas || !cropRect) return;

    const handleScaling = (e: any) => {
      const target = e.transform?.target || e.target;
      if (target === cropRect) {
        // Maintain aspect ratio during scaling
        const newWidth = target.width * target.scaleX;
        const newHeight = newWidth / aspectRatio;
        
        target.set({
          height: newHeight / target.scaleY,
          scaleY: target.scaleX
        });
        
        fabricCanvas.renderAll();
      }
    };

    const handleRotating = (e: any) => {
      const target = e.transform?.target || e.target;
      if (target === cropRect) {
        fabricCanvas.renderAll();
      }
    };

    fabricCanvas.on('object:scaling', handleScaling);
    fabricCanvas.on('object:rotating', handleRotating);

    return () => {
      fabricCanvas.off('object:scaling', handleScaling);
      fabricCanvas.off('object:rotating', handleRotating);
    };
  }, [fabricCanvas, cropRect, aspectRatio]);

  // Apply image adjustments
  useEffect(() => {
    if (!originalImage || !fabricCanvas) return;

    const filters = [];
    
    if (brightness[0] !== 0) {
      filters.push(new fabric.filters.Brightness({ brightness: brightness[0] / 100 }));
    }
    
    if (contrast[0] !== 0) {
      filters.push(new fabric.filters.Contrast({ contrast: contrast[0] / 100 }));
    }
    
    if (saturation[0] !== 0) {
      filters.push(new fabric.filters.Saturation({ saturation: saturation[0] / 100 }));
    }

    originalImage.filters = filters;
    originalImage.applyFilters();
    fabricCanvas.renderAll();
  }, [brightness, contrast, saturation, originalImage, fabricCanvas]);

  const handleImageRotation = (degrees: number) => {
    if (!originalImage || !fabricCanvas) return;
    
    const newRotation = imageRotation + degrees;
    setImageRotation(newRotation);
    
    originalImage.set({ angle: newRotation });
    fabricCanvas.renderAll();
  };

  const handleCropComplete = async () => {
    if (!fabricCanvas || !cropRect || !originalImage) return;

    setIsProcessing(true);
    
    try {
      const croppedImageUrl = await exportCroppedImage(fabricCanvas, cropRect, originalImage);
      onCropComplete(croppedImageUrl);
    } catch (error) {
      console.error('Failed to crop image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAdjustments = () => {
    setBrightness([0]);
    setContrast([0]);
    setSaturation([0]);
    setImageRotation(0);
    
    if (originalImage) {
      originalImage.set({ angle: 0 });
      originalImage.filters = [];
      originalImage.applyFilters();
      fabricCanvas?.renderAll();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Crop & Edit Image</h2>
        <p className="text-gray-400">Adjust your image and crop to the perfect size</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border border-gray-600 rounded-lg shadow-lg bg-gray-100"
            />
            
            {/* Instructions Overlay */}
            <div className="absolute top-4 left-4 bg-black/75 text-white p-3 rounded-lg text-sm max-w-xs">
              <div className="space-y-1">
                <p>• Drag corners to resize crop area</p>
                <p>• Drag rotation handle to rotate</p>
                <p>• Drag to move crop area</p>
                <p>• Use controls to adjust image</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 bg-gray-800/50 border-l border-gray-600 p-6 space-y-6">
          {/* Image Rotation */}
          <Card className="bg-gray-700/50 border-gray-600 p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <RotateCw className="w-4 h-4" />
              Image Rotation
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => handleImageRotation(-90)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <RotateCcw className="w-4 h-4" />
                -90°
              </Button>
              <Button
                onClick={() => handleImageRotation(90)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <RotateCw className="w-4 h-4" />
                +90°
              </Button>
            </div>
          </Card>

          {/* Image Adjustments */}
          <Card className="bg-gray-700/50 border-gray-600 p-4">
            <h3 className="text-white font-semibold mb-4">Image Adjustments</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">
                  Brightness: {brightness[0]}%
                </label>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">
                  Contrast: {contrast[0]}%
                </label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">
                  Saturation: {saturation[0]}%
                </label>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button
                onClick={resetAdjustments}
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-gray-300"
              >
                Reset Adjustments
              </Button>
            </div>
          </Card>

          {/* Crop Instructions */}
          <Card className="bg-gray-700/50 border-gray-600 p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Square className="w-4 h-4" />
              Crop Controls
            </h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• <strong>Resize:</strong> Drag corner handles</p>
              <p>• <strong>Rotate:</strong> Drag rotation handle</p>
              <p>• <strong>Move:</strong> Drag crop area</p>
              <p>• <strong>Aspect Ratio:</strong> Maintained automatically</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-700 flex justify-between">
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-gray-600 text-gray-300"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>

        <Button
          onClick={handleCropComplete}
          disabled={isProcessing}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {isProcessing ? 'Processing...' : 'Apply Crop'}
        </Button>
      </div>
    </div>
  );
};
