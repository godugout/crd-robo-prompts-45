import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Enhanced3DInspectCanvas } from './Enhanced3DInspectCanvas';

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
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Use reordered layers if available, otherwise fall back to original layers
  const layersToRender = reorderedLayers || processedPSD.layers;

  // If we're in inspect mode, use the enhanced 3D canvas
  if (viewMode === 'inspect') {
    return (
      <Enhanced3DInspectCanvas
        processedPSD={processedPSD}
        selectedLayerId={selectedLayerId}
        hiddenLayers={hiddenLayers}
        onLayerSelect={onLayerSelect}
        reorderedLayers={reorderedLayers}
      />
    );
  }

  // For other modes, use traditional canvas rendering
  useEffect(() => {
    if (!processedPSD || !canvasRef.current) return;

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

    layersToRender.forEach(layer => {
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
  }, [processedPSD, selectedLayerId, hiddenLayers, showBackground, layersToRender, viewMode]);

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
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-[#0a0a0b] rounded">
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
        />
      </div>
    </div>
  );
};

// Keep the old export for backward compatibility
export const PSDCanvasPreview = EnhancedPSDCanvasPreview;
