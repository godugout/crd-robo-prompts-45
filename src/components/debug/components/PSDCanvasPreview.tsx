
import React, { useRef, useEffect, useState } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { CanvasControls } from './CanvasControls';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';

export type LayerMode = 'elements' | 'frame' | 'preview';

interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  layerGroups: LayerGroup[];
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
  layerGroups,
  onLayerSelect,
  frameBuilderMode = false,
  focusMode = false,
  mode = 'elements',
  flippedLayers = new Set()
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

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
    getTransformStyle
  } = useCanvasNavigation({
    minZoom: 0.1,
    maxZoom: 5,
    zoomStep: 0.1
  });

  // Function to draw a layer with proper bounds
  const drawLayer = (ctx: CanvasRenderingContext2D, layer: ProcessedPSDLayer, isSelected: boolean, isFlipped: boolean) => {
    if (hiddenLayers.has(layer.id)) return;

    const { bounds } = layer;
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;

    // Set layer opacity
    ctx.globalAlpha = layer.opacity;

    // For preview mode, show flipped layers differently
    if (mode === 'preview' && isFlipped) {
      // Draw CRD branding overlay
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Blue overlay
      ctx.fillRect(bounds.left, bounds.top, width, height);
      
      // Add CRD text
      ctx.fillStyle = '#3b82f6';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CRD', bounds.left + width / 2, bounds.top + height / 2);
    } else {
      // Draw layer rectangle placeholder
      ctx.fillStyle = isSelected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(148, 163, 184, 0.2)';
      ctx.fillRect(bounds.left, bounds.top, width, height);
    }

    // Draw border
    ctx.strokeStyle = isSelected ? '#22c55e' : '#64748b';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.strokeRect(bounds.left, bounds.top, width, height);

    // Draw layer name
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(layer.name, bounds.left + 4, bounds.top + 16);

    // Reset alpha
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = focusMode ? '#000000' : '#1a1f2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw layers based on mode
    processedPSD.layers.forEach((layer) => {
      const isSelected = selectedLayerId === layer.id;
      const isFlipped = flippedLayers.has(layer.id);
      
      // In focus mode, only show selected layer
      if (focusMode && !isSelected) return;
      
      drawLayer(ctx, layer, isSelected, isFlipped);
    });

    // Draw selection highlight for frame builder mode
    if (frameBuilderMode && selectedLayerId) {
      const selectedLayer = processedPSD.layers.find(l => l.id === selectedLayerId);
      if (selectedLayer) {
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          selectedLayer.bounds.left - 2,
          selectedLayer.bounds.top - 2,
          (selectedLayer.bounds.right - selectedLayer.bounds.left) + 4,
          (selectedLayer.bounds.bottom - selectedLayer.bounds.top) + 4
        );
        ctx.setLineDash([]);
      }
    }
  }, [processedPSD, selectedLayerId, hiddenLayers, focusMode, frameBuilderMode, mode, flippedLayers]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && canvasRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        
        setCanvasDimensions({
          width: rect.width,
          height: rect.height
        });

        const canvas = canvasRef.current;
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.translateX) / transform.scale;
    const y = (e.clientY - rect.top - transform.translateY) / transform.scale;

    // Find clicked layer
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id)) continue;

      const { bounds } = layer;
      if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  const handleFitToScreen = () => {
    if (processedPSD.layers.length === 0) return;

    // Calculate bounds of all visible layers
    const visibleLayers = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));
    if (visibleLayers.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    visibleLayers.forEach(layer => {
      minX = Math.min(minX, layer.bounds.left);
      minY = Math.min(minY, layer.bounds.top);
      maxX = Math.max(maxX, layer.bounds.right);
      maxY = Math.max(maxY, layer.bounds.bottom);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    fitToScreen(canvasDimensions.width, canvasDimensions.height, contentWidth, contentHeight);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0a0b] overflow-hidden">
      <CanvasControls
        zoom={transform.scale}
        isPanning={isPanning}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={handleFitToScreen}
        onResetView={resetView}
        focusMode={focusMode}
        frameBuilderMode={frameBuilderMode}
      />
      
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className="cursor-grab active:cursor-grabbing"
        style={getTransformStyle()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      />
    </div>
  );
};
