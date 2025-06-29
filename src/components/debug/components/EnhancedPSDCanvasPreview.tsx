
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { CanvasControls } from './CanvasControls';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  focusMode?: boolean;
  onFocusModeToggle?: (enabled: boolean) => void;
}

export const EnhancedPSDCanvasPreview: React.FC<EnhancedPSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  focusMode = false,
  onFocusModeToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackground, setShowBackground] = useState(true);
  const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(new Map());
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const {
    transform,
    isPanning,
    zoomIn,
    zoomOut,
    resetView,
    fitToScreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    getTransformStyle
  } = useCanvasNavigation({
    minZoom: 0.1,
    maxZoom: 5,
    zoomStep: 0.2
  });

  // Load background image
  useEffect(() => {
    if (processedPSD.flattenedImageUrl) {
      const img = new Image();
      img.onload = () => setBackgroundImage(img);
      img.onerror = () => console.warn('Failed to load background image');
      img.src = processedPSD.flattenedImageUrl;
    }
  }, [processedPSD.flattenedImageUrl]);

  // Load layer images
  useEffect(() => {
    const loadImages = async () => {
      const cache = new Map<string, HTMLImageElement>();
      const loadPromises = processedPSD.layers.map(layer => {
        return new Promise<void>((resolve) => {
          if (layer.fullColorImageUrl) {
            const img = new Image();
            img.onload = () => {
              cache.set(layer.id, img);
              resolve();
            };
            img.onerror = () => {
              console.warn(`Failed to load layer image for ${layer.name}`);
              resolve();
            };
            img.src = layer.fullColorImageUrl;
          } else {
            resolve();
          }
        });
      });

      await Promise.all(loadPromises);
      setImageCache(cache);
      setImagesLoaded(true);
    };

    loadImages();
  }, [processedPSD.layers]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context for transforms
    ctx.save();

    // Apply zoom and pan transforms
    ctx.translate(transform.translateX, transform.translateY);
    ctx.scale(transform.scale, transform.scale);

    // Draw background image if enabled
    if (showBackground && backgroundImage) {
      ctx.globalAlpha = 1;
      ctx.drawImage(backgroundImage, 0, 0);
    }

    // Sort layers by zIndex (bottom to top)
    const sortedLayers = [...processedPSD.layers].sort((a, b) => a.zIndex - b.zIndex);

    // Draw layers
    sortedLayers.forEach(layer => {
      if (hiddenLayers.has(layer.id)) return;

      const layerImage = imageCache.get(layer.id);
      if (!layerImage) return;

      ctx.save();

      // Apply focus mode darkening
      if (focusMode && selectedLayerId && layer.id !== selectedLayerId) {
        ctx.globalAlpha = 0.3; // Darken non-selected layers
      } else {
        ctx.globalAlpha = layer.opacity;
      }

      // Draw layer image at its bounds position
      ctx.drawImage(
        layerImage,
        layer.bounds.left,
        layer.bounds.top,
        layer.bounds.right - layer.bounds.left,
        layer.bounds.bottom - layer.bounds.top
      );

      ctx.restore();
    });

    // Draw focus mode overlay
    if (focusMode && selectedLayerId) {
      const selectedLayer = processedPSD.layers.find(l => l.id === selectedLayerId);
      if (selectedLayer) {
        // Dark overlay on entire canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cut out selected layer area
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(
          selectedLayer.bounds.left - 10,
          selectedLayer.bounds.top - 10,
          selectedLayer.bounds.right - selectedLayer.bounds.left + 20,
          selectedLayer.bounds.bottom - selectedLayer.bounds.top + 20
        );
        ctx.restore();

        // Highlight border around selected layer
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3 / transform.scale;
        ctx.setLineDash([]);
        ctx.strokeRect(
          selectedLayer.bounds.left - 5,
          selectedLayer.bounds.top - 5,
          selectedLayer.bounds.right - selectedLayer.bounds.left + 10,
          selectedLayer.bounds.bottom - selectedLayer.bounds.top + 10
        );
      }
    }

    // Draw selection outline for non-focus mode
    if (!focusMode && selectedLayerId) {
      const selectedLayer = processedPSD.layers.find(l => l.id === selectedLayerId);
      if (selectedLayer) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2 / transform.scale;
        ctx.setLineDash([5 / transform.scale, 5 / transform.scale]);
        ctx.strokeRect(
          selectedLayer.bounds.left,
          selectedLayer.bounds.top,
          selectedLayer.bounds.right - selectedLayer.bounds.left,
          selectedLayer.bounds.bottom - selectedLayer.bounds.top
        );
      }
    }

    ctx.restore();
  }, [
    imagesLoaded,
    transform,
    showBackground,
    backgroundImage,
    processedPSD.layers,
    hiddenLayers,
    focusMode,
    selectedLayerId,
    imageCache
  ]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle canvas click to select layers
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.translateX) / transform.scale;
    const y = (e.clientY - rect.top - transform.translateY) / transform.scale;

    // Find clicked layer (check from top to bottom)
    const sortedLayers = [...processedPSD.layers].sort((a, b) => b.zIndex - a.zIndex);
    
    for (const layer of sortedLayers) {
      if (hiddenLayers.has(layer.id)) continue;
      
      if (
        x >= layer.bounds.left &&
        x <= layer.bounds.right &&
        y >= layer.bounds.top &&
        y <= layer.bounds.bottom
      ) {
        onLayerSelect(layer.id);
        return;
      }
    }
  }, [transform, processedPSD.layers, hiddenLayers, onLayerSelect]);

  // Handle wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelEvent = (e: WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (handleWheel(e, rect)) {
        drawCanvas();
      }
    };

    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheelEvent);
  }, [handleWheel, drawCanvas]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        onFocusModeToggle?.(!focusMode);
      } else if (e.key === 'b' || e.key === 'B') {
        setShowBackground(!showBackground);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, showBackground, onFocusModeToggle]);

  // Auto-fit to screen on first load
  useEffect(() => {
    if (imagesLoaded && containerRef.current && backgroundImage) {
      const container = containerRef.current;
      fitToScreen(
        container.clientWidth,
        container.clientHeight,
        backgroundImage.width,
        backgroundImage.height
      );
    }
  }, [imagesLoaded, backgroundImage, fitToScreen]);

  if (!imagesLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-crd-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading layer images...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-900 overflow-hidden">
      <CanvasControls
        zoom={transform.scale}
        isPanning={isPanning}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={() => {
          if (containerRef.current && backgroundImage) {
            fitToScreen(
              containerRef.current.clientWidth,
              containerRef.current.clientHeight,
              backgroundImage.width,
              backgroundImage.height
            );
          }
        }}
        onResetView={resetView}
        focusMode={focusMode}
        showBackground={showBackground}
        onToggleBackground={() => setShowBackground(!showBackground)}
        onToggleFocusMode={() => onFocusModeToggle?.(!focusMode)}
      />
      
      <canvas
        ref={canvasRef}
        width={backgroundImage?.width || 800}
        height={backgroundImage?.height || 600}
        className="absolute inset-0 cursor-pointer"
        style={getTransformStyle()}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};
