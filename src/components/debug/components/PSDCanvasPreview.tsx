
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
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Auto-select largest layer on PSD load
  useEffect(() => {
    if (processedPSD && !selectedLayerId) {
      const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
      if (largestLayerId) {
        onLayerSelect(largestLayerId);
      }
    }
  }, [processedPSD, selectedLayerId, onLayerSelect]);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      for (const layer of processedPSD.layers) {
        if (layer.imageData) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              imageMap.set(layer.id, img);
              resolve();
            };
            img.onerror = () => reject();
            img.src = layer.imageData!;
          }).catch(() => {
            // Skip failed images
          });
        }
      }
      
      setLoadedImages(imageMap);
    };

    if (processedPSD?.layers) {
      loadImages();
    }
  }, [processedPSD]);

  // Render canvas
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

    // Render layers
    processedPSD.layers.forEach(layer => {
      if (hiddenLayers.has(layer.id)) return;

      const img = loadedImages.get(layer.id);
      if (!img) return;

      const x = layer.bounds.left;
      const y = layer.bounds.top;
      const width = layer.bounds.right - layer.bounds.left;
      const height = layer.bounds.bottom - layer.bounds.top;

      // Apply focus mode opacity
      let opacity = layer.opacity;
      if (focusMode) {
        if (selectedLayerId && layer.id !== selectedLayerId) {
          opacity = layer.opacity * 0.3; // Darken non-selected layers
        }
      }

      ctx.globalAlpha = opacity;
      
      try {
        ctx.drawImage(img, x, y, width, height);
      } catch (error) {
        console.warn('Failed to draw layer:', layer.name, error);
      }

      ctx.globalAlpha = 1; // Reset opacity
    });

    // Draw selection highlight
    if (selectedLayerId && focusMode) {
      const selectedLayer = processedPSD.layers.find(l => l.id === selectedLayerId);
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
      }
    }
  }, [processedPSD, hiddenLayers, selectedLayerId, focusMode, loadedImages]);

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
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative overflow-hidden border border-slate-600 rounded"
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
      <div className="mt-2 text-sm text-gray-500">
        Zoom: {(scale * 100).toFixed(0)}% | Click layers to select
      </div>
    </div>
  );
};
