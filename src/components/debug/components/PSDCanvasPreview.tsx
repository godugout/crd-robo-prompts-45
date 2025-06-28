
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
  const backlightCanvasRef = useRef<HTMLCanvasElement>(null);
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

  // Render backlight effect
  useEffect(() => {
    const backlightCanvas = backlightCanvasRef.current;
    if (!backlightCanvas || !selectedLayerId) return;

    const ctx = backlightCanvas.getContext('2d');
    if (!ctx) return;

    backlightCanvas.width = displayWidth;
    backlightCanvas.height = displayHeight;

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Find selected layer
    const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
    if (!selectedLayer || !(layerVisibility.get(selectedLayer.id) ?? selectedLayer.visible)) return;

    // Create backlight glow effect
    const scaledLeft = selectedLayer.bounds.left * scaleX;
    const scaledTop = selectedLayer.bounds.top * scaleY;
    const scaledWidth = (selectedLayer.bounds.right - selectedLayer.bounds.left) * scaleX;
    const scaledHeight = (selectedLayer.bounds.bottom - selectedLayer.bounds.top) * scaleY;

    // Create radial gradient for glow
    const centerX = scaledLeft + scaledWidth / 2;
    const centerY = scaledTop + scaledHeight / 2;
    const maxRadius = Math.max(scaledWidth, scaledHeight) * 0.8;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)'); // Blue center
    gradient.addColorStop(0.3, 'rgba(59, 130, 246, 0.4)');
    gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)'); // Fade to transparent

    // Apply glow effect
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Add a subtle rim light around the selected layer
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
  }, [selectedLayerId, processedPSD, layerVisibility, displayWidth, displayHeight, scaleX, scaleY]);

  // Render main card composition
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Clear canvas with dark background
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Add card base with subtle gradient
    const cardGradient = ctx.createLinearGradient(0, 0, displayWidth, displayHeight);
    cardGradient.addColorStop(0, 'rgba(30, 41, 59, 0.9)'); // slate-800
    cardGradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)'); // slate-900
    ctx.fillStyle = cardGradient;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Add subtle card border
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)'; // slate-500 with opacity
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, displayWidth - 4, displayHeight - 4);

    // Sort layers by depth (background to foreground)
    const sortedLayers = [...processedPSD.layers].sort((a, b) => {
      const depthA = a.inferredDepth ?? 0.5;
      const depthB = b.inferredDepth ?? 0.5;
      return depthA - depthB; // Lower depth (background) first
    });

    // Render layers with depth-based translucency and offset
    sortedLayers.forEach((layer, index) => {
      const isVisible = layerVisibility.get(layer.id) ?? layer.visible;
      if (!isVisible || !layer.imageData) return;

      const img = new Image();
      img.onload = () => {
        ctx.save();
        
        // Calculate depth-based properties
        const depth = layer.inferredDepth ?? 0.5;
        const depthOffset = depth * 3; // Subtle 3D offset
        const baseOpacity = layer.opacity || 1;
        
        // Make background layers more translucent, foreground more opaque
        const depthOpacity = 0.3 + (depth * 0.7); // Range from 0.3 to 1.0
        const finalOpacity = baseOpacity * depthOpacity;
        
        // Add slight shadow for depth
        if (depth > 0.3) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = depth * 8;
          ctx.shadowOffsetX = depthOffset * 0.5;
          ctx.shadowOffsetY = depthOffset * 0.5;
        }
        
        // Apply layer opacity with depth consideration
        ctx.globalAlpha = finalOpacity;
        
        // Calculate scaled position and size with depth offset
        const scaledLeft = (layer.bounds.left * scaleX) + depthOffset;
        const scaledTop = (layer.bounds.top * scaleY) + depthOffset;
        const scaledWidth = (layer.bounds.right - layer.bounds.left) * scaleX;
        const scaledHeight = (layer.bounds.bottom - layer.bounds.top) * scaleY;
        
        // Draw the layer image
        ctx.drawImage(img, scaledLeft, scaledTop, scaledWidth, scaledHeight);
        
        // Add subtle highlight for hovered layer
        if (hoveredLayerId === layer.id && hoveredLayerId !== selectedLayerId) {
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = '#10b981'; // green-500
          ctx.fillRect(scaledLeft, scaledTop, scaledWidth, scaledHeight);
        }
        
        ctx.restore();
      };
      img.src = layer.imageData;
    });

    // Add subtle card shine effect
    const shineGradient = ctx.createLinearGradient(0, 0, displayWidth, displayHeight * 0.3);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shineGradient;
    ctx.fillRect(0, 0, displayWidth, displayHeight * 0.3);
  }, [processedPSD, selectedLayerId, layerVisibility, hoveredLayerId, displayWidth, displayHeight, scaleX, scaleY]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLayerClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scaleX;
    const y = (event.clientY - rect.top) / scaleY;

    // Find the topmost visible layer at this position
    // Sort by depth (highest depth = topmost)
    const sortedLayers = [...processedPSD.layers].sort((a, b) => {
      const depthA = a.inferredDepth ?? 0.5;
      const depthB = b.inferredDepth ?? 0.5;
      return depthB - depthA; // Higher depth first
    });

    const clickedLayer = sortedLayers.find(layer => {
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
    const sortedLayers = [...processedPSD.layers].sort((a, b) => {
      const depthA = a.inferredDepth ?? 0.5;
      const depthB = b.inferredDepth ?? 0.5;
      return depthB - depthA;
    });

    const hoveredLayer = sortedLayers.find(layer => {
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
        
        <div className="flex justify-center relative">
          {/* Backlight effect canvas - behind main canvas */}
          <canvas
            ref={backlightCanvasRef}
            className="absolute border border-slate-700 rounded"
            style={{ 
              width: displayWidth, 
              height: displayHeight,
              filter: 'blur(8px)',
              zIndex: 1,
              mixBlendMode: 'screen'
            }}
          />
          
          {/* Main card canvas */}
          <canvas
            ref={canvasRef}
            className="border border-slate-700 rounded cursor-pointer relative"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
            style={{ 
              width: displayWidth, 
              height: displayHeight,
              imageRendering: 'pixelated',
              zIndex: 2
            }}
          />
        </div>
        
        <div className="mt-3 text-xs text-slate-400 text-center">
          Click on layers to select • Translucent layers show depth • Blue glow = Selected layer
        </div>
      </CardContent>
    </Card>
  );
};
