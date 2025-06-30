
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';

interface PSDCanvasPreviewProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId?: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  focusMode: boolean;
  onFocusModeToggle: () => void;
  showBackground: boolean;
  onToggleBackground: () => void;
  viewMode: 'inspect' | 'frame' | 'build';
}

export const EnhancedPSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  focusMode,
  onFocusModeToggle,
  showBackground,
  onToggleBackground,
  viewMode
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Preload layer images
  useEffect(() => {
    const imageMap = new Map<string, HTMLImageElement>();
    let loadCount = 0;
    const totalImages = processedPSD.layers.filter(layer => layer.hasRealImage && layer.imageUrl).length;

    processedPSD.layers.forEach(layer => {
      if (!layer.hasRealImage || !layer.imageUrl) return;

      const img = new Image();
      img.onload = () => {
        imageMap.set(layer.id, img);
        loadCount++;
        if (loadCount === totalImages) {
          setLoadedImages(new Map(imageMap));
        }
      };
      img.onerror = () => {
        loadCount++;
        if (loadCount === totalImages) {
          setLoadedImages(new Map(imageMap));
        }
      };
      img.src = layer.imageUrl;
    });
  }, [processedPSD.layers]);

  useEffect(() => {
    if (processedPSD && canvasRef.current && loadedImages.size > 0) {
      drawCanvas();
    }
  }, [processedPSD, selectedLayerId, hiddenLayers, showBackground, focusMode, loadedImages]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerWidth = canvas.parentElement?.offsetWidth || 800;
    const containerHeight = canvas.parentElement?.offsetHeight || 600;

    const aspectRatio = processedPSD.width / processedPSD.height;
    let calculatedWidth = containerWidth;
    let calculatedHeight = containerWidth / aspectRatio;

    if (calculatedHeight > containerHeight) {
      calculatedHeight = containerHeight;
      calculatedWidth = containerHeight * aspectRatio;
    }

    setCanvasSize({ width: calculatedWidth, height: calculatedHeight });

    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background based on showBackground setting
    if (showBackground) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // When background is off, use a subtle dark background for visibility
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Filter layers to render
    const layersToRender = processedPSD.layers.filter(layer => 
      layer.hasRealImage && 
      !hiddenLayers.has(layer.id) && 
      loadedImages.has(layer.id)
    );

    // Sort layers by z-index (back to front)
    layersToRender.sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0));

    // Draw layers with enhanced logic for background toggle
    layersToRender.forEach(layer => {
      const img = loadedImages.get(layer.id);
      if (!img) return;

      const isSelected = layer.id === selectedLayerId;
      
      // Calculate opacity based on background setting and selection
      let opacity = layer.opacity;
      
      if (!showBackground) {
        if (selectedLayerId) {
          // When background is off and a layer is selected
          opacity = isSelected ? 1.0 : 0.3; // Selected layer full opacity, others dimmed
        } else {
          // When background is off and no layer selected
          opacity = layer.opacity * 0.7; // All layers slightly dimmed
        }
      }

      // Focus mode logic
      if (focusMode && selectedLayerId && !isSelected) {
        opacity *= 0.2;
      }

      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Draw the layer image
      ctx.drawImage(
        img,
        layer.bounds.left,
        layer.bounds.top,
        layer.bounds.right - layer.bounds.left,
        layer.bounds.bottom - layer.bounds.top
      );
      
      ctx.restore();

      // Draw selection border and highlights
      if (isSelected) {
        ctx.save();
        
        // Selection border
        ctx.strokeStyle = '#10b981'; // CRD green
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.strokeRect(
          layer.bounds.left - 2,
          layer.bounds.top - 2,
          (layer.bounds.right - layer.bounds.left) + 4,
          (layer.bounds.bottom - layer.bounds.top) + 4
        );

        // Selection corners for better visibility
        const cornerSize = 8;
        ctx.fillStyle = '#10b981';
        
        // Top-left corner
        ctx.fillRect(layer.bounds.left - 4, layer.bounds.top - 4, cornerSize, cornerSize);
        // Top-right corner
        ctx.fillRect(layer.bounds.right - 4, layer.bounds.top - 4, cornerSize, cornerSize);
        // Bottom-left corner
        ctx.fillRect(layer.bounds.left - 4, layer.bounds.bottom - 4, cornerSize, cornerSize);
        // Bottom-right corner
        ctx.fillRect(layer.bounds.right - 4, layer.bounds.bottom - 4, cornerSize, cornerSize);

        ctx.restore();
      }

      // Draw layer name label for selected layer when background is off
      if (isSelected && !showBackground) {
        ctx.save();
        
        const labelPadding = 8;
        const labelHeight = 24;
        const labelY = Math.max(layer.bounds.top - labelHeight - 4, 4);
        
        // Measure text width
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const textWidth = ctx.measureText(layer.name).width;
        const labelWidth = textWidth + (labelPadding * 2);
        
        // Draw label background
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)'; // CRD green with transparency
        ctx.fillRect(layer.bounds.left, labelY, labelWidth, labelHeight);
        
        // Draw label text
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.name, layer.bounds.left + labelPadding, labelY + labelHeight / 2);
        
        ctx.restore();
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!processedPSD) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find the topmost layer at click position (iterate in reverse order)
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      if (hiddenLayers.has(layer.id) || !layer.hasRealImage) continue;

      const left = layer.bounds.left;
      const top = layer.bounds.top;
      const right = layer.bounds.right;
      const bottom = layer.bounds.bottom;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        onLayerSelect(layer.id);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-[#1a1f2e] flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">
          Canvas Preview
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFocusModeToggle}
            className={focusMode ? 'bg-crd-green text-black hover:bg-crd-green/90' : ''}
          >
            {focusMode ? 'Disable Focus' : 'Enable Focus'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleBackground}
            className={showBackground ? 'bg-crd-green text-black hover:bg-crd-green/90' : ''}
          >
            {showBackground ? 'Hide BG' : 'Show BG'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Card className="bg-slate-800 border-slate-700 rounded-none flex-1 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              cursor: 'pointer'
            }}
          />
        </Card>
      </div>
    </div>
  );
};
