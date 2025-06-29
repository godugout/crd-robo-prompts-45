
import React, { useRef, useEffect, useState } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [autoFitApplied, setAutoFitApplied] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const {
    transform,
    isPanning,
    zoomIn,
    zoomOut,
    handleWheel,
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

  // Auto-fit content when PSD loads
  useEffect(() => {
    if (processedPSD && containerRef.current && !autoFitApplied) {
      setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          fitToScreen(containerWidth, containerHeight, processedPSD.width, processedPSD.height);
          setAutoFitApplied(true);
        }
      }, 100);
    }
  }, [processedPSD, fitToScreen, autoFitApplied]);

  // Reset auto-fit when PSD changes
  useEffect(() => {
    setAutoFitApplied(false);
    setCanvasReady(false);
  }, [processedPSD]);

  // Initialize canvas and set ready state
  useEffect(() => {
    if (processedPSD) {
      setTimeout(() => {
        drawCanvas();
        setCanvasReady(true);
      }, 100);
    }
  }, [processedPSD, selectedLayerId, hiddenLayers, focusMode, showBackground]);

  const handleCanvasWheel = (e: React.WheelEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const handled = handleWheel(e.nativeEvent, rect);
      if (handled) {
        setTimeout(drawCanvas, 0);
      }
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background if enabled
    if (showBackground) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw layers as colored rectangles (since we don't have actual image data)
    processedPSD.layers.forEach((layer, index) => {
      if (hiddenLayers.has(layer.id)) return;

      ctx.save();
      
      // Get layer dimensions from bounds
      const layerX = layer.bounds?.left || 0;
      const layerY = layer.bounds?.top || 0;
      const layerWidth = (layer.bounds?.right || 0) - (layer.bounds?.left || 0);
      const layerHeight = (layer.bounds?.bottom || 0) - (layer.bounds?.top || 0);
      
      // Skip layers with no dimensions
      if (layerWidth <= 0 || layerHeight <= 0) {
        ctx.restore();
        return;
      }
      
      // Apply focus mode dimming
      if (focusMode && layer.id !== selectedLayerId) {
        ctx.globalAlpha = 0.3;
      }
      
      // Generate a color based on layer index and type
      const hue = (index * 137.5) % 360; // Golden angle for good color distribution
      const opacity = layer.opacity || 1;
      
      // Draw layer as colored rectangle
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity * 0.7})`;
      ctx.fillRect(layerX, layerY, layerWidth, layerHeight);
      
      // Add layer border
      ctx.strokeStyle = `hsla(${hue}, 70%, 40%, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(layerX, layerY, layerWidth, layerHeight);
      
      // Highlight selected layer
      if (layer.id === selectedLayerId) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(layerX - 1, layerY - 1, layerWidth + 2, layerHeight + 2);
        
        // Add glow effect
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.strokeRect(layerX - 1, layerY - 1, layerWidth + 2, layerHeight + 2);
        ctx.shadowBlur = 0;
      }
      
      // Draw layer name if layer is large enough
      if (layerWidth > 60 && layerHeight > 20) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          layer.name,
          layerX + layerWidth / 2,
          layerY + layerHeight / 2 + 4
        );
      }
      
      ctx.restore();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!processedPSD || isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find clicked layer (reverse order to get topmost)
    const clickedLayer = [...processedPSD.layers].reverse().find(layer => {
      if (hiddenLayers.has(layer.id)) return false;
      
      const layerX = layer.bounds?.left || 0;
      const layerY = layer.bounds?.top || 0;
      const layerWidth = (layer.bounds?.right || 0) - (layer.bounds?.left || 0);
      const layerHeight = (layer.bounds?.bottom || 0) - (layer.bounds?.top || 0);
      
      return x >= layerX && x <= layerX + layerWidth && 
             y >= layerY && y <= layerY + layerHeight;
    });

    if (clickedLayer) {
      onLayerSelect(clickedLayer.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0b]">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-4 bg-[#1a1f2e] border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {onToggleBackground && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleBackground}
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {showBackground ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              Background
            </Button>
          )}
          
          {onFocusModeToggle && (
            <Button
              variant={focusMode ? "default" : "outline"}
              size="sm"
              onClick={onFocusModeToggle}
              className={focusMode ? "bg-crd-blue text-white" : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"}
            >
              Focus Mode
            </Button>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleCanvasWheel}
      >
        <div 
          style={getTransformStyle()}
          className="absolute inset-0 flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="border border-slate-600 shadow-lg bg-transparent"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              imageRendering: 'pixelated'
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {!canvasReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0b] bg-opacity-90">
          <div className="text-slate-400 text-center">
            <div className="text-lg font-medium mb-2">Preparing PSD Preview...</div>
            <div className="text-sm">
              {processedPSD?.layers?.length || 0} layers • {processedPSD?.width}×{processedPSD?.height}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-[#131316] border-t border-slate-700 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>Click layers to select • Drag to pan • Cmd+Scroll to zoom</span>
          <span>Zoom: {Math.round(transform.scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
