
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Auto-select largest layer on PSD load
  useEffect(() => {
    if (processedPSD && !selectedLayerId) {
      const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
      if (largestLayerId) {
        onLayerSelect(largestLayerId);
      }
    }
  }, [processedPSD, selectedLayerId, onLayerSelect]);

  // Calculate optimal scale and centering
  useEffect(() => {
    if (processedPSD && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Use 85% of container space to leave reasonable padding
      const usableWidth = containerWidth * 0.85;
      const usableHeight = containerHeight * 0.85;
      
      const scaleX = usableWidth / processedPSD.width;
      const scaleY = usableHeight / processedPSD.height;
      const optimalScale = Math.min(scaleX, scaleY);
      
      setScale(optimalScale);
      
      // Calculate centering offset
      const scaledWidth = processedPSD.width * optimalScale;
      const scaledHeight = processedPSD.height * optimalScale;
      const offsetX = (containerWidth - scaledWidth) / 2;
      const offsetY = (containerHeight - scaledHeight) / 2;
      
      setOffset({ x: offsetX, y: offsetY });
    }
  }, [processedPSD, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  // Render the PSD on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match the scaled PSD
    const scaledWidth = processedPSD.width * scale;
    const scaledHeight = processedPSD.height * scale;
    
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If we have a flattened image, use it
    if (processedPSD.flattenedImageUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
        // Draw selection highlight if in focus mode
        if (selectedLayerId && focusMode) {
          drawSelectionHighlight(ctx, processedPSD, selectedLayerId, scale);
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
      ctx.font = `bold ${24 * scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('PSD Preview', canvas.width / 2, canvas.height / 2);
      ctx.font = `${16 * scale}px Arial`;
      ctx.fillText(`${processedPSD.width} × ${processedPSD.height}px`, canvas.width / 2, canvas.height / 2 + 40 * scale);
      ctx.fillText(`${processedPSD.layers.length} layers`, canvas.width / 2, canvas.height / 2 + 65 * scale);
    }
  }, [processedPSD, selectedLayerId, focusMode, scale]);

  const drawSelectionHighlight = (ctx: CanvasRenderingContext2D, psd: ProcessedPSD, layerId: string, currentScale: number) => {
    const selectedLayer = psd.layers.find(l => l.id === layerId);
    if (selectedLayer && !hiddenLayers.has(selectedLayer.id)) {
      const x = selectedLayer.bounds.left * currentScale;
      const y = selectedLayer.bounds.top * currentScale;
      const width = (selectedLayer.bounds.right - selectedLayer.bounds.left) * currentScale;
      const height = (selectedLayer.bounds.bottom - selectedLayer.bounds.top) * currentScale;

      // Draw highlight border
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
      ctx.setLineDash([]); // Reset dash
      
      // Draw layer info
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(x, y - 30 * currentScale, Math.max(200 * currentScale, width), 25 * currentScale);
      ctx.fillStyle = '#ffffff';
      ctx.font = `${12 * currentScale}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText(selectedLayer.name, x + 5 * currentScale, y - 10 * currentScale);
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
    const newScale = Math.max(0.1, Math.min(3, scale + delta));
    setScale(newScale);
    
    // Recalculate offset for new scale
    if (containerRef.current && processedPSD) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const scaledWidth = processedPSD.width * newScale;
      const scaledHeight = processedPSD.height * newScale;
      const offsetX = (containerWidth - scaledWidth) / 2;
      const offsetY = (containerHeight - scaledHeight) / 2;
      setOffset({ x: offsetX, y: offsetY });
    }
  };

  const drawGridBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    
    ctx.strokeStyle = 'rgba(64, 64, 64, 0.3)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw major grid lines every 100px
    ctx.strokeStyle = 'rgba(64, 64, 64, 0.5)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  if (!processedPSD) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No PSD loaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        className="relative flex items-center justify-center bg-black flex-1 overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(64, 64, 64, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(64, 64, 64, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(64, 64, 64, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(64, 64, 64, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px'
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            cursor: 'pointer',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          className="block"
        />
      </div>
      <div className="p-3 bg-slate-900 border-t border-slate-700 text-sm text-gray-400 flex items-center gap-4">
        <span>Zoom: {(scale * 100).toFixed(0)}%</span>
        <span>•</span>
        <span>Click layers to select</span>
        <span>•</span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
};
