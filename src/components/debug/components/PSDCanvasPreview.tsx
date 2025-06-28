
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { CanvasControls } from './CanvasControls';
import { LayerMode } from './LayerModeToggle';

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
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [lastRenderTime, setLastRenderTime] = useState(0);

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
  } = useCanvasNavigation();

  // Move drawLayer function declaration before its usage
  const drawLayer = useCallback((
    ctx: CanvasRenderingContext2D,
    layer: ProcessedPSDLayer,
    isHovered: boolean = false,
    isSelected: boolean = false,
    isFlipped: boolean = false
  ) => {
    if (!layer.extractedImage || hiddenLayers.has(layer.id) || !layer.extractedImage.fullColorImageUrl) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.save();
      
      // Set layer opacity and blend mode
      let opacity = layer.opacity;
      if (mode === 'elements') {
        if (isHovered && !isSelected) {
          opacity = 0.7; // Light preview on hover
        } else if (isSelected) {
          opacity = 1.0; // Full color on selection
        } else {
          opacity = 0.3; // Muted when not interacted with
        }
      } else if (mode === 'preview') {
        opacity = isFlipped ? 0.8 : 1.0; // Slightly transparent when showing CRD overlay
      }
      
      ctx.globalAlpha = opacity;
      
      // Draw the layer image
      ctx.drawImage(
        img,
        layer.bounds.left,
        layer.bounds.top,
        layer.bounds.right - layer.bounds.left,
        layer.bounds.bottom - layer.bounds.top
      );

      // Add selection highlight
      if (isSelected) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          layer.bounds.left - 1,
          layer.bounds.top - 1,
          layer.bounds.right - layer.bounds.left + 2,
          layer.bounds.bottom - layer.bounds.top + 2
        );
      }

      // Add hover highlight
      if (isHovered && !isSelected) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          layer.bounds.left,
          layer.bounds.top,
          layer.bounds.right - layer.bounds.left,
          layer.bounds.bottom - layer.bounds.top
        );
      }

      // Add CRD overlay for flipped layers in preview mode
      if (mode === 'preview' && isFlipped) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.fillRect(
          layer.bounds.left,
          layer.bounds.top,
          layer.bounds.right - layer.bounds.left,
          layer.bounds.bottom - layer.bounds.top
        );
        
        // Add CRD logo placeholder
        ctx.fillStyle = '#3b82f6';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          'CRD',
          layer.bounds.left + (layer.bounds.right - layer.bounds.left) / 2,
          layer.bounds.top + (layer.bounds.bottom - layer.bounds.top) / 2
        );
      }
      
      ctx.restore();
    };
    
    img.src = layer.extractedImage.fullColorImageUrl;
  }, [hiddenLayers, mode]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to PSD dimensions
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;

    // Clear canvas
    if (mode === 'preview') {
      // Show full card background in preview mode
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Draw layers based on mode
    processedPSD.layers.forEach(layer => {
      const isHovered = hoveredLayerId === layer.id;
      const isSelected = selectedLayerId === layer.id;
      const isFlipped = flippedLayers.has(layer.id);
      
      drawLayer(ctx, layer, isHovered, isSelected, isFlipped);
    });

    setLastRenderTime(Date.now());
  }, [processedPSD, selectedLayerId, hiddenLayers, hoveredLayerId, mode, flippedLayers, drawLayer]);

  // Handle canvas interactions
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = ((event.clientX - rect.left) * scaleX - transform.translateX) / transform.scale;
    const y = ((event.clientY - rect.top) * scaleY - transform.translateY) / transform.scale;

    // Find clicked layer (reverse order to get topmost)
    const clickedLayer = [...processedPSD.layers].reverse().find(layer => {
      return !hiddenLayers.has(layer.id) &&
             x >= layer.bounds.left &&
             x <= layer.bounds.right &&
             y >= layer.bounds.top &&
             y <= layer.bounds.bottom;
    });

    if (clickedLayer) {
      onLayerSelect(clickedLayer.id);
    }
  }, [isPanning, transform, processedPSD.layers, hiddenLayers, onLayerSelect]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    handleMouseMove(event);
    
    if (isPanning || mode !== 'elements') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = ((event.clientX - rect.left) * scaleX - transform.translateX) / transform.scale;
    const y = ((event.clientY - rect.top) * scaleY - transform.translateY) / transform.scale;

    // Find hovered layer
    const hoveredLayer = [...processedPSD.layers].reverse().find(layer => {
      return !hiddenLayers.has(layer.id) &&
             x >= layer.bounds.left &&
             x <= layer.bounds.right &&
             y >= layer.bounds.top &&
             y <= layer.bounds.bottom;
    });

    setHoveredLayerId(hoveredLayer?.id || null);
  }, [isPanning, transform, processedPSD.layers, hiddenLayers, mode, handleMouseMove]);

  // Render canvas when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Fit to screen on initial load
  useEffect(() => {
    if (containerRef.current && processedPSD) {
      const container = containerRef.current;
      fitToScreen(container.clientWidth, container.clientHeight, processedPSD.width, processedPSD.height);
    }
  }, [processedPSD, fitToScreen]);

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      <CanvasControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onFitToScreen={() => {
          if (containerRef.current && processedPSD) {
            fitToScreen(
              containerRef.current.clientWidth,
              containerRef.current.clientHeight - 60,
              processedPSD.width,
              processedPSD.height
            );
          }
        }}
        zoom={transform.scale}
        focusMode={focusMode}
        frameBuilderMode={frameBuilderMode}
      />
      
      <div className="flex-1 overflow-hidden bg-slate-900 relative">
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          <canvas
            ref={canvasRef}
            className="border border-slate-600 shadow-lg"
            style={getTransformStyle()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
          />
        </div>
        
        {/* Mode indicator */}
        <div className="absolute top-4 left-4 bg-slate-800 border border-slate-600 rounded px-3 py-1">
          <span className="text-sm text-slate-300 capitalize">{mode} Mode</span>
        </div>
        
        {/* Render stats */}
        <div className="absolute bottom-4 right-4 bg-slate-800 border border-slate-600 rounded px-3 py-1">
          <span className="text-xs text-slate-400">
            Last render: {new Date(lastRenderTime).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};
