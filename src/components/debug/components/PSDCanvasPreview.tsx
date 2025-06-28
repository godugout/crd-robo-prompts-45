
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';

interface PSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string | null;
  layerVisibility: Map<string, boolean>;
  onLayerClick?: (layerId: string) => void;
}

export const PSDCanvasPreview: React.FC<PSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  layerVisibility,
  onLayerClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);

  // Calculate display dimensions while maintaining aspect ratio
  const maxWidth = 400;
  const maxHeight = 500;
  const aspectRatio = processedPSD.width / processedPSD.height;
  
  let displayWidth = maxWidth;
  let displayHeight = maxWidth / aspectRatio;
  
  if (displayHeight > maxHeight) {
    displayHeight = maxHeight;
    displayWidth = maxHeight * aspectRatio;
  }

  const scaleX = displayWidth / processedPSD.width;
  const scaleY = displayHeight / processedPSD.height;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Clear canvas
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Render layers in reverse order (bottom to top)
    const visibleLayers = [...processedPSD.layers]
      .reverse()
      .filter(layer => layerVisibility.get(layer.id) ?? layer.visible);

    visibleLayers.forEach(layer => {
      if (!layer.imageData) return;

      const img = new Image();
      img.onload = () => {
        ctx.save();
        
        // Apply layer opacity
        ctx.globalAlpha = layer.opacity || 1;
        
        // Calculate scaled position and size
        const scaledLeft = layer.bounds.left * scaleX;
        const scaledTop = layer.bounds.top * scaleY;
        const scaledWidth = (layer.bounds.right - layer.bounds.left) * scaleX;
        const scaledHeight = (layer.bounds.bottom - layer.bounds.top) * scaleY;
        
        // Draw the layer image
        ctx.drawImage(img, scaledLeft, scaledTop, scaledWidth, scaledHeight);
        
        // Highlight selected layer
        if (selectedLayerId === layer.id) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#3b82f6'; // blue-500
          ctx.fillRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
          
          // Add border
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.strokeRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
        }
        
        // Highlight hovered layer
        if (hoveredLayerId === layer.id && hoveredLayerId !== selectedLayerId) {
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = '#10b981'; // green-500
          ctx.fillRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
          
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1;
          ctx.strokeRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
        }
        
        ctx.restore();
      };
      img.src = layer.imageData;
    });
  }, [processedPSD, selectedLayerId, layerVisibility, hoveredLayerId, displayWidth, displayHeight, scaleX, scaleY]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLayerClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scaleX;
    const y = (event.clientY - rect.top) / scaleY;

    // Find the topmost layer at this position (iterate forwards since layers are drawn bottom to top)
    const clickedLayer = processedPSD.layers.find(layer => {
      if (!(layerVisibility.get(layer.id) ?? layer.visible)) return false;
      
      return (
        x >= layer.bounds.left &&
        x <= layer.bounds.right &&
        y >= layer.bounds.top &&
        y <= layer.bounds.bottom
      );
    });

    if (clickedLayer) {
      onLayerClick(clickedLayer.id);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scaleX;
    const y = (event.clientY - rect.top) / scaleY;

    // Find the topmost layer at this position
    const hoveredLayer = processedPSD.layers.find(layer => {
      if (!(layerVisibility.get(layer.id) ?? layer.visible)) return false;
      
      return (
        x >= layer.bounds.left &&
        x <= layer.bounds.right &&
        y >= layer.bounds.top &&
        y <= layer.bounds.bottom
      );
    });

    setHoveredLayerId(hoveredLayer?.id || null);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredLayerId(null);
  };

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <CardContent className="p-4">
        <h3 className="text-white font-semibold mb-4">Canvas Preview</h3>
        
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border border-slate-700 rounded cursor-pointer"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
            style={{ 
              width: displayWidth, 
              height: displayHeight,
              imageRendering: 'pixelated'
            }}
          />
        </div>
        
        <div className="mt-3 text-xs text-slate-400 text-center">
          Click on layers to select • Blue = Selected • Green = Hovered
        </div>
      </CardContent>
    </Card>
  );
};
