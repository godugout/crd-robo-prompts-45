
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage, Rect, util } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCw, Check, X, Move, RotateCcw } from 'lucide-react';
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
  aspectRatio = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);

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
      if (!img) return;

      // Scale image to fit canvas
      const canvasWidth = 800;
      const canvasHeight = 600;
      const imageAspect = img.width! / img.height!;
      const canvasAspect = canvasWidth / canvasHeight;

      let scaleFactor;
      if (imageAspect > canvasAspect) {
        scaleFactor = canvasWidth / img.width!;
      } else {
        scaleFactor = canvasHeight / img.height!;
      }

      img.scale(scaleFactor * 0.8);
      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });

      canvas.add(img);
      setOriginalImage(img);

      // Create crop rectangle
      const cropWidth = Math.min(200, img.getScaledWidth());
      const cropHeight = cropWidth / aspectRatio;

      const rect = new Rect({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        width: cropWidth,
        height: cropHeight,
        fill: 'transparent',
        stroke: '#00ff00',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        originX: 'center',
        originY: 'center',
        selectable: true,
        evented: true,
        hasRotatingPoint: true,
        transparentCorners: false,
        cornerColor: '#00ff00',
        cornerSize: 12,
        borderColor: '#00ff00'
      });

      // Lock aspect ratio during scaling
      rect.on('scaling', () => {
        if (aspectRatio !== 1) {
          const newWidth = rect.width! * rect.scaleX!;
          const newHeight = newWidth / aspectRatio;
          rect.set({
            height: newHeight / rect.scaleY!
          });
        }
      });

      // Update crop rect state when modified
      rect.on('modified', () => {
        setCropRect(rect);
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

  const handleRotateImage = (degrees: number) => {
    if (!originalImage || !fabricCanvas) return;

    const newRotation = imageRotation + degrees;
    setImageRotation(newRotation);

    // Apply rotation using Fabric.js transform utilities
    const center = originalImage.getCenterPoint();
    const radians = (degrees * Math.PI) / 180;
    
    // Create rotation matrix as a proper TMat2D tuple
    const rotationMatrix: [number, number, number, number, number, number] = [
      Math.cos(radians), Math.sin(radians),
      -Math.sin(radians), Math.cos(radians),
      0, 0
    ];
    
    // Apply rotation around center
    const transformedCenter = util.transformPoint(center, rotationMatrix);
    
    originalImage.set({
      angle: newRotation,
      left: transformedCenter.x,
      top: transformedCenter.y
    });
    
    fabricCanvas.renderAll();
  };

  const handleCrop = async () => {
    if (!fabricCanvas || !cropRect || !originalImage) return;

    setIsProcessing(true);
    try {
      const croppedImageUrl = await exportCroppedImage(fabricCanvas, cropRect, originalImage);
      onCropComplete(croppedImageUrl);
    } catch (error) {
      console.error('Crop failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCrop = () => {
    if (!cropRect || !fabricCanvas) return;

    cropRect.set({
      left: 400,
      top: 300,
      scaleX: 1,
      scaleY: 1,
      angle: 0
    });
    fabricCanvas.renderAll();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Crop & Adjust Image</h2>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleRotateImage(-90)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Rotate Left
          </Button>
          
          <Button
            onClick={() => handleRotateImage(90)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate Right
          </Button>

          <Button
            onClick={resetCrop}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300"
          >
            <Move className="w-4 h-4 mr-2" />
            Reset Crop
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="bg-gray-800 border-gray-600 p-4">
          <canvas ref={canvasRef} className="border border-gray-600 rounded" />
          
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Drag corners to resize • Drag rotation handle to rotate • Drag center to move
            </p>
          </div>
        </Card>
      </div>

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
          onClick={handleCrop}
          disabled={isProcessing}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
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
  );
};
