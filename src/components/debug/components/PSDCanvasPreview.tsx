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

interface CardImageTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
  scaledWidth: number;
  scaledHeight: number;
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
  const [cardImage, setCardImage] = useState<HTMLImageElement | null>(null);
  const [cardTransform, setCardTransform] = useState<CardImageTransform | null>(null);

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

  // Load the flattened card image
  useEffect(() => {
    if (processedPSD.flattenedImageUrl) {
      const img = new Image();
      img.onload = () => setCardImage(img);
      img.onerror = () => console.warn('Failed to load card image');
      img.src = processedPSD.flattenedImageUrl;
    }
  }, [processedPSD.flattenedImageUrl]);

  // Sort layers by visual stacking order (z-index or inferredDepth)
  const sortedLayers = [...processedPSD.layers].sort((a, b) => {
    const aDepth = a.inferredDepth || a.bounds.top;
    const bDepth = b.inferredDepth || b.bounds.top;
    return aDepth - bDepth;
  });

  // Calculate card image transformation for proper layer positioning
  const calculateCardTransform = (canvas: HTMLCanvasElement, image: HTMLImageElement): CardImageTransform => {
    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    ) * 0.8; // Leave some padding
    
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;
    
    return {
      scale,
      offsetX,
      offsetY,
      scaledWidth,
      scaledHeight
    };
  };

  // Transform layer bounds to match card image positioning
  const transformLayerBounds = (layer: ProcessedPSDLayer, cardTransform: CardImageTransform, cardImage: HTMLImageElement) => {
    if (!cardTransform) return layer.bounds;
    
    // Calculate the scale factor from PSD dimensions to rendered card dimensions
    const psdToCardScale = cardTransform.scale;
    
    return {
      left: cardTransform.offsetX + (layer.bounds.left * psdToCardScale),
      top: cardTransform.offsetY + (layer.bounds.top * psdToCardScale),
      right: cardTransform.offsetX + (layer.bounds.right * psdToCardScale),
      bottom: cardTransform.offsetY + (layer.bounds.bottom * psdToCardScale)
    };
  };

  const drawLayer = (ctx: CanvasRenderingContext2D, layer: ProcessedPSDLayer, isSelected: boolean, isFlipped: boolean) => {
    if (hiddenLayers.has(layer.id) || !cardTransform || !cardImage) return;

    const transformedBounds = transformLayerBounds(layer, cardTransform, cardImage);
    const width = transformedBounds.right - transformedBounds.left;
    const height = transformedBounds.bottom - transformedBounds.top;

    // In focus mode, only show selected layer overlay
    if (focusMode && !isSelected) return;

    // For preview mode with flipped layers, show CRD branding
    if (mode === 'preview' && isFlipped) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.fillRect(transformedBounds.left, transformedBounds.top, width, height);
      
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CRD', transformedBounds.left + width / 2, transformedBounds.top + height / 2);
      return;
    }

    // Draw interactive layer overlay
    if (isSelected) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fillRect(transformedBounds.left, transformedBounds.top, width, height);
      
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.strokeRect(transformedBounds.left, transformedBounds.top, width, height);
      
      // Layer name tag
      ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
      ctx.fillRect(transformedBounds.left, transformedBounds.top - 20, Math.min(width, 120), 18);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(layer.name, transformedBounds.left + 4, transformedBounds.top - 6);
    } else if (mode === 'elements') {
      // Subtle hover regions for non-selected layers
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(transformedBounds.left, transformedBounds.top, width, height);
    }
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

    // Draw the full card image as base layer and calculate transform
    if (cardImage) {
      const transform = calculateCardTransform(canvas, cardImage);
      setCardTransform(transform);
      
      ctx.drawImage(
        cardImage, 
        transform.offsetX, 
        transform.offsetY, 
        transform.scaledWidth, 
        transform.scaledHeight
      );

      // Draw layer overlays in correct order with transformed positions
      sortedLayers.forEach((layer) => {
        const isSelected = selectedLayerId === layer.id;
        const isFlipped = flippedLayers.has(layer.id);
        drawLayer(ctx, layer, isSelected, isFlipped);
      });
    }

    // Frame builder highlight
    if (frameBuilderMode && selectedLayerId && cardTransform) {
      const selectedLayer = sortedLayers.find(l => l.id === selectedLayerId);
      if (selectedLayer) {
        const transformedBounds = transformLayerBounds(selectedLayer, cardTransform, cardImage!);
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          transformedBounds.left - 2,
          transformedBounds.top - 2,
          (transformedBounds.right - transformedBounds.left) + 4,
          (transformedBounds.bottom - transformedBounds.top) + 4
        );
        ctx.setLineDash([]);
      }
    }
  }, [processedPSD, selectedLayerId, hiddenLayers, focusMode, frameBuilderMode, mode, flippedLayers, cardImage, sortedLayers, canvasDimensions]);

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
    if (isPanning || !cardTransform || !cardImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.translateX) / transform.scale;
    const y = (e.clientY - rect.top - transform.translateY) / transform.scale;

    // Find clicked layer using transformed bounds (reverse order for top-most layer)
    for (let i = sortedLayers.length - 1; i >= 0; i--) {
      const layer = sortedLayers[i];
      if (hiddenLayers.has(layer.id)) continue;

      const transformedBounds = transformLayerBounds(layer, cardTransform, cardImage);
      if (x >= transformedBounds.left && x <= transformedBounds.right && 
          y >= transformedBounds.top && y <= transformedBounds.bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  const handleFitToScreen = () => {
    if (sortedLayers.length === 0) return;

    const visibleLayers = sortedLayers.filter(layer => !hiddenLayers.has(layer.id));
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
