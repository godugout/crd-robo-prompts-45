
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { CanvasControls } from './CanvasControls';

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
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState<Map<string, HTMLImageElement>>(new Map());

  // Canvas dimensions and workspace
  const CANVAS_PADDING = 50;
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;

  // Load images for layers
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      // Load flattened image if available
      if (processedPSD.flattenedImageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = processedPSD.flattenedImageUrl;
          });
          imageMap.set('flattened', img);
        } catch (error) {
          console.warn('Failed to load flattened image:', error);
        }
      }

      // Load individual layer images
      for (const layer of processedPSD.layers) {
        if (layer.previewUrl && !hiddenLayers.has(layer.id)) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = layer.previewUrl;
            });
            imageMap.set(layer.id, img);
          } catch (error) {
            console.warn(`Failed to load image for layer ${layer.name}:`, error);
          }
        }
      }

      setImagesLoaded(imageMap);
    };

    loadImages();
  }, [processedPSD, hiddenLayers]);

  // Render canvas content
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set transform for zoom and pan
    ctx.save();
    ctx.setTransform(zoom, 0, 0, zoom, panOffset.x, panOffset.y);

    const psdWidth = processedPSD.width || 400;
    const psdHeight = processedPSD.height || 600;

    // Draw background if enabled
    if (showBackground) {
      if (viewMode === 'inspect' && imagesLoaded.has('flattened')) {
        const img = imagesLoaded.get('flattened')!;
        ctx.drawImage(img, 0, 0, psdWidth, psdHeight);
      } else {
        // Fallback background
        const gradient = ctx.createLinearGradient(0, 0, 0, psdHeight);
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, psdWidth, psdHeight);
      }
    }

    // Draw layers based on view mode
    if (viewMode === 'inspect') {
      renderInspectMode(ctx, psdWidth, psdHeight);
    } else if (viewMode === 'frame') {
      renderFrameMode(ctx, psdWidth, psdHeight);
    } else if (viewMode === 'build') {
      renderBuildMode(ctx, psdWidth, psdHeight);
    }

    ctx.restore();
  }, [processedPSD, zoom, panOffset, hiddenLayers, selectedLayerId, focusMode, showBackground, viewMode, imagesLoaded]);

  const renderInspectMode = (ctx: CanvasRenderingContext2D, psdWidth: number, psdHeight: number) => {
    // Render individual layers
    processedPSD.layers.forEach((layer) => {
      if (hiddenLayers.has(layer.id)) return;

      // In focus mode, only show selected layer
      if (focusMode && layer.id !== selectedLayerId) return;

      const layerImage = imagesLoaded.get(layer.id);
      if (layerImage) {
        ctx.globalAlpha = focusMode && layer.id === selectedLayerId ? 1 : layer.opacity;
        ctx.drawImage(
          layerImage,
          layer.bounds.left,
          layer.bounds.top,
          layer.bounds.right - layer.bounds.left,
          layer.bounds.bottom - layer.bounds.top
        );
        ctx.globalAlpha = 1;
      }

      // Draw selection highlight
      if (layer.id === selectedLayerId) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);
        ctx.strokeRect(
          layer.bounds.left,
          layer.bounds.top,
          layer.bounds.right - layer.bounds.left,
          layer.bounds.bottom - layer.bounds.top
        );
        ctx.setLineDash([]);
      }
    });
  };

  const renderFrameMode = (ctx: CanvasRenderingContext2D, psdWidth: number, psdHeight: number) => {
    // Similar to inspect mode but with frame analysis overlays
    renderInspectMode(ctx, psdWidth, psdHeight);
    
    // Add frame analysis overlays
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([3 / zoom, 3 / zoom]);
    ctx.strokeRect(0, 0, psdWidth, psdHeight);
    ctx.setLineDash([]);
  };

  const renderBuildMode = (ctx: CanvasRenderingContext2D, psdWidth: number, psdHeight: number) => {
    // Similar to inspect mode but with build overlays
    renderInspectMode(ctx, psdWidth, psdHeight);
    
    // Add build mode overlays
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([2 / zoom, 4 / zoom]);
    ctx.strokeRect(0, 0, psdWidth, psdHeight);
    ctx.setLineDash([]);
  };

  // Re-render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Fit to screen function
  const fitToScreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const psdWidth = processedPSD.width || 400;
    const psdHeight = processedPSD.height || 600;

    const scaleX = (containerRect.width - CANVAS_PADDING * 2) / psdWidth;
    const scaleY = (containerRect.height - CANVAS_PADDING * 2) / psdHeight;
    const newZoom = Math.min(scaleX, scaleY, 1);

    setZoom(newZoom);
    setPanOffset({
      x: (containerRect.width - psdWidth * newZoom) / 2,
      y: (containerRect.height - psdHeight * newZoom) / 2
    });
  }, [processedPSD.width, processedPSD.height]);

  // Zoom functions
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, MAX_ZOOM));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, MIN_ZOOM));
  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - panOffset.x) / zoom;
      const y = (e.clientY - rect.top - panOffset.y) / zoom;

      // Check if clicking on a layer
      const clickedLayer = processedPSD.layers
        .slice()
        .reverse()
        .find(layer => 
          !hiddenLayers.has(layer.id) &&
          x >= layer.bounds.left &&
          x <= layer.bounds.right &&
          y >= layer.bounds.top &&
          y <= layer.bounds.bottom
        );

      if (clickedLayer) {
        onLayerSelect(clickedLayer.id);
      }

      // Start panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * delta)));
    }
  };

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      renderCanvas();
    };

    updateCanvasSize();
    
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [renderCanvas]);

  // Fit to screen on mount
  useEffect(() => {
    setTimeout(fitToScreen, 100);
  }, [fitToScreen]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0a0b] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      
      <CanvasControls
        zoom={zoom}
        isPanning={isPanning}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={fitToScreen}
        onResetView={handleResetView}
        focusMode={focusMode}
        showBackground={showBackground}
        onToggleFocusMode={onFocusModeToggle}
        onToggleBackground={onToggleBackground}
      />
    </div>
  );
};
