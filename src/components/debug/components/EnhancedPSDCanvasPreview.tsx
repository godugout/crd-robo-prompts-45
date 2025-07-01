
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Focus,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId?: string;
  hiddenLayers?: Set<string>;
  onLayerSelect?: (layerId: string) => void;
  focusMode?: boolean;
  onFocusModeToggle?: () => void;
  showBackground?: boolean;
  onToggleBackground?: () => void;
  viewMode?: 'inspect' | 'frame' | 'build';
}

export const EnhancedPSDCanvasPreview: React.FC<EnhancedPSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers = new Set(),
  onLayerSelect,
  focusMode = false,
  onFocusModeToggle,
  showBackground = true,
  onToggleBackground,
  viewMode = 'inspect'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Preload images
  useEffect(() => {
    const imagePromises: Promise<void>[] = [];
    const imageMap = new Map<string, HTMLImageElement>();

    // Load flattened image
    if (processedPSD.flattenedImageUrl) {
      const promise = new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageMap.set('flattened', img);
          resolve();
        };
        img.onerror = () => reject();
        img.src = processedPSD.flattenedImageUrl;
      });
      imagePromises.push(promise);
    }

    // Load layer images
    processedPSD.layers.forEach(layer => {
      if (layer.imageUrl) {
        const promise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            imageMap.set(layer.id, img);
            resolve();
          };
          img.onerror = () => resolve(); // Don't fail on individual layer images
          img.src = layer.imageUrl;
        });
        imagePromises.push(promise);
      }
    });

    Promise.allSettled(imagePromises).then(() => {
      setLoadedImages(imageMap);
      setImagesLoaded(true);
    });
  }, [processedPSD]);

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = processedPSD;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background if enabled
    if (showBackground) {
      const flattenedImg = loadedImages.get('flattened');
      if (flattenedImg) {
        ctx.drawImage(flattenedImg, 0, 0, width, height);
      } else {
        // Fallback gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Draw layer overlays for inspection mode
    if (viewMode === 'inspect') {
      processedPSD.layers.forEach(layer => {
        if (hiddenLayers.has(layer.id)) return;

        const { bounds, semanticType } = layer;
        const isSelected = selectedLayerId === layer.id;
        const isFocused = focusMode && isSelected;

        // Skip if focus mode is on and this isn't the selected layer
        if (focusMode && !isSelected) return;

        // Draw layer image if available
        const layerImg = loadedImages.get(layer.id);
        if (layerImg && layer.isVisible) {
          ctx.globalAlpha = layer.opacity;
          ctx.drawImage(
            layerImg,
            bounds.left,
            bounds.top,
            bounds.right - bounds.left,
            bounds.bottom - bounds.top
          );
          ctx.globalAlpha = 1;
        }

        // Draw semantic overlay
        if (semanticType) {
          const color = getSemanticTypeColor(semanticType);
          ctx.fillStyle = color + (isSelected ? '40' : '20');
          ctx.fillRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        }

        // Draw border
        ctx.strokeStyle = isSelected ? '#10b981' : (semanticType ? getSemanticTypeColor(semanticType) : '#64748b');
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.setLineDash(isSelected ? [] : [5, 5]);
        ctx.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
        ctx.setLineDash([]);
      });
    }
  }, [processedPSD, selectedLayerId, hiddenLayers, focusMode, showBackground, viewMode, imagesLoaded, loadedImages]);

  // Redraw when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse interaction
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!onLayerSelect || isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = processedPSD.width / rect.width;
    const scaleY = processedPSD.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX / zoom - pan.x / zoom;
    const y = (e.clientY - rect.top) * scaleY / zoom - pan.y / zoom;

    // Find clicked layer (reverse order for top-most)
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id) || !layer.isVisible) continue;

      const { bounds } = layer;
      if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0b]">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-[#1a1f2e] border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Badge variant="outline" className="ml-2">
            {Math.round(zoom * 100)}%
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {onToggleBackground && (
            <Button
              variant={showBackground ? "default" : "outline"}
              size="sm"
              onClick={onToggleBackground}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Background
            </Button>
          )}
          
          {onFocusModeToggle && (
            <Button
              variant={focusMode ? "default" : "outline"}
              size="sm"
              onClick={onFocusModeToggle}
            >
              <Focus className="w-4 h-4 mr-2" />
              Focus
            </Button>
          )}

          <Badge className="bg-crd-blue text-white">
            <Layers className="w-3 h-3 mr-1" />
            {processedPSD.layers.length - hiddenLayers.size} visible
          </Badge>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-slate-900 relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center'
          }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="border border-slate-600 shadow-2xl cursor-pointer"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              imageRendering: zoom > 2 ? 'pixelated' : 'auto'
            }}
          />
        </div>

        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-400">Loading images...</div>
          </div>
        )}
      </div>
    </div>
  );
};
