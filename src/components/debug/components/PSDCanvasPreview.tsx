import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { CanvasControls } from './CanvasControls';

interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  layerGroups: LayerGroup[];
  onLayerSelect: (layerId: string) => void;
  frameBuilderMode?: boolean;
  focusMode?: boolean;
  mode?: 'elements' | 'frame' | 'preview';
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
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const { transform, isPanning, zoomIn, zoomOut, setZoom, resetView, fitToScreen, handleMouseDown, handleMouseMove, handleMouseUp, getTransformStyle } = useCanvasNavigation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each layer
    processedPSD.layers.forEach(layer => {
      const isSelected = layer.id === selectedLayerId;
      const isHovered = layer.id === hoveredLayerId;
      drawLayer(ctx, layer, isSelected, isHovered);
    });
  }, [processedPSD, selectedLayerId, hoveredLayerId, hiddenLayers, transform, drawLayer, mode, flippedLayers]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Adjust coordinates based on current zoom and pan
    const adjustedX = (x - transform.translateX) / transform.scale;
    const adjustedY = (y - transform.translateY) / transform.scale;

    // Find clicked layer
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id)) continue;

      const bounds = layer.bounds;
      if (adjustedX >= bounds.left && adjustedX <= bounds.right &&
          adjustedY >= bounds.top && adjustedY <= bounds.bottom) {
        onLayerSelect(layer.id);
        return;
      }
    }

    // Deselect if no layer is clicked
    onLayerSelect('');
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Adjust coordinates based on current zoom and pan
    const adjustedX = (x - transform.translateX) / transform.scale;
    const adjustedY = (y - transform.translateY) / transform.scale;

    // Find hovered layer
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id)) continue;

      const bounds = layer.bounds;
      if (adjustedX >= bounds.left && adjustedX <= bounds.right &&
          adjustedY >= bounds.top && adjustedY <= bounds.bottom) {
        setHoveredLayerId(layer.id);
        return;
      }
    }

    // Clear hover if no layer is hovered
    setHoveredLayerId(null);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredLayerId(null);
  };

  const getLayerColor = (layer: ProcessedPSDLayer): string => {
    switch (layer.semanticType) {
      case 'player': return 'rgba(59, 130, 246, 0.2)'; // Blue
      case 'background': return 'rgba(16, 185, 129, 0.2)'; // Green
      case 'stats': return 'rgba(245, 158, 11, 0.2)'; // Amber
      case 'logo': return 'rgba(139, 92, 246, 0.2)'; // Purple
      case 'border': return 'rgba(239, 68, 68, 0.2)'; // Red
      case 'text': return 'rgba(107, 114, 128, 0.2)'; // Gray
      case 'effect': return 'rgba(236, 72, 153, 0.2)'; // Pink
      default: return 'rgba(100, 116, 139, 0.2)'; // Slate
    }
  };

  const drawLayer = useCallback((ctx: CanvasRenderingContext2D, layer: ProcessedPSDLayer, isSelected: boolean, isHovered: boolean) => {
    if (hiddenLayers.has(layer.id) && mode !== 'preview') return;

    const bounds = layer.bounds;
    const layerWidth = bounds.right - bounds.left;
    const layerHeight = bounds.bottom - bounds.top;

    if (layerWidth <= 0 || layerHeight <= 0) return;

    ctx.save();

    try {
      // Mode-specific rendering logic
      if (mode === 'preview') {
        // Preview mode: show full card or flipped CRD branding
        const isFlipped = flippedLayers.has(layer.id);
        
        if (isFlipped) {
          // Draw CRD logo overlay
          ctx.fillStyle = '#00d4ff';
          ctx.globalAlpha = 0.8;
          ctx.fillRect(bounds.left, bounds.top, layerWidth, layerHeight);
          
          // Add CRD text
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 1;
          ctx.font = `${Math.min(layerHeight / 4, 24)}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText('CRD', bounds.left + layerWidth / 2, bounds.top + layerHeight / 2);
        } else {
          // Draw normal layer (full opacity for card view)
          ctx.globalAlpha = layer.opacity;
          ctx.fillStyle = getLayerColor(layer);
          ctx.fillRect(bounds.left, bounds.top, layerWidth, layerHeight);
        }
      } else if (mode === 'frame') {
        // Frame mode: visual separation of content vs design
        const isContentLayer = isContentOrDesign(layer) === 'content';
        const baseColor = isContentLayer ? '#3b82f6' : '#8b5cf6'; // Blue for content, purple for design
        
        if (isSelected) {
          ctx.globalAlpha = layer.opacity;
          ctx.fillStyle = baseColor;
        } else if (isHovered) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = baseColor;
        } else {
          ctx.globalAlpha = 0.1;
          ctx.fillStyle = baseColor;
        }
        
        ctx.fillRect(bounds.left, bounds.top, layerWidth, layerHeight);
        
        // Add category indicator
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.strokeRect(bounds.left, bounds.top, layerWidth, layerHeight);
      } else {
        // Elements mode: current behavior
        if (isSelected) {
          ctx.globalAlpha = layer.opacity;
          ctx.fillStyle = getLayerColor(layer);
        } else if (isHovered) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = getLayerColor(layer);
        } else {
          ctx.globalAlpha = 0.1;
          ctx.fillStyle = '#64748b';
        }
        
        ctx.fillRect(bounds.left, bounds.top, layerWidth, layerHeight);
      }

      // Selection highlight (all modes)
      if (isSelected) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.strokeRect(bounds.left - 1, bounds.top - 1, layerWidth + 2, layerHeight + 2);
      }

    } catch (error) {
      console.warn('Error drawing layer:', layer.name, error);
    } finally {
      ctx.restore();
    }
  }, [hiddenLayers, mode, flippedLayers]);

  const isContentOrDesign = (layer: ProcessedPSDLayer): 'content' | 'design' => {
    const name = layer.name.toLowerCase();
    const semanticType = layer.semanticType;

    if (
      semanticType === 'player' ||
      semanticType === 'background' ||
      name.includes('photo') ||
      name.includes('image') ||
      name.includes('player') ||
      name.includes('character') ||
      name.includes('subject') ||
      name.includes('portrait')
    ) {
      return 'content';
    }
    
    return 'design';
  };

  // Update the canvas background for different modes
  const getCanvasBackground = () => {
    switch (mode) {
      case 'preview':
        return 'bg-slate-900'; // Darker for full card preview
      case 'frame':
        return 'bg-slate-800'; // Medium for content/design separation
      default:
        return 'bg-transparent'; // Transparent for elements mode
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <CanvasControls
        zoom={transform.scale}
        isPanning={isPanning}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={() => fitToScreen(
          canvasRef.current?.clientWidth || 800,
          canvasRef.current?.clientHeight || 600,
          processedPSD.width,
          processedPSD.height
        )}
        onResetView={resetView}
      />
      
      <div 
        className={`w-full h-full ${getCanvasBackground()}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <canvas
          ref={canvasRef}
          style={getTransformStyle()}
          className="border border-slate-600 shadow-lg"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
        />
      </div>
    </div>
  );
};
