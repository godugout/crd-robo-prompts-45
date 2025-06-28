
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId?: string | null;
  layerVisibility: Map<string, boolean>;
  layerGroups?: LayerGroup[];
  onLayerClick?: (layerId: string) => void;
}

export const PSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  layerVisibility,
  layerGroups = [],
  onLayerClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showBacklight, setShowBacklight] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 800 });

  // Calculate optimal canvas size based on container and PSD dimensions
  useEffect(() => {
    if (!containerRef.current || !processedPSD) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const maxWidth = Math.min(containerRect.width - 40, 800);
    const maxHeight = Math.min(containerRect.height - 100, 600);

    const psdAspect = processedPSD.width / processedPSD.height;
    const containerAspect = maxWidth / maxHeight;

    let newWidth, newHeight;
    if (psdAspect > containerAspect) {
      newWidth = maxWidth;
      newHeight = maxWidth / psdAspect;
    } else {
      newHeight = maxHeight;
      newWidth = maxHeight * psdAspect;
    }

    setCanvasSize({ width: newWidth, height: newHeight });
  }, [processedPSD]);

  // Get layer group color
  const getLayerGroupColor = useCallback((layerId: string): string | null => {
    const group = layerGroups.find(g => g.layers.some(l => l.id === layerId));
    return group?.color || null;
  }, [layerGroups]);

  // Render canvas content
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up transforms
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Calculate scale factors
    const scaleX = canvas.width / processedPSD.width;
    const scaleY = canvas.height / processedPSD.height;

    // Sort layers by z-index for proper rendering order
    const sortedLayers = [...processedPSD.layers].sort((a, b) => a.zIndex - b.zIndex);

    // Render layers
    sortedLayers.forEach((layer) => {
      const isVisible = layerVisibility.get(layer.id) ?? layer.visible;
      if (!isVisible || !layer.imageData) return;

      const isSelected = layer.id === selectedLayerId;
      const groupColor = getLayerGroupColor(layer.id);

      ctx.save();

      // Calculate layer position and size
      const layerX = layer.bounds.left * scaleX;
      const layerY = layer.bounds.top * scaleY;
      const layerWidth = (layer.bounds.right - layer.bounds.left) * scaleX;
      const layerHeight = (layer.bounds.bottom - layer.bounds.top) * scaleY;

      // Draw backlight effect for selected layer
      if (isSelected && showBacklight) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(0, 150, 255, 0.1)';
        ctx.fillRect(layerX - 5, layerY - 5, layerWidth + 10, layerHeight + 10);
        
        // Add glow effect
        ctx.globalCompositeOperation = 'screen';
        ctx.shadowColor = '#0096ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(0, 150, 255, 0.05)';
        ctx.fillRect(layerX - 10, layerY - 10, layerWidth + 20, layerHeight + 20);
        ctx.restore();
      }

      // Set layer opacity - ensure minimum visibility
      const minOpacity = 0.3; // Minimum 30% opacity for visibility
      const actualOpacity = Math.max(layer.opacity, minOpacity);
      ctx.globalAlpha = actualOpacity;

      // Load and draw layer image
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, layerX, layerY, layerWidth, layerHeight);
        
        // Draw group color border
        if (groupColor) {
          ctx.save();
          ctx.globalAlpha = 0.8;
          ctx.strokeStyle = groupColor;
          ctx.lineWidth = isSelected ? 3 : 1;
          ctx.setLineDash(isSelected ? [] : [5, 5]);
          ctx.strokeRect(layerX, layerY, layerWidth, layerHeight);
          ctx.restore();
        }

        // Draw selection border
        if (isSelected) {
          ctx.save();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#0096ff';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.strokeRect(layerX - 1, layerY - 1, layerWidth + 2, layerHeight + 2);
          ctx.restore();
        }
      };
      img.src = layer.imageData;

      ctx.restore();
    });

    ctx.restore();
  }, [processedPSD, layerVisibility, selectedLayerId, zoom, pan, showBacklight, getLayerGroupColor]);

  // Handle canvas click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!processedPSD || !onLayerClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;

    // Convert to PSD coordinates
    const psdX = (x / canvas.width) * processedPSD.width;
    const psdY = (y / canvas.height) * processedPSD.height;

    // Find topmost layer at click position (reverse order for top-down)
    const clickedLayer = [...processedPSD.layers]
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(layer => {
        const isVisible = layerVisibility.get(layer.id) ?? layer.visible;
        return isVisible &&
               psdX >= layer.bounds.left &&
               psdX <= layer.bounds.right &&
               psdY >= layer.bounds.top &&
               psdY <= layer.bounds.bottom;
      });

    if (clickedLayer) {
      onLayerClick(clickedLayer.id);
    }
  }, [processedPSD, layerVisibility, onLayerClick, zoom, pan]);

  // Mouse event handlers for panning
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Render canvas when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  if (!processedPSD) {
    return (
      <Card className="bg-[#0a0f1b] border-slate-800">
        <CardContent className="p-6 text-center">
          <p className="text-slate-400">No PSD data to preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Card Preview</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBacklight(!showBacklight)}
              className={`border-slate-600 ${showBacklight ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              {showBacklight ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="border-slate-600 text-slate-300"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="border-slate-600 text-slate-300"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetView}
              className="border-slate-600 text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="text-slate-300">
            Zoom: {Math.round(zoom * 100)}%
          </Badge>
          <Badge variant="outline" className="text-slate-300">
            {processedPSD.width}×{processedPSD.height}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div 
          ref={containerRef}
          className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700"
          style={{ height: '500px' }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Zoom indicator */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {Math.round(zoom * 100)}%
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            Click layer to select • Drag to pan • Use zoom buttons
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
