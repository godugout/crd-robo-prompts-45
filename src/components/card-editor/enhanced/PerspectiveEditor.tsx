
import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ImageAdjustments } from './EnhancedCardImageEditor';

interface PerspectiveEditorProps {
  image: HTMLImageElement;
  adjustments: ImageAdjustments;
  onAdjustmentsChange: (updates: Partial<ImageAdjustments>) => void;
  showGrid: boolean;
}

export const PerspectiveEditor: React.FC<PerspectiveEditorProps> = ({
  image,
  adjustments,
  onAdjustmentsChange,
  showGrid
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
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
    
    // Draw image with perspective transformation
    drawPerspectiveImage(ctx, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      drawPerspectiveGrid(ctx, canvas.width, canvas.height);
    }
    
    // Draw perspective handles
    drawPerspectiveHandles(ctx, canvas.width, canvas.height);
    
  }, [image, adjustments, showGrid, scale]);

  const drawPerspectiveImage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { perspective } = adjustments;
    
    // Create transformation matrix for perspective
    const corners = [
      [perspective.topLeft.x * width, perspective.topLeft.y * height],
      [perspective.topRight.x * width, perspective.topRight.y * height],
      [perspective.bottomRight.x * width, perspective.bottomRight.y * height],
      [perspective.bottomLeft.x * width, perspective.bottomLeft.y * height]
    ];
    
    // Draw transformed image using setTransform (simplified approach)
    ctx.save();
    
    // Apply perspective transformation (basic implementation)
    // For a more accurate perspective, we'd need to implement full matrix transformation
    ctx.drawImage(image, 0, 0, width, height);
    
    // Draw perspective outline
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(corners[0][0], corners[0][1]);
    ctx.lineTo(corners[1][0], corners[1][1]);
    ctx.lineTo(corners[2][0], corners[2][1]);
    ctx.lineTo(corners[3][0], corners[3][1]);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  };

  const drawPerspectiveGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 1;
    
    // Draw perspective grid lines
    const { perspective } = adjustments;
    
    // Horizontal lines
    for (let i = 1; i < 3; i++) {
      const t = i / 3;
      const startX = perspective.topLeft.x * width + t * (perspective.topRight.x - perspective.topLeft.x) * width;
      const startY = perspective.topLeft.y * height + t * (perspective.topRight.y - perspective.topLeft.y) * height;
      const endX = perspective.bottomLeft.x * width + t * (perspective.bottomRight.x - perspective.bottomLeft.x) * width;
      const endY = perspective.bottomLeft.y * height + t * (perspective.bottomRight.y - perspective.bottomLeft.y) * height;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 1; i < 3; i++) {
      const t = i / 3;
      const startX = perspective.topLeft.x * width + t * (perspective.bottomLeft.x - perspective.topLeft.x) * width;
      const startY = perspective.topLeft.y * height + t * (perspective.bottomLeft.y - perspective.topLeft.y) * height;
      const endX = perspective.topRight.x * width + t * (perspective.bottomRight.x - perspective.topRight.x) * width;
      const endY = perspective.topRight.y * height + t * (perspective.bottomRight.y - perspective.topRight.y) * height;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  const drawPerspectiveHandles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { perspective } = adjustments;
    const handleSize = 12;
    
    const handles = [
      { name: 'topLeft', pos: perspective.topLeft, color: '#ef4444' },
      { name: 'topRight', pos: perspective.topRight, color: '#22c55e' },
      { name: 'bottomRight', pos: perspective.bottomRight, color: '#3b82f6' },
      { name: 'bottomLeft', pos: perspective.bottomLeft, color: '#f59e0b' }
    ];
    
    handles.forEach(handle => {
      const x = handle.pos.x * width;
      const y = handle.pos.y * height;
      
      ctx.fillStyle = handle.color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(x, y, handleSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = 'white';
      ctx.font = '10px sans-serif';
      ctx.fillText(handle.name, x + 10, y - 10);
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getHandleAtPosition = (x: number, y: number, width: number, height: number): string | null => {
    const { perspective } = adjustments;
    const handleSize = 12;
    
    const handles = [
      { name: 'topLeft', pos: perspective.topLeft },
      { name: 'topRight', pos: perspective.topRight },
      { name: 'bottomRight', pos: perspective.bottomRight },
      { name: 'bottomLeft', pos: perspective.bottomLeft }
    ];
    
    for (const handle of handles) {
      const handleX = handle.pos.x * width;
      const handleY = handle.pos.y * height;
      const distance = Math.sqrt((x - handleX) ** 2 + (y - handleY) ** 2);
      
      if (distance <= handleSize) {
        return handle.name;
      }
    }
    
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const handle = getHandleAtPosition(x, y, canvasRef.current.width, canvasRef.current.height);
    
    if (handle) {
      setIsDragging(true);
      setDragHandle(handle);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragHandle || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normalizedX = Math.max(0, Math.min(1, x / canvasRef.current.width));
    const normalizedY = Math.max(0, Math.min(1, y / canvasRef.current.height));
    
    onAdjustmentsChange({
      perspective: {
        ...adjustments.perspective,
        [dragHandle]: { x: normalizedX, y: normalizedY }
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragHandle(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ maxHeight: '600px' }}
      />
      
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        <div>Drag colored corners to adjust perspective</div>
        <div>Red: Top-Left | Green: Top-Right</div>
        <div>Blue: Bottom-Right | Orange: Bottom-Left</div>
      </div>
    </div>
  );
};
