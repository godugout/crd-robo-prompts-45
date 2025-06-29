import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { CanvasControls } from './CanvasControls';

interface PSDCanvasPreviewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  cardImageUrl?: string;
  cardImageDimensions?: { width: number; height: number };
}

export const PSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  cardImageUrl,
  cardImageDimensions
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCardImage, setShowCardImage] = useState(true);
  
  const {
    transform,
    isPanning,
    zoomIn,
    zoomOut,
    resetView,
    fitToScreen,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getTransformStyle
  } = useCanvasNavigation({
    minZoom: 0.1,
    maxZoom: 5,
    zoomStep: 0.1
  });

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw checkered background when card image is hidden
    if (!showCardImage) {
      const checkSize = 20;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#e0e0e0';
      for (let x = 0; x < canvas.width; x += checkSize) {
        for (let y = 0; y < canvas.height; y += checkSize) {
          if ((Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2 === 1) {
            ctx.fillRect(x, y, checkSize, checkSize);
          }
        }
      }
    }

    // Draw card image if visible and available
    if (showCardImage && cardImageUrl && cardImageDimensions) {
      const img = new Image();
      img.onload = () => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        const containerAspect = containerRect.width / containerRect.height;
        const imageAspect = cardImageDimensions.width / cardImageDimensions.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imageAspect > containerAspect) {
          drawWidth = containerRect.width * 0.8;
          drawHeight = drawWidth / imageAspect;
          offsetX = (containerRect.width - drawWidth) / 2;
          offsetY = (containerRect.height - drawHeight) / 2;
        } else {
          drawHeight = containerRect.height * 0.8;
          drawWidth = drawHeight * imageAspect;
          offsetX = (containerRect.width - drawWidth) / 2;
          offsetY = (containerRect.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        drawLayerOverlays(ctx, drawWidth, drawHeight, offsetX, offsetY);
      };
      img.src = cardImageUrl;
    } else {
      drawLayerOverlays(ctx, canvas.width, canvas.height, 0, 0);
    }
  }, [layers, selectedLayerId, hiddenLayers, cardImageUrl, cardImageDimensions, showCardImage]);

  const drawLayerOverlays = (
    ctx: CanvasRenderingContext2D,
    cardWidth: number,
    cardHeight: number,
    cardOffsetX: number,
    cardOffsetY: number
  ) => {
    if (!cardImageDimensions) return;

    const scaleX = cardWidth / cardImageDimensions.width;
    const scaleY = cardHeight / cardImageDimensions.height;

    layers.forEach((layer) => {
      if (hiddenLayers.has(layer.id)) return;

      const scaledBounds = {
        left: layer.bounds.left * scaleX + cardOffsetX,
        top: layer.bounds.top * scaleY + cardOffsetY,
        right: layer.bounds.right * scaleX + cardOffsetX,
        bottom: layer.bounds.bottom * scaleY + cardOffsetY
      };

      const width = scaledBounds.right - scaledBounds.left;
      const height = scaledBounds.bottom - scaledBounds.top;

      const isSelected = selectedLayerId === layer.id;

      // Draw layer boundary
      ctx.strokeStyle = isSelected ? '#3b82f6' : '#10b981';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash(isSelected ? [] : [5, 5]);
      ctx.strokeRect(scaledBounds.left, scaledBounds.top, width, height);

      // Draw layer fill
      ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(scaledBounds.left, scaledBounds.top, width, height);

      // Draw layer label
      const label = `${layer.name} (${layer.semanticType || layer.type})`;
      ctx.fillStyle = isSelected ? '#1e40af' : '#059669';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(label, scaledBounds.left + 4, scaledBounds.top - 4);

      ctx.setLineDash([]);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !cardImageDimensions) return;

    const rect = canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate card image dimensions and position
    const containerAspect = containerRect.width / containerRect.height;
    const imageAspect = cardImageDimensions.width / cardImageDimensions.height;

    let cardWidth, cardHeight, cardOffsetX, cardOffsetY;

    if (imageAspect > containerAspect) {
      cardWidth = containerRect.width * 0.8;
      cardHeight = cardWidth / imageAspect;
      cardOffsetX = (containerRect.width - cardWidth) / 2;
      cardOffsetY = (containerRect.height - cardHeight) / 2;
    } else {
      cardHeight = containerRect.height * 0.8;
      cardWidth = cardHeight * imageAspect;
      cardOffsetX = (containerRect.width - cardWidth) / 2;
      cardOffsetY = (containerRect.height - cardHeight) / 2;
    }

    const scaleX = cardWidth / cardImageDimensions.width;
    const scaleY = cardHeight / cardImageDimensions.height;

    // Check if click is within any visible layer
    for (const layer of layers) {
      if (hiddenLayers.has(layer.id)) continue;

      const scaledBounds = {
        left: layer.bounds.left * scaleX + cardOffsetX,
        top: layer.bounds.top * scaleY + cardOffsetY,
        right: layer.bounds.right * scaleX + cardOffsetX,
        bottom: layer.bounds.bottom * scaleY + cardOffsetY
      };

      if (
        clickX >= scaledBounds.left &&
        clickX <= scaledBounds.right &&
        clickY >= scaledBounds.top &&
        clickY <= scaledBounds.bottom
      ) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  const handleCanvasWheel = useCallback((e: WheelEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const handled = handleWheel(e, rect);
    
    if (!handled) {
      // Allow normal scrolling when CMD is not pressed
      return;
    }
  }, [handleWheel]);

  const handleFitToScreen = () => {
    const container = containerRef.current;
    if (!container || !cardImageDimensions) return;
    
    const rect = container.getBoundingClientRect();
    fitToScreen(rect.width, rect.height, cardImageDimensions.width, cardImageDimensions.height);
  };

  useEffect(() => {
    if (!cardImageDimensions) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = cardImageDimensions.width;
    canvas.height = cardImageDimensions.height;
  }, [cardImageDimensions]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleCanvasWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleCanvasWheel);
    };
  }, [handleCanvasWheel]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* Canvas Controls */}
      <CanvasControls
        zoom={transform.scale}
        isPanning={isPanning}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={handleFitToScreen}
        onResetView={resetView}
      />

      {/* Card Image Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowCardImage(!showCardImage)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showCardImage
              ? 'bg-crd-blue text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {showCardImage ? 'Hide Card' : 'Show Card'}
        </button>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div style={getTransformStyle()}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-slate-700 bg-slate-800"
            onClick={handleCanvasClick}
            style={{ 
              cursor: isPanning ? 'grabbing' : 'crosshair',
              touchAction: 'none'
            }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-sm text-slate-300">
        <div className="space-y-1">
          <div>• Click layers to select them</div>
          <div>• Drag to pan around</div>
          <div>• <kbd className="px-1 py-0.5 bg-slate-700 rounded text-xs">⌘</kbd> + scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};
