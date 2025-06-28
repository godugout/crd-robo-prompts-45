
import React, { useEffect, useRef, useState } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { CanvasControls } from './CanvasControls';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
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
  const [isLoading, setIsLoading] = useState(false);

  const {
    transform,
    isPanning,
    zoomIn,
    zoomOut,
    setZoom,
    resetView,
    fitToScreen,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getTransformStyle
  } = useCanvasNavigation();

  // Function to draw a layer on canvas
  const drawLayer = (
    ctx: CanvasRenderingContext2D,
    layer: ProcessedPSDLayer,
    isFlipped: boolean = false
  ) => {
    if (hiddenLayers.has(layer.id)) return;

    // Use preview image if available, otherwise create a placeholder
    if (layer.preview) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = layer.opacity;
        
        if (isFlipped) {
          // Draw CRD logo placeholder instead
          ctx.fillStyle = '#0066ff';
          ctx.fillRect(layer.bounds.left, layer.bounds.top, 
                      layer.bounds.right - layer.bounds.left, 
                      layer.bounds.bottom - layer.bounds.top);
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('CRD', 
                      (layer.bounds.left + layer.bounds.right) / 2,
                      (layer.bounds.top + layer.bounds.bottom) / 2);
        } else {
          ctx.drawImage(img, layer.bounds.left, layer.bounds.top,
                       layer.bounds.right - layer.bounds.left,
                       layer.bounds.bottom - layer.bounds.top);
        }
        
        ctx.restore();
      };
      img.src = layer.preview;
    } else {
      // Draw placeholder rectangle
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      
      if (isFlipped) {
        ctx.fillStyle = '#0066ff';
        ctx.fillRect(layer.bounds.left, layer.bounds.top, 
                    layer.bounds.right - layer.bounds.left, 
                    layer.bounds.bottom - layer.bounds.top);
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRD', 
                    (layer.bounds.left + layer.bounds.right) / 2,
                    (layer.bounds.top + layer.bounds.bottom) / 2);
      } else {
        // Color based on layer type
        const layerColors = {
          'text': '#4ade80',
          'image': '#3b82f6', 
          'shape': '#f59e0b',
          'group': '#8b5cf6'
        };
        ctx.fillStyle = layerColors[layer.type as keyof typeof layerColors] || '#6b7280';
        ctx.fillRect(layer.bounds.left, layer.bounds.top, 
                    layer.bounds.right - layer.bounds.left, 
                    layer.bounds.bottom - layer.bounds.top);
        
        // Add layer name
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(layer.name, 
                    (layer.bounds.left + layer.bounds.right) / 2,
                    (layer.bounds.top + layer.bounds.bottom) / 2);
      }
      
      ctx.restore();
    }

    // Highlight selected layer
    if (selectedLayerId === layer.id) {
      ctx.save();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.strokeRect(layer.bounds.left - 2, layer.bounds.top - 2,
                    (layer.bounds.right - layer.bounds.left) + 4,
                    (layer.bounds.bottom - layer.bounds.top) + 4);
      ctx.restore();
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background based on mode
    if (mode === 'preview') {
      // Show full card background
      if (processedPSD.flattenedImageUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Then draw interactive layers
          processedPSD.layers.forEach(layer => {
            const isFlipped = flippedLayers.has(layer.id);
            drawLayer(ctx, layer, isFlipped);
          });
        };
        img.src = processedPSD.flattenedImageUrl;
      } else {
        // Fallback gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      // Transparent background for elements and frame modes
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw layers based on mode
    if (mode === 'preview') {
      // In preview mode, layers are drawn as interactive overlays
      return; // Already handled above
    } else {
      // Draw all layers
      processedPSD.layers.forEach(layer => {
        drawLayer(ctx, layer);
      });
    }
  };

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX / transform.scale;
    const y = (event.clientY - rect.top) * scaleY / transform.scale;

    // Find clicked layer (reverse order for top-most layer)
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id)) continue;
      
      if (x >= layer.bounds.left && x <= layer.bounds.right &&
          y >= layer.bounds.top && y <= layer.bounds.bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  // Effect to redraw canvas when dependencies change
  useEffect(() => {
    redrawCanvas();
  }, [processedPSD, selectedLayerId, hiddenLayers, mode, flippedLayers]);

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && processedPSD) {
        const container = containerRef.current;
        fitToScreen(container.clientWidth, container.clientHeight, processedPSD.width, processedPSD.height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial fit

    return () => window.removeEventListener('resize', handleResize);
  }, [processedPSD, fitToScreen]);

  if (!processedPSD) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0b]">
        <div className="text-slate-400">No PSD loaded</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 overflow-hidden bg-[#0a0a0b]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
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

      <div 
        className="flex items-center justify-center h-full"
        style={getTransformStyle()}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border border-slate-600 shadow-2xl cursor-crosshair"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            imageRendering: 'pixelated'
          }}
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#1a1f2e] p-4 rounded-lg">
            <div className="text-white">Loading canvas...</div>
          </div>
        </div>
      )}
    </div>
  );
};
