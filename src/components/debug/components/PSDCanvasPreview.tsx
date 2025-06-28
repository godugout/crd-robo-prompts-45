
import React, { useRef, useEffect, useState } from 'react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { findLargestLayerByVolume } from '@/utils/layerUtils';

export interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  layerGroups: LayerGroup[];
  onLayerSelect: (layerId: string) => void;
  frameBuilderMode?: boolean;
  focusMode?: boolean;
}

export const PSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  layerGroups,
  onLayerSelect,
  frameBuilderMode = false,
  focusMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-select largest layer on PSD load
  useEffect(() => {
    if (processedPSD && !selectedLayerId) {
      const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
      if (largestLayerId) {
        onLayerSelect(largestLayerId);
      }
    }
  }, [processedPSD, selectedLayerId, onLayerSelect]);

  // Calculate scale to fit the canvas in container
  useEffect(() => {
    if (processedPSD) {
      const containerWidth = 600;
      const containerHeight = 400;
      const scaleX = containerWidth / processedPSD.width;
      const scaleY = containerHeight / processedPSD.height;
      const initialScale = Math.min(scaleX, scaleY, 1);
      setScale(initialScale);
    }
  }, [processedPSD]);

  // Render the PSD on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If we have a flattened image, use it
    if (processedPSD.flattenedImageUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, processedPSD.width, processedPSD.height);
        
        // Draw selection highlight if in focus mode
        if (selectedLayerId && focusMode) {
          drawSelectionHighlight(ctx, processedPSD, selectedLayerId);
        }
      };
      img.src = processedPSD.flattenedImageUrl;
    } else {
      // Fallback: draw a placeholder
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text overlay
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PSD Preview', canvas.width / 2, canvas.height / 2);
      ctx.font = '16px Arial';
      ctx.fillText(`${processedPSD.width} × ${processedPSD.height}px`, canvas.width / 2, canvas.height / 2 + 40);
      ctx.fillText(`${processedPSD.layers.length} layers`, canvas.width / 2, canvas.height / 2 + 65);
    }
  }, [processedPSD, selectedLayerId, focusMode]);

  const drawSelectionHighlight = (ctx: CanvasRenderingContext2D, psd: ProcessedPSD, layerId: string) => {
    const selectedLayer = psd.layers.find(l => l.id === layerId);
    if (selectedLayer && !hiddenLayers.has(selectedLayer.id)) {
      const x = selectedLayer.bounds.left;
      const y = selectedLayer.bounds.top;
      const width = selectedLayer.bounds.right - selectedLayer.bounds.left;
      const height = selectedLayer.bounds.bottom - selectedLayer.bounds.top;

      // Draw highlight border
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
      ctx.setLineDash([]); // Reset dash
      
      // Draw layer info
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(x, y - 30, Math.max(200, width), 25);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(selectedLayer.name, x + 5, y - 10);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

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
    setScale(prevScale => Math.max(0.1, Math.min(3, prevScale + delta)));
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className="relative overflow-hidden border border-slate-600 rounded bg-slate-800"
        style={{
          width: Math.min(600, processedPSD.width * scale),
          height: Math.min(400, processedPSD.height * scale),
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
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          className="block"
        />
      </div>
      <div className="mt-2 text-sm text-gray-400 flex items-center gap-4">
        <span>Zoom: {(scale * 100).toFixed(0)}%</span>
        <span>•</span>
        <span>Click layers to select</span>
        <span>•</span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
};
