
import React, { useRef, useEffect, useState } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { LayerMode } from './LayerModeToggle';
import { CanvasControls } from './CanvasControls';
import { PSDErrorBoundary } from './PSDErrorBoundary';
import { PSDLoadingState } from './PSDLoadingState';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';

export interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  layerGroups?: LayerGroup[];
  onLayerSelect: (layerId: string) => void;
  frameBuilderMode?: boolean;
  focusMode?: boolean;
  mode?: LayerMode;
  flippedLayers?: Set<string>;
}

export const PSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  layerGroups = [],
  onLayerSelect,
  frameBuilderMode = false,
  focusMode = false,
  mode = 'elements',
  flippedLayers = new Set()
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  
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

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD || !canvasReady) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      setIsLoading(true);
      
      // Clear canvas with a subtle background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw PSD document bounds with improved styling
      const { width, height } = processedPSD;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);

      // Add a subtle shadow effect for the document
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.strokeRect(0, 0, width, height);
      ctx.shadowColor = 'transparent';

      // Draw visible layers with improved rendering
      processedPSD.layers.forEach((layer, index) => {
        if (hiddenLayers.has(layer.id)) return;

        const { left, top, right, bottom } = layer.bounds;
        const layerWidth = right - left;
        const layerHeight = bottom - top;

        // Enhanced layer visualization
        const isSelected = selectedLayerId === layer.id;
        const isHovered = false; // Could be enhanced with hover state
        
        // Layer bounds with better styling
        ctx.strokeStyle = isSelected ? '#3b82f6' : '#64748b';
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.setLineDash(isSelected ? [] : [5, 5]);
        ctx.strokeRect(left, top, layerWidth, layerHeight);
        ctx.setLineDash([]);

        // Layer background for better visibility
        if (isSelected) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
          ctx.fillRect(left, top, layerWidth, layerHeight);
        }

        // Layer name with improved typography
        ctx.fillStyle = isSelected ? '#1e40af' : '#475569';
        ctx.font = isSelected ? 'bold 14px Inter, Arial, sans-serif' : '12px Inter, Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Text background for better readability
        const text = layer.name || `Layer ${index + 1}`;
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 16;
        
        ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(left + 2, top + 2, textWidth + 8, textHeight + 4);
        
        ctx.fillStyle = isSelected ? '#ffffff' : '#1e293b';
        ctx.fillText(text, left + 6, top + 6);

        // Layer info overlay for selected layer
        if (isSelected) {
          const info = `${layerWidth}×${layerHeight}px`;
          ctx.font = '10px Inter, Arial, sans-serif';
          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.fillRect(left + 2, top + layerHeight - 16, ctx.measureText(info).width + 8, 14);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(info, left + 6, top + layerHeight - 12);
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Canvas drawing error:', error);
      setIsLoading(false);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!processedPSD) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / transform.scale - transform.translateX / transform.scale;
    const y = (event.clientY - rect.top) / transform.scale - transform.translateY / transform.scale;

    // Find clicked layer (reverse order for top-to-bottom selection)
    const reversedLayers = [...processedPSD.layers].reverse();
    for (const layer of reversedLayers) {
      if (hiddenLayers.has(layer.id)) continue;

      const { left, top, right, bottom } = layer.bounds;
      if (x >= left && x <= right && y >= top && y <= bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  const handleWheelEvent = (e: WheelEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const handled = handleWheel(e, rect);
    
    if (handled) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, [handleWheel]);

  useEffect(() => {
    if (processedPSD) {
      setCanvasReady(true);
      drawCanvas();
    }
  }, [processedPSD, selectedLayerId, hiddenLayers, transform, canvasReady]);

  useEffect(() => {
    if (processedPSD && containerRef.current && canvasReady) {
      const container = containerRef.current;
      fitToScreen(
        container.clientWidth,
        container.clientHeight,
        processedPSD.width,
        processedPSD.height
      );
    }
  }, [processedPSD, fitToScreen, canvasReady]);

  if (!processedPSD) {
    return (
      <PSDLoadingState 
        message="No PSD data available"
        showProgress={false}
      />
    );
  }

  if (isLoading) {
    return <PSDLoadingState message="Rendering canvas..." />;
  }

  return (
    <PSDErrorBoundary>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Canvas Controls */}
        <CanvasControls
          zoom={transform.scale}
          isPanning={isPanning}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitToScreen={() => {
            if (containerRef.current) {
              fitToScreen(
                containerRef.current.clientWidth,
                containerRef.current.clientHeight,
                processedPSD.width,
                processedPSD.height
              );
            }
          }}
          onResetView={resetView}
          focusMode={focusMode}
          frameBuilderMode={frameBuilderMode}
        />

        {/* Canvas Container with Transform */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={getTransformStyle()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            width={processedPSD.width}
            height={processedPSD.height}
            className="border-2 border-slate-300 bg-white shadow-xl rounded-lg"
            onClick={handleCanvasClick}
          />
        </div>

        {/* Enhanced Instructions */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-sm px-4 py-2 rounded-lg shadow-lg border border-slate-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium">Controls:</span>
            <span>CMD + Scroll to zoom</span>
            <span>•</span>
            <span>Click layers to select</span>
            <span>•</span>
            <span>Drag to pan</span>
          </div>
        </div>

        {/* Layer count indicator */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-700 text-sm px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="font-medium">{processedPSD.layers.length} layers</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-500">{processedPSD.layers.length - hiddenLayers.size} visible</span>
          </div>
        </div>
      </div>
    </PSDErrorBoundary>
  );
};
