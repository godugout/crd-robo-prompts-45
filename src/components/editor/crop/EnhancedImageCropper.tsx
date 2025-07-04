
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Rect, FabricImage, Line } from 'fabric';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CropControls } from './CropControls';
import { CompactCropControls } from './CompactCropControls';
import { useCropState } from './useCropState';
import { exportCroppedImage } from '@/utils/cropUtils';
import { toast } from 'sonner';
import { RotateCw } from 'lucide-react';

interface EnhancedImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  orientation?: 'portrait' | 'landscape';
  className?: string;
  compact?: boolean;
}

export const EnhancedImageCropper: React.FC<EnhancedImageCropperProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio,
  orientation: initialOrientation = 'portrait',
  className = "",
  compact = false
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(initialOrientation);
  // Always enforce 2.5:3.5 trading card aspect ratio
  const tradingCardAspectRatio = orientation === 'landscape' ? 3.5 / 2.5 : 2.5 / 3.5;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [fabricImage, setFabricImage] = useState<FabricImage | null>(null);
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [isReady, setIsReady] = useState(false);

  const {
    cropState,
    updateCropPosition,
    updateCropSize,
    updateCropRotation,
    resetCrop,
    canUndo,
    canRedo,
    undo,
    redo
  } = useCropState();

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
      selection: false,
      preserveObjectStacking: true,
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
      setFabricCanvas(null);
    };
  }, []);

  // Load and setup image
  useEffect(() => {
    if (!fabricCanvas || !imageUrl) return;

    FabricImage.fromURL(imageUrl).then((img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = fabricCanvas.width!;
      const canvasHeight = fabricCanvas.height!;
      const imgAspect = img.width! / img.height!;
      const canvasAspect = canvasWidth / canvasHeight;

      let scale;
      if (imgAspect > canvasAspect) {
        scale = canvasWidth / img.width!;
      } else {
        scale = canvasHeight / img.height!;
      }

      img.scale(scale);
      img.set({
        left: (canvasWidth - img.getScaledWidth()) / 2,
        top: (canvasHeight - img.getScaledHeight()) / 2,
        selectable: false,
        evented: false,
      });

      fabricCanvas.add(img);
      setFabricImage(img);

      // Create initial crop rectangle based on orientation
      let cropWidth, cropHeight;
      if (orientation === 'landscape') {
        cropHeight = Math.min(img.getScaledHeight() * 0.8, 200);
        cropWidth = cropHeight * tradingCardAspectRatio;
      } else {
        cropWidth = Math.min(img.getScaledWidth() * 0.8, 300);
        cropHeight = cropWidth / tradingCardAspectRatio;
      }

      const rect = new Rect({
        left: img.left! + (img.getScaledWidth() - cropWidth) / 2,
        top: img.top! + (img.getScaledHeight() - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
        fill: 'transparent',
        stroke: '#00ff00',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        cornerColor: '#00ff00',
        cornerSize: 12,
        transparentCorners: false,
        lockUniScaling: true,
      });

      // Custom controls for aspect ratio locked resizing
      rect.setControlsVisibility({
        mt: false, // middle top
        mb: false, // middle bottom
        ml: false, // middle left
        mr: false, // middle right
        mtr: true, // rotation control - this is the correct property in v6
      });

      // Event handlers for crop rectangle
      rect.on('moving', () => {
        updateCropPosition(rect.left!, rect.top!);
      });

      rect.on('scaling', () => {
        // Maintain trading card aspect ratio during scaling
        const newWidth = rect.getScaledWidth();
        const newHeight = newWidth / tradingCardAspectRatio;
        
        rect.set({
          height: rect.height! * (newHeight / rect.getScaledHeight()),
          scaleY: rect.scaleX
        });
        
        updateCropSize(newWidth, newHeight);
        fabricCanvas.renderAll();
      });

      rect.on('rotating', () => {
        updateCropRotation(rect.angle!);
      });

      fabricCanvas.add(rect);
      setCropRect(rect);
      fabricCanvas.setActiveObject(rect);
      
      // Add grid overlay
      addGridOverlay(rect);
      
      setIsReady(true);
      fabricCanvas.renderAll();
    }).catch((error) => {
      console.error('Failed to load image:', error);
      toast.error('Failed to load image');
    });
  }, [fabricCanvas, imageUrl, tradingCardAspectRatio, orientation]);

  const addGridOverlay = (rect: Rect) => {
    if (!fabricCanvas) return;

    // Remove existing grid lines
    const objects = fabricCanvas.getObjects();
    objects.forEach(obj => {
      if (obj.get('isGridLine')) {
        fabricCanvas.remove(obj);
      }
    });

    // Add rule of thirds grid
    const rectBounds = rect.getBoundingRect();
    const gridColor = '#ffffff';
    const gridOpacity = 0.3;

    // Vertical lines
    for (let i = 1; i < 3; i++) {
      const x = rectBounds.left + (rectBounds.width * i / 3);
      const line = new Line([x, rectBounds.top, x, rectBounds.top + rectBounds.height], {
        stroke: gridColor,
        strokeWidth: 1,
        opacity: gridOpacity,
        selectable: false,
        evented: false,
        isGridLine: true,
      });
      fabricCanvas.add(line);
    }

    // Horizontal lines
    for (let i = 1; i < 3; i++) {
      const y = rectBounds.top + (rectBounds.height * i / 3);
      const line = new Line([rectBounds.left, y, rectBounds.left + rectBounds.width, y], {
        stroke: gridColor,
        strokeWidth: 1,
        opacity: gridOpacity,
        selectable: false,
        evented: false,
        isGridLine: true,
      });
      fabricCanvas.add(line);
    }

    fabricCanvas.renderAll();
  };

  const handleCenterCrop = useCallback(() => {
    if (!cropRect || !fabricImage) return;

    const imgBounds = fabricImage.getBoundingRect();
    const cropWidth = cropRect.getScaledWidth();
    const cropHeight = cropRect.getScaledHeight();

    cropRect.set({
      left: imgBounds.left + (imgBounds.width - cropWidth) / 2,
      top: imgBounds.top + (imgBounds.height - cropHeight) / 2,
      angle: 0,
    });

    addGridOverlay(cropRect);
    fabricCanvas?.renderAll();
    updateCropPosition(cropRect.left!, cropRect.top!);
    updateCropRotation(0);
  }, [cropRect, fabricImage, fabricCanvas]);

  const handleFitCrop = useCallback(() => {
    if (!cropRect || !fabricImage) return;

    const imgBounds = fabricImage.getBoundingRect();
    const maxWidth = imgBounds.width * 0.9;
    const maxHeight = imgBounds.height * 0.9;
    
    let newWidth, newHeight;
    if (maxWidth / tradingCardAspectRatio <= maxHeight) {
      newWidth = maxWidth;
      newHeight = maxWidth / tradingCardAspectRatio;
    } else {
      newHeight = maxHeight;
      newWidth = maxHeight * tradingCardAspectRatio;
    }

    const scale = newWidth / cropRect.width!;
    cropRect.set({
      scaleX: scale,
      scaleY: scale,
      left: imgBounds.left + (imgBounds.width - newWidth) / 2,
      top: imgBounds.top + (imgBounds.height - newHeight) / 2,
      angle: 0,
    });

    addGridOverlay(cropRect);
    fabricCanvas?.renderAll();
    updateCropSize(newWidth, newHeight);
    updateCropPosition(cropRect.left!, cropRect.top!);
    updateCropRotation(0);
  }, [cropRect, fabricImage, fabricCanvas, tradingCardAspectRatio]);

  const handleApplyCrop = useCallback(async () => {
    if (!fabricCanvas || !cropRect || !fabricImage) {
      toast.error('Crop area not ready');
      return;
    }

    try {
      const croppedDataUrl = await exportCroppedImage(fabricCanvas, cropRect, fabricImage);
      onCropComplete(croppedDataUrl);
      toast.success('Crop applied successfully!');
    } catch (error) {
      console.error('Failed to apply crop:', error);
      toast.error('Failed to apply crop');
    }
  }, [fabricCanvas, cropRect, fabricImage, onCropComplete]);

  // Update crop rectangle when state changes externally
  useEffect(() => {
    if (!cropRect) return;

    cropRect.set({
      left: cropState.x,
      top: cropState.y,
      angle: cropState.rotation,
    });

    const scale = cropState.width / cropRect.width!;
    cropRect.set({
      scaleX: scale,
      scaleY: scale,
    });

    addGridOverlay(cropRect);
    fabricCanvas?.renderAll();
  }, [cropState, cropRect, fabricCanvas]);

  const handleOrientationToggle = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Orientation Controls */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Trading Card Orientation:</span>
          <Button
            onClick={handleOrientationToggle}
            variant="outline"
            size="sm"
            className="border-editor-border text-crd-lightGray hover:text-white hover:border-crd-green/50"
          >
            <RotateCw className="w-4 h-4 mr-1" />
            {orientation === 'portrait' ? 'Portrait (2.5:3.5)' : 'Landscape (3.5:2.5)'}
          </Button>
          <Badge variant="outline" className="text-xs text-crd-lightGray border-editor-border">
            Fixed Ratio
          </Badge>
        </div>
      </div>

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-lg" />
      </div>

      {isReady && (
        compact ? (
          <CompactCropControls
            cropState={cropState}
            onReset={resetCrop}
            onCenter={handleCenterCrop}
            onFit={handleFitCrop}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onRotationChange={updateCropRotation}
          />
        ) : (
          <CropControls
            cropState={cropState}
            onPositionChange={updateCropPosition}
            onSizeChange={updateCropSize}
            onRotationChange={updateCropRotation}
            onReset={resetCrop}
            onCenter={handleCenterCrop}
            onFit={handleFitCrop}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            aspectRatio={tradingCardAspectRatio}
          />
        )
      )}

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleApplyCrop}
          disabled={!isReady}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          Apply Crop
        </Button>
      </div>
    </div>
  );
};
