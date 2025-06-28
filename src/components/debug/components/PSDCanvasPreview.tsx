import React, { useRef, useEffect, useState } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';

export interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  layerGroups: LayerGroup[];
  onLayerSelect: (layerId: string) => void;
  frameBuilderMode?: boolean;
}

export const PSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  layerGroups,
  onLayerSelect,
  frameBuilderMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;

    // Render layers
    processedPSD.layers.forEach(layer => {
      if (hiddenLayers.has(layer.id)) return; // Skip hidden layers

      if (layer.imageData) {
        const img = new Image();
        img.src = layer.imageData;
        img.onload = () => {
          ctx.globalAlpha = layer.opacity;
          ctx.drawImage(
            img,
            layer.bounds.left,
            layer.bounds.top,
            layer.bounds.right - layer.bounds.left,
            layer.bounds.bottom - layer.bounds.top
          );
          ctx.globalAlpha = 1; // Reset opacity
        };
      }
    });
  }, [processedPSD, hiddenLayers]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find the topmost layer under the click
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];

      if (hiddenLayers.has(layer.id)) continue;

      const left = layer.bounds.left;
      const top = layer.bounds.top;
      const right = layer.bounds.right;
      const bottom = layer.bounds.bottom;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        onLayerSelect(layer.id);
        return;
      }
    }

    // If no layer is selected, clear the selection
    onLayerSelect('');
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    setScale(prevScale => Math.max(0.1, prevScale + delta)); // Limit zoom out to 10%
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative overflow-hidden"
        style={{
          width: processedPSD.width * scale,
          height: processedPSD.height * scale,
        }}
      >
        <canvas
          ref={canvasRef}
          width={processedPSD.width}
          height={processedPSD.height}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            cursor: 'pointer',
          }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Zoom: {(scale * 100).toFixed(0)}%
      </div>
    </div>
  );
};
