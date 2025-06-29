
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
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

interface LayerImage {
  id: string;
  image: HTMLImageElement;
  loaded: boolean;
  error?: boolean;
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
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [layerImages, setLayerImages] = useState<Map<string, LayerImage>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredLayerId, setHoveredLayerId] = useState<string>('');

  // Canvas workspace dimensions - much larger for better navigation
  const CANVAS_WIDTH = 2400;
  const CANVAS_HEIGHT = 1600;
  const WORKSPACE_PADDING = 200;

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
    maxZoom: 3,
    zoomStep: 0.1
  });

  // Load background image
  useEffect(() => {
    if (!processedPSD.flattenedImageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setBackgroundImage(img);
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error('Failed to load background image');
      setIsLoading(false);
    };
    img.src = processedPSD.flattenedImageUrl;
  }, [processedPSD.flattenedImageUrl]);

  // Load layer images
  useEffect(() => {
    const loadLayerImages = async () => {
      const imageMap = new Map<string, LayerImage>();
      
      for (const layer of processedPSD.layers) {
        if (!layer.fullColorImageUrl) continue;
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const layerImage: LayerImage = {
          id: layer.id,
          image: img,
          loaded: false,
          error: false
        };
        
        imageMap.set(layer.id, layerImage);
        
        img.onload = () => {
          layerImage.loaded = true;
          setLayerImages(new Map(imageMap));
        };
        
        img.onerror = () => {
          layerImage.error = true;
          setLayerImages(new Map(imageMap));
        };
        
        img.src = layer.fullColorImageUrl;
      }
      
      setLayerImages(imageMap);
    };

    loadLayerImages();
  }, [processedPSD.layers]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          onFocusModeToggle?.();
          break;
        case 'b':
          e.preventDefault();
          onToggleBackground?.();
          break;
        case 'r':
          e.preventDefault();
          resetView();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onFocusModeToggle, onToggleBackground, resetView]);

  // Draw canvas content
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw workspace grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Calculate PSD positioning (centered in workspace)
    const psdWidth = processedPSD.dimensions.width;
    const psdHeight = processedPSD.dimensions.height;
    const offsetX = (CANVAS_WIDTH - psdWidth) / 2;
    const offsetY = (CANVAS_HEIGHT - psdHeight) / 2;

    // Draw background image if enabled and loaded
    if (showBackground && backgroundImage) {
      const bgOpacity = focusMode ? 0.3 : 1.0;
      ctx.globalAlpha = bgOpacity;
      ctx.drawImage(backgroundImage, offsetX, offsetY, psdWidth, psdHeight);
      ctx.globalAlpha = 1.0;
    }

    // Draw layers in proper order (z-index)
    const sortedLayers = [...processedPSD.layers].sort((a, b) => 
      (a.zIndex || 0) - (b.zIndex || 0)
    );

    for (const layer of sortedLayers) {
      if (hiddenLayers.has(layer.id)) continue;
      
      const layerImage = layerImages.get(layer.id);
      if (!layerImage?.loaded) continue;

      const isSelected = selectedLayerId === layer.id;
      const isHovered = hoveredLayerId === layer.id;
      
      // Calculate layer position
      const layerX = offsetX + layer.bounds.left;
      const layerY = offsetY + layer.bounds.top;
      const layerWidth = layer.bounds.right - layer.bounds.left;
      const layerHeight = layer.bounds.bottom - layer.bounds.top;

      // Apply focus mode dimming
      if (focusMode && !isSelected) {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1.0;
      }

      // Draw layer image
      ctx.drawImage(layerImage.image, layerX, layerY, layerWidth, layerHeight);
      ctx.globalAlpha = 1.0;

      // Draw selection/hover indicators
      if (isSelected || isHovered) {
        ctx.strokeStyle = isSelected ? '#00ff88' : '#ffffff';
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.setLineDash(isSelected ? [] : [5, 5]);
        ctx.strokeRect(layerX - 2, layerY - 2, layerWidth + 4, layerHeight + 4);
        ctx.setLineDash([]);
      }

      // Draw layer bounds for frame mode
      if (viewMode === 'frame') {
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(layerX, layerY, layerWidth, layerHeight);
        ctx.setLineDash([]);
      }
    }

    // Draw center reference point
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(CANVAS_WIDTH / 2 - 1, CANVAS_HEIGHT / 2 - 1, 2, 2);

  }, [processedPSD, backgroundImage, layerImages, showBackground, focusMode, selectedLayerId, hoveredLayerId, hiddenLayers, viewMode]);

  // Redraw when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle canvas clicks for layer selection
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.translateX) / transform.scale;
    const y = (e.clientY - rect.top - transform.translateY) / transform.scale;

    // Convert to PSD coordinates
    const psdWidth = processedPSD.dimensions.width;
    const psdHeight = processedPSD.dimensions.height;
    const offsetX = (CANVAS_WIDTH - psdWidth) / 2;
    const offsetY = (CANVAS_HEIGHT - psdHeight) / 2;
    
    const psdX = x - offsetX;
    const psdY = y - offsetY;

    // Find clicked layer (top-most first)
    const sortedLayers = [...processedPSD.layers]
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
      .filter(layer => !hiddenLayers.has(layer.id));

    for (const layer of sortedLayers) {
      if (psdX >= layer.bounds.left && psdX <= layer.bounds.right &&
          psdY >= layer.bounds.top && psdY <= layer.bounds.bottom) {
        onLayerSelect(layer.id);
        return;
      }
    }
  }, [isPanning, transform, processedPSD, hiddenLayers, onLayerSelect]);

  // Handle mouse hover for layer highlighting
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    handleMouseMove(e);

    if (isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.translateX) / transform.scale;
    const y = (e.clientY - rect.top - transform.translateY) / transform.scale;

    // Convert to PSD coordinates
    const psdWidth = processedPSD.dimensions.width;
    const psdHeight = processedPSD.dimensions.height;
    const offsetX = (CANVAS_WIDTH - psdWidth) / 2;
    const offsetY = (CANVAS_HEIGHT - psdHeight) / 2;
    
    const psdX = x - offsetX;
    const psdY = y - offsetY;

    // Find hovered layer
    let newHoveredLayerId = '';
    const sortedLayers = [...processedPSD.layers]
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
      .filter(layer => !hiddenLayers.has(layer.id));

    for (const layer of sortedLayers) {
      if (psdX >= layer.bounds.left && psdX <= layer.bounds.right &&
          psdY >= layer.bounds.top && psdY <= layer.bounds.bottom) {
        newHoveredLayerId = layer.id;
        break;
      }
    }

    if (newHoveredLayerId !== hoveredLayerId) {
      setHoveredLayerId(newHoveredLayerId);
    }
  }, [handleMouseMove, isPanning, transform, processedPSD, hiddenLayers, hoveredLayerId]);

  // Handle wheel zoom
  const handleCanvasWheel = useCallback((e: WheelEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const handled = handleWheel(e, rect);
    
    if (handled) {
      e.preventDefault();
    }
  }, [handleWheel]);

  // Add wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleCanvasWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleCanvasWheel);
  }, [handleCanvasWheel]);

  // Auto-fit to screen on load
  useEffect(() => {
    if (backgroundImage && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Fit the PSD content within the container
      fitToScreen(containerWidth, containerHeight, processedPSD.dimensions.width, processedPSD.dimensions.height);
    }
  }, [backgroundImage, fitToScreen, processedPSD.dimensions]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0b]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-crd-blue border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-slate-400">Loading PSD canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 relative bg-[#0a0a0b] overflow-hidden">
      {/* Canvas Controls */}
      <CanvasControls
        zoom={transform.scale}
        isPanning={isPanning}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={() => {
          if (containerRef.current) {
            const container = containerRef.current;
            fitToScreen(container.clientWidth, container.clientHeight, processedPSD.dimensions.width, processedPSD.dimensions.height);
          }
        }}
        onResetView={resetView}
        focusMode={focusMode}
        showBackground={showBackground}
        onToggleFocusMode={onFocusModeToggle}
        onToggleBackground={onToggleBackground}
      />

      {/* Canvas Container */}
      <div 
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={getTransformStyle()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block"
          onClick={handleCanvasClick}
          style={{
            imageRendering: 'pixelated',
            transformOrigin: 'center center'
          }}
        />
      </div>

      {/* Mode Indicator */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            viewMode === 'inspect' ? 'bg-green-400' :
            viewMode === 'frame' ? 'bg-blue-400' : 'bg-purple-400'
          }`}></div>
          {viewMode === 'inspect' && 'Inspect Mode'}
          {viewMode === 'frame' && 'Frame Analysis'}
          {viewMode === 'build' && 'Build Mode'}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-400">
        <div className="space-y-1">
          <div>F - Focus Mode</div>
          <div>B - Toggle Background</div>
          <div>R - Reset View</div>
          <div>⌘ + Scroll - Zoom</div>
        </div>
      </div>
    </div>
  );
};
