
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Target, RotateCcw, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';
import type { ImageAdjustments } from './EnhancedCardImageEditor';

interface SmartCardFitterProps {
  image: HTMLImageElement;
  adjustments: ImageAdjustments;
  onAdjustmentsChange: (updates: Partial<ImageAdjustments>) => void;
  showGrid: boolean;
  targetAspectRatio: number;
  onCroppedImageChange?: (croppedImageUrl: string) => void;
}

export const SmartCardFitter: React.FC<SmartCardFitterProps> = ({
  image,
  adjustments,
  onAdjustmentsChange,
  showGrid,
  targetAspectRatio,
  onCroppedImageChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Auto-fit function to fill entire card surface
  const autoFitToCard = useCallback(() => {
    if (!image) return;

    const imageAspect = image.width / image.height;
    
    // Calculate scale to fill entire card (crop mode)
    let newScale;
    if (imageAspect > targetAspectRatio) {
      // Image is wider - scale by height to fill
      newScale = 1.2; // Scale up to ensure full coverage
    } else {
      // Image is taller - scale by width to fill
      newScale = targetAspectRatio / imageAspect * 1.1; // Scale up to ensure full coverage
    }

    onAdjustmentsChange({
      scale: Math.max(1.0, newScale),
      position: { x: 0, y: 0 } // Center the image
    });

    toast.success('Image auto-fitted to fill card surface');
  }, [image, targetAspectRatio, onAdjustmentsChange]);

  // Export the exact crop area as 2.5x3.5 image
  const exportCrop = useCallback(() => {
    if (!canvasRef.current || !image) return;

    // Create a new canvas for the exact crop export
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d')!;
    
    // Set exact card dimensions (high resolution)
    const cardWidth = 750; // 2.5 inches at 300 DPI
    const cardHeight = 1050; // 3.5 inches at 300 DPI
    
    exportCanvas.width = cardWidth;
    exportCanvas.height = cardHeight;
    
    // Calculate the source area from the original image
    const { scale: imageScale, position, rotation, enhancements } = adjustments;
    
    // Apply image transformations to get the exact crop area
    exportCtx.save();
    
    // Apply enhancements
    const { brightness, contrast, saturation } = enhancements;
    exportCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    // Center and apply transformations
    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;
    
    exportCtx.translate(centerX, centerY);
    exportCtx.rotate((rotation * Math.PI) / 180);
    exportCtx.scale(imageScale, imageScale);
    exportCtx.translate(-centerX + position.x, -centerY + position.y);
    
    // Draw the image to fill the exact card area
    const scaledWidth = cardWidth * imageScale;
    const scaledHeight = cardHeight * imageScale;
    const offsetX = -scaledWidth / 2;
    const offsetY = -scaledHeight / 2;
    
    exportCtx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);
    exportCtx.restore();
    
    // Convert to blob and update the image
    exportCanvas.toBlob((blob) => {
      if (blob && onCroppedImageChange) {
        const croppedUrl = URL.createObjectURL(blob);
        onCroppedImageChange(croppedUrl);
        toast.success('Crop applied! Image updated to exact card dimensions.');
      }
    }, 'image/png', 0.95);
    
  }, [image, adjustments, onCroppedImageChange]);

  // Auto-fit when image changes
  useEffect(() => {
    if (image && adjustments.scale === 1) {
      autoFitToCard();
    }
  }, [image, autoFitToCard]);

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas dimensions
    const containerRect = canvas.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const maxWidth = Math.min(containerRect.width * 0.95, 800);
    const maxHeight = 600;
    
    // Calculate display dimensions maintaining aspect ratio
    const imageAspect = image.width / image.height;
    let displayWidth, displayHeight;
    
    if (imageAspect > maxWidth / maxHeight) {
      displayWidth = maxWidth;
      displayHeight = maxWidth / imageAspect;
    } else {
      displayHeight = maxHeight;
      displayWidth = maxHeight * imageAspect;
    }

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    setScale(displayWidth / image.width);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    
    // Apply enhancements
    const { brightness, contrast, saturation } = adjustments.enhancements;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    // Apply rotation and position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    ctx.scale(adjustments.scale, adjustments.scale);
    ctx.translate(-centerX + adjustments.position.x * scale, -centerY + adjustments.position.y * scale);
    
    // Draw image to fill entire canvas
    const scaledWidth = canvas.width * adjustments.scale;
    const scaledHeight = canvas.height * adjustments.scale;
    const offsetX = -scaledWidth / 2;
    const offsetY = -scaledHeight / 2;
    
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);
    
    ctx.restore();
    
    // Draw card boundary overlay
    drawCardBoundary(ctx, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    
  }, [image, adjustments, showGrid, scale]);

  const drawCardBoundary = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Card boundary should cover the entire canvas for full bleed
    const boundaryWidth = width;
    const boundaryHeight = height;
    const offsetX = 0;
    const offsetY = 0;
    
    // Draw boundary rectangle
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(offsetX, offsetY, boundaryWidth, boundaryHeight);
    
    // Draw corner markers
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    const cornerSize = 20;
    
    // Top-left
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + cornerSize);
    ctx.lineTo(offsetX, offsetY);
    ctx.lineTo(offsetX + cornerSize, offsetY);
    ctx.stroke();
    
    // Top-right
    ctx.beginPath();
    ctx.moveTo(offsetX + boundaryWidth - cornerSize, offsetY);
    ctx.lineTo(offsetX + boundaryWidth, offsetY);
    ctx.lineTo(offsetX + boundaryWidth, offsetY + cornerSize);
    ctx.stroke();
    
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + boundaryHeight - cornerSize);
    ctx.lineTo(offsetX, offsetY + boundaryHeight);
    ctx.lineTo(offsetX + cornerSize, offsetY + boundaryHeight);
    ctx.stroke();
    
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(offsetX + boundaryWidth - cornerSize, offsetY + boundaryHeight);
    ctx.lineTo(offsetX + boundaryWidth, offsetY + boundaryHeight);
    ctx.lineTo(offsetX + boundaryWidth, offsetY + boundaryHeight - cornerSize);
    ctx.stroke();
    
    // Add label
    ctx.fillStyle = '#22c55e';
    ctx.font = '12px sans-serif';
    ctx.fillText('Full Card Coverage (2.5" x 3.5")', offsetX, offsetY - 8);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.lineWidth = 1;
    
    // Rule of thirds grid
    for (let i = 1; i < 3; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo((width / 3) * i, 0);
      ctx.lineTo((width / 3) * i, height);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, (height / 3) * i);
      ctx.lineTo(width, (height / 3) * i);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = (x - dragStart.x) / scale;
    const deltaY = (y - dragStart.y) / scale;
    
    onAdjustmentsChange({
      position: {
        x: adjustments.position.x + deltaX,
        y: adjustments.position.y + deltaY
      }
    });
    
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    const newScale = Math.max(0.5, Math.min(5, adjustments.scale * delta));
    
    onAdjustmentsChange({
      scale: newScale
    });
  };

  return (
    <div className="relative">
      {/* Enhanced Control Bar */}
      <div className="mb-4 p-3 bg-editor-tool rounded-lg border border-editor-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium text-sm">Image Fitting Controls</h4>
          <div className="flex gap-2">
            <Button
              onClick={() => onAdjustmentsChange({ scale: Math.min(5, adjustments.scale * 1.1) })}
              variant="outline"
              size="sm"
              className="border-editor-border text-crd-lightGray hover:text-white p-2"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onAdjustmentsChange({ scale: Math.max(0.5, adjustments.scale * 0.9) })}
              variant="outline"
              size="sm"
              className="border-editor-border text-crd-lightGray hover:text-white p-2"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={autoFitToCard}
            variant="outline"
            size="sm"
            className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Fill Card Surface
          </Button>
          <Button
            onClick={() => onAdjustmentsChange({
              scale: 1,
              position: { x: 0, y: 0 },
              rotation: 0
            })}
            variant="outline"
            size="sm"
            className="border-editor-border text-crd-lightGray hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={exportCrop}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-move border border-gray-600 rounded bg-editor-darker"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ maxHeight: '600px' }}
      />
      
      {/* Instructions Overlay */}
      <div className="absolute top-20 left-4 bg-black/80 text-white text-xs p-3 rounded-lg max-w-xs">
        <div className="space-y-1">
          <div><strong>Controls:</strong></div>
          <div>• <Target className="w-3 h-3 inline mr-1" />Target: Auto-fit to fill card</div>
          <div>• Drag: Reposition image</div>
          <div>• Scroll: Zoom in/out</div>
          <div>• Green outline: Card boundaries</div>
          <div>• Apply Crop: Save exact 2.5"×3.5" area</div>
        </div>
      </div>
    </div>
  );
};
