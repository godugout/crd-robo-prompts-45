import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
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
  
  // Canvas interaction state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });

  // Workspace constants
  const WORKSPACE_SIZE = 2000;
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;

  // Calculate PSD dimensions and center position
  const psdWidth = processedPSD.width || 800;
  const psdHeight = processedPSD.height || 600;
  const centerX = WORKSPACE_SIZE / 2 - psdWidth / 2;
  const centerY = WORKSPACE_SIZE / 2 - psdHeight / 2;

  // Memoized visible layers for performance
  const visibleLayers = useMemo(() => {
    return processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));
  }, [processedPSD.layers, hiddenLayers]);

  // Canvas rendering function
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan transformations
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Draw workspace grid (subtle)
    if (viewMode === 'inspect') {
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
      ctx.lineWidth = 1 / zoom;
      const gridSize = 50;
      
      for (let x = 0; x <= WORKSPACE_SIZE; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORKSPACE_SIZE);
        ctx.stroke();
      }
      
      for (let y = 0; y <= WORKSPACE_SIZE; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORKSPACE_SIZE, y);
        ctx.stroke();
      }
    }

    // Draw PSD background if enabled
    if (showBackground && processedPSD.flattenedImageUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = processedPSD.flattenedImageUrl!;
        });
        
        const opacity = focusMode ? 0.3 : 1;
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, centerX, centerY, psdWidth, psdHeight);
        ctx.globalAlpha = 1;
      } catch (error) {
        console.warn('Failed to load PSD background:', error);
      }
    }

    // Draw layers based on view mode
    if (viewMode === 'inspect') {
      await renderInspectMode(ctx);
    } else if (viewMode === 'frame') {
      await renderFrameMode(ctx);
    } else if (viewMode === 'build') {
      await renderBuildMode(ctx);
    }

    ctx.restore();
  }, [processedPSD, visibleLayers, selectedLayerId, zoom, pan, focusMode, showBackground, viewMode, hiddenLayers]);

  // Render modes
  const renderInspectMode = async (ctx: CanvasRenderingContext2D) => {
    // Draw all visible layers with proper hierarchy
    for (const layer of visibleLayers) {
      if (!layer.imageUrl) continue;

      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = layer.imageUrl!;
        });

        // Calculate layer position
        const layerX = centerX + layer.bounds.left;
        const layerY = centerY + layer.bounds.top;
        const layerWidth = layer.bounds.right - layer.bounds.left;
        const layerHeight = layer.bounds.bottom - layer.bounds.top;

        // Apply focus mode dimming for non-selected layers
        let opacity = layer.opacity || 1;
        if (focusMode && layer.id !== selectedLayerId) {
          opacity *= 0.3;
        }

        ctx.globalAlpha = opacity;
        ctx.drawImage(img, layerX, layerY, layerWidth, layerHeight);

        // Draw selection highlight
        if (layer.id === selectedLayerId) {
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2 / zoom;
          ctx.setLineDash([5 / zoom, 5 / zoom]);
          ctx.strokeRect(layerX, layerY, layerWidth, layerHeight);
          ctx.setLineDash([]);
        }

        ctx.globalAlpha = 1;
      } catch (error) {
        console.warn(`Failed to load layer image for ${layer.name}:`, error);
      }
    }
  };

  const renderFrameMode = async (ctx: CanvasRenderingContext2D) => {
    // In frame mode, show layers with frame analysis overlay
    await renderInspectMode(ctx);
    
    // Add frame analysis overlay
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.lineWidth = 3 / zoom;
    ctx.strokeRect(centerX, centerY, psdWidth, psdHeight);
    
    // Add frame corner indicators
    const cornerSize = 20 / zoom;
    const corners = [
      [centerX, centerY],
      [centerX + psdWidth, centerY],
      [centerX, centerY + psdHeight],
      [centerX + psdWidth, centerY + psdHeight]
    ];
    
    ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
    corners.forEach(([x, y]) => {
      ctx.fillRect(x - cornerSize/2, y - cornerSize/2, cornerSize, cornerSize);
    });
  };

  const renderBuildMode = async (ctx: CanvasRenderingContext2D) => {
    // In build mode, show construction guides
    await renderInspectMode(ctx);
    
    // Add construction grid
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.4)';
    ctx.lineWidth = 1 / zoom;
    
    const gridSpacing = psdWidth / 8;
    for (let i = 1; i < 8; i++) {
      const x = centerX + i * gridSpacing;
      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY + psdHeight);
      ctx.stroke();
    }
    
    const gridSpacingY = psdHeight / 8;
    for (let i = 1; i < 8; i++) {
      const y = centerY + i * gridSpacingY;
      ctx.beginPath();
      ctx.moveTo(centerX, y);
      ctx.lineTo(centerX + psdWidth, y);
      ctx.stroke();
    }
  };

  // Pan boundaries to keep content visible
  const constrainPan = useCallback((newPan: { x: number; y: number }) => {
    const maxPan = 200;
    return {
      x: Math.max(-WORKSPACE_SIZE + maxPan, Math.min(maxPan, newPan.x)),
      y: Math.max(-WORKSPACE_SIZE + maxPan, Math.min(maxPan, newPan.y))
    };
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastPan(pan);
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) / zoom;
    const deltaY = (e.clientY - dragStart.y) / zoom;
    
    const newPan = constrainPan({
      x: lastPan.x + deltaX,
      y: lastPan.y + deltaY
    });
    
    setPan(newPan);
  }, [isDragging, dragStart, lastPan, zoom, constrainPan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev * 1.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev / 1.2));
  }, []);

  const handleFitToScreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scaleX = containerRect.width / (psdWidth + 200);
    const scaleY = containerRect.height / (psdHeight + 200);
    const fitZoom = Math.min(scaleX, scaleY, 1);
    
    setZoom(fitZoom);
    setPan({
      x: (containerRect.width / fitZoom - WORKSPACE_SIZE) / 2,
      y: (containerRect.height / fitZoom - WORKSPACE_SIZE) / 2
    });
  }, [psdWidth, psdHeight]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * delta)));
    }
  }, []);

  // Layer click detection
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left) / zoom - pan.x;
    const canvasY = (e.clientY - rect.top) / zoom - pan.y;

    // Check which layer was clicked (reverse order for top-to-bottom)
    for (let i = visibleLayers.length - 1; i >= 0; i--) {
      const layer = visibleLayers[i];
      const layerX = centerX + layer.bounds.left;
      const layerY = centerY + layer.bounds.top;
      const layerWidth = layer.bounds.right - layer.bounds.left;
      const layerHeight = layer.bounds.bottom - layer.bounds.top;

      if (canvasX >= layerX && canvasX <= layerX + layerWidth &&
          canvasY >= layerY && canvasY <= layerY + layerHeight) {
        onLayerSelect(layer.id);
        return;
      }
    }
  }, [isDragging, zoom, pan, visibleLayers, centerX, centerY, onLayerSelect]);

  // Effect to re-render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Initial fit to screen
  useEffect(() => {
    const timer = setTimeout(handleFitToScreen, 100);
    return () => clearTimeout(timer);
  }, [handleFitToScreen]);

  return (
    <div className="relative w-full h-full bg-[#0a0a0b] overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onClick={handleCanvasClick}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </div>

      <CanvasControls
        zoom={zoom}
        isPanning={isDragging}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onResetView={handleResetView}
        focusMode={focusMode}
        showBackground={showBackground}
        onToggleFocusMode={onFocusModeToggle}
        onToggleBackground={onToggleBackground}
      />

      {/* View Mode Indicator */}
      <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-600">
        <div className="text-xs text-slate-300 font-medium">
          {viewMode === 'inspect' && 'Layer Inspection Mode'}
          {viewMode === 'frame' && 'Frame Analysis Mode'}
          {viewMode === 'build' && 'Frame Building Mode'}
        </div>
      </div>
    </div>
  );
};
