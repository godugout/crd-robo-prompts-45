
import React, { useRef, useEffect, useState, useCallback } from 'react';
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
    
    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    ctx.restore();
    
    // Draw card boundary overlay
    drawCardBoundary(ctx, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    
    // Draw adjustment handles
    drawAdjustmentHandles(ctx, canvas.width, canvas.height);
    
  }, [image, adjustments, showGrid, scale]);

  const drawCardBoundary = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageAspect = width / height;
    let boundaryWidth, boundaryHeight, offsetX, offsetY;
    
    if (imageAspect > targetAspectRatio) {
      // Image is wider, fit by height
      boundaryHeight = height * 0.8;
      boundaryWidth = boundaryHeight * targetAspectRatio;
      offsetX = (width - boundaryWidth) / 2;
      offsetY = (height - boundaryHeight) / 2;
    } else {
      // Image is taller, fit by width
      boundaryWidth = width * 0.8;
      boundaryHeight = boundaryWidth / targetAspectRatio;
      offsetX = (width - boundaryWidth) / 2;
      offsetY = (height - boundaryHeight) / 2;
    }
    
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
    ctx.fillText('Card Boundary (2.5:3.5)', offsetX, offsetY - 8);
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

  const drawAdjustmentHandles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const handleSize = 12;
    
    // Center handle for position
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, handleSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Scale handles at corners
    ctx.fillStyle = '#8b5cf6';
    const margin = 40;
    
    // Corner handles
    [-1, 1].forEach(x => {
      [-1, 1].forEach(y => {
        ctx.beginPath();
        ctx.rect(
          centerX + x * (width / 2 - margin) - handleSize / 2,
          centerY + y * (height / 2 - margin) - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fill();
      });
    });
    
    // Rotation handle
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 60, handleSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Line to rotation handle
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - 60);
    ctx.stroke();
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
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, adjustments.scale * delta));
    
    onAdjustmentsChange({
      scale: newScale
    });
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ maxHeight: '600px' }}
      />
      
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        <div>Click and drag to reposition</div>
        <div>Scroll to zoom</div>
        <div>Green outline shows card boundary</div>
      </div>
    </div>
  );
};
