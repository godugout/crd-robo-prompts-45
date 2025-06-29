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

  useEffect(() => {
    if (processedPSD && canvasRef.current) {
      const canvas = canvasRef.current;
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

      if (showBackground) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      processedPSD.layers.forEach(layer => {
        if (!layer.hasRealImage || hiddenLayers.has(layer.id)) return;

        const img = new Image();
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
  }, [processedPSD, selectedLayerId, hiddenLayers, showBackground]);

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
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
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
