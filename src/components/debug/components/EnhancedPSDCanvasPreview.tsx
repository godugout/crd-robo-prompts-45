
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Focus,
  Image as ImageIcon
} from 'lucide-react';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  focusMode?: boolean;
  onFocusModeToggle?: () => void;
  showBackground?: boolean;
  onToggleBackground?: () => void;
  viewMode?: 'inspect' | 'frame' | 'build';
}

export const EnhancedPSDCanvasPreview: React.FC<EnhancedPSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  focusMode = false,
  onFocusModeToggle,
  showBackground = true,
  onToggleBackground,
  viewMode = 'inspect'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !processedPSD) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background/original card if enabled
    if (showBackground && processedPSD.flattenedImageUrl) {
      const bgImage = new Image();
      bgImage.onload = () => {
        // Apply dimming in focus mode
        const bgOpacity = focusMode ? 0.3 : 1.0;
        ctx.globalAlpha = bgOpacity;
        ctx.drawImage(bgImage, 0, 0, processedPSD.width, processedPSD.height);
        ctx.globalAlpha = 1.0;
      };
      bgImage.src = processedPSD.flattenedImageUrl;
    }
    
    // Draw visible layers
    const visibleLayers = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));
    
    visibleLayers.forEach(layer => {
      if (layer.imageUrl) {
        const layerImage = new Image();
        layerImage.onload = () => {
          // Apply focus mode opacity logic
          let layerOpacity = layer.properties.opacity;
          
          if (focusMode) {
            if (layer.id === selectedLayerId) {
              // Brighten selected layer
              layerOpacity = Math.min(1.0, layerOpacity * 1.2);
            } else {
              // Slightly dim other layers for context
              layerOpacity = layerOpacity * 0.6;
            }
          }
          
          ctx.globalAlpha = layerOpacity;
          ctx.drawImage(
            layerImage,
            layer.bounds.left,
            layer.bounds.top,
            layer.bounds.right - layer.bounds.left,
            layer.bounds.bottom - layer.bounds.top
          );
          ctx.globalAlpha = 1.0;
          
          // Highlight selected layer
          if (layer.id === selectedLayerId) {
            ctx.strokeStyle = focusMode ? '#10b981' : '#3b82f6';
            ctx.lineWidth = focusMode ? 3 : 2;
            ctx.strokeRect(
              layer.bounds.left - 2,
              layer.bounds.top - 2,
              (layer.bounds.right - layer.bounds.left) + 4,
              (layer.bounds.bottom - layer.bounds.top) + 4
            );
          }
        };
        layerImage.src = layer.imageUrl;
      }
    });
  }, [processedPSD, selectedLayerId, hiddenLayers, showBackground, focusMode]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Find clicked layer
    const visibleLayers = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));
    const clickedLayer = visibleLayers
      .reverse()
      .find(layer => 
        x >= layer.bounds.left && 
        x <= layer.bounds.right && 
        y >= layer.bounds.top && 
        y <= layer.bounds.bottom
      );
    
    if (clickedLayer) {
      onLayerSelect(clickedLayer.id);
    }
  };

  const visibleLayerCount = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id)).length;
  const layersWithImagesCount = processedPSD.layers.filter(layer => layer.hasRealImage).length;

  return (
    <div className="h-full flex flex-col bg-[#131316]">
      {/* Canvas Controls */}
      <div className="p-4 border-b border-slate-700 bg-[#1a1f2e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-500">
              {Math.round(zoom * 100)}%
            </Badge>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="w-8 h-8 p-0 hover:bg-slate-700"
              >
                <ZoomOut className="w-4 h-4 text-slate-300" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="w-8 h-8 p-0 hover:bg-slate-700"
              >
                <ZoomIn className="w-4 h-4 text-slate-300" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetView}
                className="w-8 h-8 p-0 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 text-slate-300" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-500">
              <ImageIcon className="w-3 h-3 mr-1" />
              {layersWithImagesCount} with images
            </Badge>
            
            {onFocusModeToggle && (
              <Button
                variant={focusMode ? "default" : "ghost"}
                size="sm"
                onClick={onFocusModeToggle}
                className={focusMode ? "bg-crd-blue hover:bg-crd-blue/90" : "hover:bg-slate-700"}
              >
                <Focus className="w-4 h-4 mr-2" />
                Focus Mode
              </Button>
            )}
            
            {onToggleBackground && (
              <Button
                variant={showBackground ? "default" : "ghost"}
                size="sm"
                onClick={onToggleBackground}
                className={showBackground ? "bg-slate-600 hover:bg-slate-500" : "hover:bg-slate-700"}
              >
                {showBackground ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                Original Card
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-4">
        <Card className="bg-slate-900 border-slate-700 p-4">
          <div 
            className="overflow-auto"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'top left',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto border border-slate-600 rounded cursor-pointer"
              onClick={handleCanvasClick}
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
