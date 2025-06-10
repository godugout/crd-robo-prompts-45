
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, RotateCw, Download, ZoomIn, ZoomOut, Move, Grid, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageAdjustments {
  scale: number;
  position: { x: number; y: number };
  rotation: number;
}

interface FixedCardImageEditorProps {
  image: HTMLImageElement;
  onConfirm: (adjustedImageUrl: string) => void;
  onCancel: () => void;
  className?: string;
}

export const FixedCardImageEditor: React.FC<FixedCardImageEditorProps> = ({
  image,
  onConfirm,
  onCancel,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    scale: 1,
    position: { x: 0, y: 0 },
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const cardAspectRatio = 2.5 / 3.5; // Standard trading card ratio
  const canvasSize = 400; // Fixed canvas size for consistent experience

  // Initialize canvas and render
  useEffect(() => {
    if (!canvasRef.current || !image) return;
    renderCanvas();
  }, [image, adjustments, showGrid]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    // Set canvas size
    canvas.width = canvasSize;
    canvas.height = canvasSize / cardAspectRatio;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context for transforms
    ctx.save();

    // Move to center for transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    ctx.scale(adjustments.scale, adjustments.scale);
    ctx.translate(adjustments.position.x, adjustments.position.y);

    // Calculate image dimensions to fit canvas while maintaining aspect ratio
    const imageAspect = image.width / image.height;
    let drawWidth, drawHeight;

    if (imageAspect > cardAspectRatio) {
      // Image is wider - fit by height
      drawHeight = canvas.height;
      drawWidth = drawHeight * imageAspect;
    } else {
      // Image is taller - fit by width
      drawWidth = canvas.width;
      drawHeight = drawWidth / imageAspect;
    }

    // Draw image centered
    ctx.drawImage(
      image,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Draw card boundary
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      const gridSize = 20;
      
      for (let x = gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    }

    // Draw center guides
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  }, [image, adjustments, showGrid, canvasSize, cardAspectRatio]);

  // Auto-fit image to card
  const autoFitToCard = useCallback(() => {
    if (!image) return;

    const imageAspect = image.width / image.height;
    
    // Calculate scale to fit entire image within card bounds
    let newScale;
    if (imageAspect > cardAspectRatio) {
      // Image is wider - scale to fit width
      newScale = 1.0;
    } else {
      // Image is taller - scale to fit height  
      newScale = 1.0;
    }

    setAdjustments({
      scale: newScale,
      position: { x: 0, y: 0 },
      rotation: 0
    });

    toast.success('Image auto-fitted to card');
  }, [image, cardAspectRatio]);

  // Fill card completely (crop mode)
  const fillCard = useCallback(() => {
    if (!image) return;

    const imageAspect = image.width / image.height;
    
    // Calculate scale to fill entire card
    let newScale;
    if (imageAspect > cardAspectRatio) {
      // Image is wider - scale by height to fill
      newScale = 1.2;
    } else {
      // Image is taller - scale by width to fill
      newScale = cardAspectRatio / imageAspect * 1.1;
    }

    setAdjustments({
      scale: Math.max(1.0, newScale),
      position: { x: 0, y: 0 },
      rotation: 0
    });

    toast.success('Image fitted to fill card');
  }, [image, cardAspectRatio]);

  // Mouse handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) * 0.5;
    const deltaY = (e.clientY - dragStart.y) * 0.5;

    setAdjustments(prev => ({
      ...prev,
      position: {
        x: prev.position.x + deltaX,
        y: prev.position.y + deltaY
      }
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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

  // Export final image
  const exportImage = useCallback(async () => {
    if (!canvasRef.current || !image) return;

    setIsProcessing(true);
    
    try {
      // Create high-resolution export canvas
      const exportCanvas = document.createElement('canvas');
      const exportCtx = exportCanvas.getContext('2d')!;
      
      // Set high resolution (300 DPI equivalent)
      const exportWidth = 750;  // 2.5" at 300 DPI
      const exportHeight = 1050; // 3.5" at 300 DPI
      
      exportCanvas.width = exportWidth;
      exportCanvas.height = exportHeight;

      // Clear background
      exportCtx.fillStyle = '#ffffff';
      exportCtx.fillRect(0, 0, exportWidth, exportHeight);

      // Apply transformations scaled to export size
      exportCtx.save();
      exportCtx.translate(exportWidth / 2, exportHeight / 2);
      exportCtx.rotate((adjustments.rotation * Math.PI) / 180);
      exportCtx.scale(adjustments.scale, adjustments.scale);
      exportCtx.translate(
        adjustments.position.x * (exportWidth / canvasSize),
        adjustments.position.y * (exportHeight / (canvasSize / cardAspectRatio))
      );

      // Calculate scaled image dimensions
      const imageAspect = image.width / image.height;
      let drawWidth, drawHeight;

      if (imageAspect > cardAspectRatio) {
        drawHeight = exportHeight;
        drawWidth = drawHeight * imageAspect;
      } else {
        drawWidth = exportWidth;
        drawHeight = drawWidth / imageAspect;
      }

      // Draw image
      exportCtx.drawImage(
        image,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      exportCtx.restore();

      // Convert to blob and create URL
      exportCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          onConfirm(url);
          toast.success('Image adjustments applied!');
        }
      }, 'image/png', 0.95);

    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export image');
    } finally {
      setIsProcessing(false);
    }
  }, [adjustments, image, onConfirm, canvasSize, cardAspectRatio]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={autoFitToCard}
          variant="outline"
          size="sm"
          className="border-editor-border text-white"
        >
          <Target className="w-4 h-4 mr-2" />
          Auto-Fit
        </Button>
        
        <Button
          onClick={fillCard}
          variant="outline"
          size="sm"
          className="border-editor-border text-white"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Fill Card
        </Button>
        
        <Button
          onClick={() => setShowGrid(!showGrid)}
          variant="outline"
          size="sm"
          className={`border-editor-border ${showGrid ? 'bg-crd-green text-black' : 'text-white'}`}
        >
          <Grid className="w-4 h-4 mr-2" />
          Grid
        </Button>
      </div>

      {/* Adjustment Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Scale</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={adjustments.scale}
            onChange={(e) => setAdjustments(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
            className="w-full accent-crd-green"
          />
          <span className="text-crd-lightGray text-xs">{adjustments.scale.toFixed(1)}x</span>
        </div>
        
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Rotation</label>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={adjustments.rotation}
            onChange={(e) => setAdjustments(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
            className="w-full accent-crd-green"
          />
          <span className="text-crd-lightGray text-xs">{adjustments.rotation}°</span>
        </div>
        
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={adjustments.position.x}
              onChange={(e) => setAdjustments(prev => ({ 
                ...prev, 
                position: { ...prev.position, x: parseInt(e.target.value) }
              }))}
              className="accent-crd-green"
            />
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={adjustments.position.y}
              onChange={(e) => setAdjustments(prev => ({ 
                ...prev, 
                position: { ...prev.position, y: parseInt(e.target.value) }
              }))}
              className="accent-crd-green"
            />
          </div>
          <span className="text-crd-lightGray text-xs">
            X: {adjustments.position.x}, Y: {adjustments.position.y}
          </span>
        </div>
      </div>

      {/* Main Canvas */}
      <Card className="relative bg-editor-dark border-editor-border overflow-hidden">
        <div className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-white font-medium">Card Preview</h3>
            <p className="text-crd-lightGray text-sm">
              Drag to reposition • Use controls to adjust scale and rotation
            </p>
          </div>
          
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-crd-green cursor-move bg-gray-900"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-editor-border text-white"
        >
          Cancel
        </Button>
        
        <Button
          onClick={exportImage}
          disabled={isProcessing}
          className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Apply Adjustments
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
