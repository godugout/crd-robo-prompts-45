
import React, { useEffect, useRef, useState } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [autoFitApplied, setAutoFitApplied] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

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
    zoomStep: 0.1
  });

  // Auto-fit content to screen on mount or when PSD changes
  useEffect(() => {
    if (processedPSD && containerRef.current && !autoFitApplied) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate content dimensions based on PSD dimensions
      const contentWidth = processedPSD.width || 400;
      const contentHeight = processedPSD.height || 600;
      
      // Add some padding to the container dimensions
      const availableWidth = containerRect.width * 0.8;
      const availableHeight = containerRect.height * 0.8;
      
      // Use a slight delay to ensure DOM is fully rendered
      setTimeout(() => {
        fitToScreen(availableWidth, availableHeight, contentWidth, contentHeight);
        setAutoFitApplied(true);
      }, 100);
    }
  }, [processedPSD, fitToScreen, autoFitApplied]);

  // Reset auto-fit flag when PSD changes
  useEffect(() => {
    setAutoFitApplied(false);
  }, [processedPSD]);

  // Preload all layer images
  useEffect(() => {
    if (!processedPSD) return;

    const imageMap = new Map<string, HTMLImageElement>();
    let loadedCount = 0;
    const totalImages = processedPSD.layers.filter(layer => layer.imageData).length;

    if (totalImages === 0) {
      drawCanvas();
      return;
    }

    processedPSD.layers.forEach((layer) => {
      if (layer.imageData) {
        const img = new Image();
        img.onload = () => {
          imageMap.set(layer.id, img);
          loadedCount++;
          
          // When all images are loaded, update state and redraw
          if (loadedCount === totalImages) {
            setLoadedImages(imageMap);
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load image for layer ${layer.id}`);
          loadedCount++;
          
          if (loadedCount === totalImages) {
            setLoadedImages(imageMap);
          }
        };
        img.src = layer.imageData;
      }
    });
  }, [processedPSD]);

  // Redraw when images are loaded or other dependencies change
  useEffect(() => {
    drawCanvas();
  }, [loadedImages, selectedLayerId, hiddenLayers, focusMode, showBackground]);

  const handleCanvasWheel = (e: React.WheelEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const nativeEvent = e.nativeEvent as WheelEvent;
      handleWheel(nativeEvent, rect);
    }
  };

  const handleFitToScreen = () => {
    if (containerRef.current && processedPSD) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      const contentWidth = processedPSD.width || 400;
      const contentHeight = processedPSD.height || 600;
      
      const availableWidth = containerRect.width * 0.8;
      const availableHeight = containerRect.height * 0.8;
      
      fitToScreen(availableWidth, availableHeight, contentWidth, contentHeight);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match PSD dimensions
    canvas.width = processedPSD.width || 400;
    canvas.height = processedPSD.height || 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background if enabled
    if (showBackground) {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw visible layers using preloaded images
    processedPSD.layers.forEach((layer) => {
      if (hiddenLayers.has(layer.id)) return;

      const img = loadedImages.get(layer.id);
      if (img) {
        ctx.save();
        
        // Get layer dimensions from bounds
        const layerX = layer.bounds?.left || 0;
        const layerY = layer.bounds?.top || 0;
        const layerWidth = (layer.bounds?.right || 0) - (layer.bounds?.left || 0);
        const layerHeight = (layer.bounds?.bottom || 0) - (layer.bounds?.top || 0);
        
        // Apply focus mode dimming
        if (focusMode && layer.id !== selectedLayerId) {
          ctx.globalAlpha = 0.3;
        }
        
        // Draw the image
        ctx.drawImage(img, layerX, layerY, layerWidth, layerHeight);
        
        // Highlight selected layer
        if (layer.id === selectedLayerId) {
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(layerX, layerY, layerWidth, layerHeight);
        }
        
        ctx.restore();
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!processedPSD || isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find clicked layer (top-most first)
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id)) continue;

      // Get layer bounds
      const layerLeft = layer.bounds?.left || 0;
      const layerTop = layer.bounds?.top || 0;
      const layerRight = layer.bounds?.right || 0;
      const layerBottom = layer.bounds?.bottom || 0;

      if (x >= layerLeft && x <= layerRight &&
          y >= layerTop && y <= layerBottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  return (
    <div className="h-full bg-[#0a0a0b] relative overflow-hidden" ref={containerRef}>
      {/* Canvas Controls */}
      <CanvasControls
        zoom={transform.scale}
        isPanning={isPanning}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={handleFitToScreen}
        onResetView={resetView}
        focusMode={focusMode}
        showBackground={showBackground}
        onToggleFocusMode={onFocusModeToggle}
        onToggleBackground={onToggleBackground}
        frameBuilderMode={viewMode === 'build'}
      />

      {/* Canvas Container */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleCanvasWheel}
      >
        <div style={getTransformStyle()}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="border border-slate-600 shadow-2xl cursor-pointer"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {(!processedPSD || loadedImages.size === 0) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-400">Loading PSD preview...</div>
        </div>
      )}
    </div>
  );
};
