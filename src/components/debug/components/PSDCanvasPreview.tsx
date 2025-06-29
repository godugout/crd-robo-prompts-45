
import React, { useRef, useEffect, useState } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { LayerMode } from './LayerModeToggle';
import { CanvasControls } from './CanvasControls';
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
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw PSD document bounds - using width/height directly from processedPSD
    const { width, height } = processedPSD;
    ctx.strokeStyle = '#666';
    ctx.strokeRect(0, 0, width, height);

    // Draw visible layers
    processedPSD.layers.forEach(layer => {
      if (hiddenLayers.has(layer.id)) return;

      // Draw layer bounds
      const { left, top, right, bottom } = layer.bounds;
      const layerWidth = right - left;
      const layerHeight = bottom - top;

      ctx.strokeStyle = selectedLayerId === layer.id ? '#00ff00' : '#ff0000';
      ctx.lineWidth = selectedLayerId === layer.id ? 2 : 1;
      ctx.strokeRect(left, top, layerWidth, layerHeight);

      // Draw layer name as text overlay (since thumbnail is not available)
      ctx.fillStyle = selectedLayerId === layer.id ? '#00ff00' : '#ff0000';
      ctx.font = '12px Arial';
      ctx.fillText(layer.name || 'Layer', left + 5, top + 15);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!processedPSD) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / transform.scale - transform.translateX / transform.scale;
    const y = (event.clientY - rect.top) / transform.scale - transform.translateY / transform.scale;

    // Find clicked layer
    for (const layer of processedPSD.layers) {
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
    drawCanvas();
  }, [processedPSD, selectedLayerId, hiddenLayers, transform]);

  useEffect(() => {
    if (processedPSD && containerRef.current) {
      const container = containerRef.current;
      fitToScreen(
        container.clientWidth,
        container.clientHeight,
        processedPSD.width,
        processedPSD.height
      );
    }
  }, [processedPSD, fitToScreen]);

  if (!processedPSD) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        No PSD data available
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-slate-900">
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
          className="border border-slate-600 bg-white"
          onClick={handleCanvasClick}
        />
      </div>

      {/* Zoom Instructions */}
      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-2 rounded-lg">
        Hold CMD and scroll to zoom
      </div>
    </div>
  );
};
