
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
  reorderedLayers?: ProcessedPSDLayer[];
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
  viewMode,
  reorderedLayers
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0, scale: 1 });

  // Use reordered layers if available, otherwise fall back to original layers
  const layersToRender = reorderedLayers || processedPSD.layers;

  useEffect(() => {
    if (processedPSD && canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate available space with padding
      const padding = 40;
      const containerRect = container.getBoundingClientRect();
      const availableWidth = containerRect.width - (padding * 2);
      const availableHeight = containerRect.height - (padding * 2);

      // Calculate scale to fit the PSD with padding
      const scaleX = availableWidth / processedPSD.width;
      const scaleY = availableHeight / processedPSD.height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

      // Calculate final canvas dimensions
      const displayWidth = processedPSD.width * scale;
      const displayHeight = processedPSD.height * scale;

      setCanvasSize({ 
        width: displayWidth, 
        height: displayHeight, 
        scale 
      });

      // Set actual canvas resolution to PSD dimensions for crisp rendering
      canvas.width = processedPSD.width;
      canvas.height = processedPSD.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (showBackground) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      layersToRender.forEach(layer => {
        if (!layer.hasRealImage || hiddenLayers.has(layer.id)) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = layer.imageUrl || '';
        img.onload = () => {
          if (!ctx) return;
          ctx.globalAlpha = layer.opacity;
          ctx.drawImage(
            img,
            layer.bounds.left,
            layer.bounds.top,
            layer.bounds.right - layer.bounds.left,
            layer.bounds.bottom - layer.bounds.top
          );
          ctx.globalAlpha = 1;
        };
      });
    }
  }, [processedPSD, selectedLayerId, hiddenLayers, showBackground, layersToRender]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!processedPSD) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Iterate through layers in reverse to find the top-most clicked layer
    for (let i = layersToRender.length - 1; i >= 0; i--) {
      const layer = layersToRender[i];
      if (hiddenLayers.has(layer.id)) continue; // Skip hidden layers

      const left = layer.bounds.left;
      const top = layer.bounds.top;
      const right = layer.bounds.right;
      const bottom = layer.bounds.bottom;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        onLayerSelect(layer.id);
        return; // Select only the top-most layer
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-[#1a1f2e] flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">
            Canvas Preview ({viewMode})
          </h2>
          {processedPSD && (
            <div className="text-sm text-slate-400">
              {processedPSD.width} × {processedPSD.height}px 
              {canvasSize.scale < 1 && (
                <span className="ml-2">• {Math.round(canvasSize.scale * 100)}% scale</span>
              )}
            </div>
          )}
        </div>
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
      
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden p-5 bg-slate-900"
      >
        <Card className="bg-slate-800 border-slate-700 rounded-lg p-4 shadow-xl">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              cursor: 'pointer',
              maxWidth: '100%',
              maxHeight: '100%',
              imageRendering: 'pixelated'
            }}
            className="rounded border border-slate-600"
          />
        </Card>
      </div>
    </div>
  );
};

// Keep the old export for backward compatibility
export const PSDCanvasPreview = EnhancedPSDCanvasPreview;
