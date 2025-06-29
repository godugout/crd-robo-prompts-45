
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';

interface StablePSDCanvasViewerProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId?: string;
  hiddenLayers: Set<string>;
  reorderedLayers: ProcessedPSDLayer[];
  showBackground: boolean;
  viewMode: 'inspect' | 'thumbnails' | 'frame' | 'build';
  onLayerSelect: (layerId: string) => void;
}

export const StablePSDCanvasViewer: React.FC<StablePSDCanvasViewerProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  reorderedLayers,
  showBackground,
  viewMode,
  onLayerSelect
}) => {
  // All hooks are called at the top level - no conditional hooks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate canvas dimensions
  const calculateCanvasSize = useCallback(() => {
    if (!containerRef.current) return { width: 0, height: 0 };
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const aspectRatio = processedPSD.width / processedPSD.height;
    
    let calculatedWidth = containerWidth - 32; // Account for padding
    let calculatedHeight = calculatedWidth / aspectRatio;
    
    if (calculatedHeight > containerHeight - 32) {
      calculatedHeight = containerHeight - 32;
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    
    return {
      width: Math.max(calculatedWidth, 200),
      height: Math.max(calculatedHeight, 150)
    };
  }, [processedPSD.width, processedPSD.height]);

  // Resize observer effect
  useEffect(() => {
    const updateSize = () => {
      const newSize = calculateCanvasSize();
      setCanvasSize(newSize);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [calculateCanvasSize]);

  // Canvas rendering effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !processedPSD) return;

    setIsLoading(true);
    
    // Set canvas resolution
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background if enabled
    if (showBackground) {
      ctx.fillStyle = viewMode === 'inspect' ? '#1e293b' : '#0a0a0b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw layers
    const layersToRender = reorderedLayers.filter(layer => 
      !hiddenLayers.has(layer.id) && layer.hasRealImage && layer.imageUrl
    );

    let loadedImages = 0;
    const totalImages = layersToRender.length;

    if (totalImages === 0) {
      setIsLoading(false);
      return;
    }

    layersToRender.forEach((layer) => {
      if (!layer.imageUrl) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        if (!ctx) return;
        
        // Apply layer opacity
        ctx.globalAlpha = layer.opacity || 1;
        
        // Draw the image
        ctx.drawImage(
          img,
          layer.bounds.left,
          layer.bounds.top,
          layer.bounds.right - layer.bounds.left,
          layer.bounds.bottom - layer.bounds.top
        );
        
        // Reset alpha
        ctx.globalAlpha = 1;
        
        // Highlight selected layer
        if (layer.id === selectedLayerId) {
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            layer.bounds.left - 1,
            layer.bounds.top - 1,
            (layer.bounds.right - layer.bounds.left) + 2,
            (layer.bounds.bottom - layer.bounds.top) + 2
          );
        }
        
        loadedImages++;
        if (loadedImages === totalImages) {
          setIsLoading(false);
        }
      };
      
      img.onerror = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          setIsLoading(false);
        }
      };
      
      img.src = layer.imageUrl;
    });
  }, [processedPSD, reorderedLayers, hiddenLayers, showBackground, selectedLayerId, viewMode]);

  // Click handler for layer selection
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find clicked layer (reverse order for top-most)
    for (let i = reorderedLayers.length - 1; i >= 0; i--) {
      const layer = reorderedLayers[i];
      
      if (hiddenLayers.has(layer.id)) continue;
      
      const { left, top, right, bottom } = layer.bounds;
      
      if (x >= left && x <= right && y >= top && y <= bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  }, [reorderedLayers, hiddenLayers, onLayerSelect]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-[#0a0a0b] rounded relative"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-sm">Loading layers...</div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          cursor: 'pointer',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        className="border border-slate-600 rounded"
      />
      
      {/* View mode indicator */}
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Mode
      </div>
    </div>
  );
};
