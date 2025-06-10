
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { ImageAdjustments } from './EnhancedCardImageEditor';

interface SmartCardFitterProps {
  image: HTMLImageElement;
  adjustments: ImageAdjustments;
  onAdjustmentsChange: (updates: Partial<ImageAdjustments>) => void;
  showGrid: boolean;
  targetAspectRatio: number;
}

export const SmartCardFitter: React.FC<SmartCardFitterProps> = ({
  image,
  adjustments,
  onAdjustmentsChange,
  showGrid,
  targetAspectRatio
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
  }, [image, targetAspectRatio, onAdjustmentsChange]);

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
    ctx.fillText('Full Card Coverage', offsetX, offsetY - 8);
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
      <div className="mb-4 flex gap-2">
        <Button
          onClick={autoFitToCard}
          variant="outline"
          size="sm"
          className="text-xs"
        >
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
          className="text-xs"
        >
          Reset
        </Button>
      </div>
      
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-move border border-gray-600 rounded"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ maxHeight: '600px' }}
      />
      
      <div className="absolute top-16 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        <div>Click and drag to reposition</div>
        <div>Scroll to zoom</div>
        <div>Green outline shows full card area</div>
      </div>
    </div>
  );
};
