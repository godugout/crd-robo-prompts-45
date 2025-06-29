
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { CanvasControls } from './CanvasControls';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Layers, Focus, Image as ImageIcon } from 'lucide-react';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 800, height: 600 });
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Load layer images
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      for (const layer of processedPSD.layers) {
        if (layer.imageData && !hiddenLayers.has(layer.id)) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise<void>((resolve, reject) => {
              img.onload = () => {
                imageMap.set(layer.id, img);
                resolve();
              };
              img.onerror = reject;
              img.src = layer.imageData || '';
            });
          } catch (error) {
            console.warn(`Failed to load image for layer ${layer.name}:`, error);
          }
        }
      }
      
      setLoadedImages(imageMap);
    };

    loadImages();
  }, [processedPSD.layers, hiddenLayers]);

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up transform
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Calculate workspace center
    const workspaceWidth = processedPSD.width;
    const workspaceHeight = processedPSD.height;
    const offsetX = (canvas.width / zoom - workspaceWidth) / 2;
    const offsetY = (canvas.height / zoom - workspaceHeight) / 2;

    ctx.translate(offsetX, offsetY);

    // Draw background if enabled
    if (showBackground && processedPSD.flattenedImageUrl) {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => {
        ctx.globalAlpha = focusMode ? 0.3 : 1;
        ctx.drawImage(bgImg, 0, 0, workspaceWidth, workspaceHeight);
        ctx.globalAlpha = 1;
      };
      bgImg.src = processedPSD.flattenedImageUrl;
    }

    // Draw layers
    processedPSD.layers.forEach(layer => {
      if (hiddenLayers.has(layer.id)) return;

      const layerImg = loadedImages.get(layer.id);
      if (!layerImg) return;

      // Focus mode: dim non-selected layers
      if (focusMode && layer.id !== selectedLayerId) {
        ctx.globalAlpha = 0.2;
      } else {
        ctx.globalAlpha = layer.opacity / 100;
      }

      // Draw layer image
      ctx.drawImage(
        layerImg,
        layer.bounds.left,
        layer.bounds.top,
        layer.bounds.right - layer.bounds.left,
        layer.bounds.bottom - layer.bounds.top
      );

      // Draw selection highlight
      if (layer.id === selectedLayerId) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          layer.bounds.left - 2,
          layer.bounds.top - 2,
          (layer.bounds.right - layer.bounds.left) + 4,
          (layer.bounds.bottom - layer.bounds.top) + 4
        );
        ctx.setLineDash([]);
      }

      ctx.globalAlpha = 1;
    });

    // Mode-specific overlays
    if (viewMode === 'frame') {
      // Draw frame fitting guides
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(50, 50, workspaceWidth - 100, workspaceHeight - 100);
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [processedPSD, selectedLayerId, hiddenLayers, zoom, panOffset, canvasSize, loadedImages, focusMode, showBackground, viewMode]);

  // Canvas event handlers
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoom;
    const y = (event.clientY - rect.top - panOffset.y) / zoom;

    // Calculate workspace offset
    const workspaceWidth = processedPSD.width;
    const workspaceHeight = processedPSD.height;
    const offsetX = (canvas.width / zoom - workspaceWidth) / 2;
    const offsetY = (canvas.height / zoom - workspaceHeight) / 2;

    const relativeX = x - offsetX;
    const relativeY = y - offsetY;

    // Find clicked layer (reverse order for top-to-bottom)
    const clickedLayer = [...processedPSD.layers].reverse().find(layer => {
      if (hiddenLayers.has(layer.id)) return false;
      
      return (
        relativeX >= layer.bounds.left &&
        relativeX <= layer.bounds.right &&
        relativeY >= layer.bounds.top &&
        relativeY <= layer.bounds.bottom
      );
    });

    if (clickedLayer) {
      onLayerSelect(clickedLayer.id);
    }
  }, [processedPSD, hiddenLayers, zoom, panOffset, onLayerSelect]);

  // Initialize canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      setCanvasSize({
        width: rect.width,
        height: rect.height
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Control handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleFitToScreen = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scaleX = containerRect.width / processedPSD.width;
    const scaleY = containerRect.height / processedPSD.height;
    const scale = Math.min(scaleX, scaleY) * 0.8;

    setZoom(scale);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const visibleLayerCount = processedPSD.layers.length - hiddenLayers.size;

  return (
    <div className="relative w-full h-full bg-[#0a0a0b] overflow-hidden" ref={containerRef}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        className="absolute inset-0 cursor-crosshair"
        style={{ 
          imageRendering: zoom > 2 ? 'pixelated' : 'auto',
          cursor: isPanning ? 'grabbing' : 'crosshair'
        }}
      />

      {/* Controls */}
      <CanvasControls
        zoom={zoom}
        isPanning={isPanning}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onResetView={handleResetView}
        focusMode={focusMode}
        showBackground={showBackground}
        onToggleFocusMode={onFocusModeToggle}
        onToggleBackground={onToggleBackground}
        frameBuilderMode={viewMode === 'build'}
      />

      {/* Status Info */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-black/90 backdrop-blur-sm rounded-xl p-3 border border-slate-600">
        <Badge className="bg-slate-800 text-slate-300 border-slate-600">
          <Layers className="w-3 h-3 mr-1" />
          {visibleLayerCount} visible
        </Badge>
        
        {selectedLayer && (
          <Badge className="bg-crd-blue text-white">
            <ImageIcon className="w-3 h-3 mr-1" />
            {selectedLayer.name}
          </Badge>
        )}
        
        {focusMode && (
          <Badge className="bg-blue-500 text-white">
            <Focus className="w-3 h-3 mr-1" />
            Focus Mode
          </Badge>
        )}
      </div>

      {/* Layer click hint */}
      {!selectedLayerId && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-slate-600 max-w-sm">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-white font-medium mb-2">Interactive Layer Canvas</p>
            <p className="text-slate-400 text-sm">
              Click on any layer to select and inspect it. Use the controls to zoom and navigate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
