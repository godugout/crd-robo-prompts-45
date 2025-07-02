/**
 * PSD Canvas Preview Component
 * Advanced canvas-based PSD preview with layer visualization, focus mode, and interactive controls
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff, Focus, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import type { ProcessedPSD, PSDLayer } from '@/services/crdElements/PSDProcessor';

interface PSDCanvasProps {
  processedPSD: ProcessedPSD;
  selectedLayerId?: string;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string, visible: boolean) => void;
}

export const PSDCanvas: React.FC<PSDCanvasProps> = ({
  processedPSD,
  selectedLayerId,
  onLayerSelect,
  onLayerToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showBackground, setShowBackground] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [layerOpacity, setLayerOpacity] = useState<Record<string, number>>({});
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // Load background image
  useEffect(() => {
    if (processedPSD.flattenedImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setBackgroundImage(img);
      img.src = processedPSD.flattenedImageUrl;
    }
  }, [processedPSD.flattenedImageUrl]);

  // Load layer images
  useEffect(() => {
    const loadLayerImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      for (const layer of processedPSD.layers) {
        if (layer.type === 'image' && typeof layer.content.data === 'string') {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise<void>((resolve) => {
            img.onload = () => {
              imageMap.set(layer.id, img);
              resolve();
            };
            img.onerror = () => resolve(); // Continue even if image fails to load
            img.src = layer.content.data as string;
          });
        }
      }
      
      setLoadedImages(imageMap);
    };

    loadLayerImages();
  }, [processedPSD.layers]);

  // Canvas drawing function
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context for transformations
    ctx.save();
    
    // Apply zoom and pan
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Calculate card display dimensions and position
    const cardAspectRatio = processedPSD.width / processedPSD.height;
    const canvasAspectRatio = canvas.width / canvas.height;
    
    let displayWidth, displayHeight;
    if (cardAspectRatio > canvasAspectRatio) {
      displayWidth = canvas.width * 0.8;
      displayHeight = displayWidth / cardAspectRatio;
    } else {
      displayHeight = canvas.height * 0.8;
      displayWidth = displayHeight * cardAspectRatio;
    }
    
    const offsetX = (canvas.width - displayWidth) / 2;
    const offsetY = (canvas.height - displayHeight) / 2;

    // Draw background image if enabled and loaded
    if (showBackground && backgroundImage) {
      if (focusMode && selectedLayerId) {
        // In focus mode, darken the background
        ctx.globalAlpha = 0.3;
      }
      
      ctx.drawImage(
        backgroundImage,
        offsetX, offsetY,
        displayWidth, displayHeight
      );
      
      ctx.globalAlpha = 1;
    }

    // Draw layers in correct z-order
    const sortedLayers = [...processedPSD.layers].sort((a, b) => 
      a.properties.zIndex - b.properties.zIndex
    );

    sortedLayers.forEach((layer) => {
      if (!layer.metadata.isVisible) return;

      // Calculate layer position and size
      const scaleX = displayWidth / processedPSD.width;
      const scaleY = displayHeight / processedPSD.height;
      
      const layerX = offsetX + (layer.properties.position.x * scaleX);
      const layerY = offsetY + (layer.properties.position.y * scaleY);
      const layerWidth = layer.properties.dimensions.width * scaleX;
      const layerHeight = layer.properties.dimensions.height * scaleY;

      // Apply focus mode darkening
      if (focusMode && selectedLayerId && layer.id !== selectedLayerId) {
        ctx.globalAlpha = 0.2;
      } else {
        ctx.globalAlpha = (layerOpacity[layer.id] ?? 1) * layer.properties.opacity;
      }

      // Draw layer content
      const layerImage = loadedImages.get(layer.id);
      if (layerImage) {
        ctx.drawImage(
          layerImage,
          layerX, layerY,
          layerWidth, layerHeight
        );
      } else {
        // Draw placeholder rectangle for non-image layers
        ctx.fillStyle = layer.id === selectedLayerId ? 'rgba(0, 255, 0, 0.3)' : 'rgba(100, 100, 100, 0.3)';
        ctx.fillRect(layerX, layerY, layerWidth, layerHeight);
        
        // Draw layer name
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          layer.name,
          layerX + layerWidth / 2,
          layerY + layerHeight / 2
        );
      }

      // Draw selection outline
      if (layer.id === selectedLayerId) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(layerX, layerY, layerWidth, layerHeight);
        
        // Draw layer name tag
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(layerX, layerY - 20, ctx.measureText(layer.name).width + 8, 18);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(layer.name, layerX + 4, layerY - 6);
      }
    });

    ctx.restore();
  }, [
    processedPSD, showBackground, focusMode, selectedLayerId, zoom, pan,
    layerOpacity, loadedImages, backgroundImage
  ]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle canvas click for layer selection
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Transform click coordinates to account for zoom and pan
    const transformedX = (clickX - pan.x) / zoom;
    const transformedY = (clickY - pan.y) / zoom;

    // Calculate card display dimensions and position (same as in drawCanvas)
    const cardAspectRatio = processedPSD.width / processedPSD.height;
    const canvasAspectRatio = canvas.width / canvas.height;
    
    let displayWidth, displayHeight;
    if (cardAspectRatio > canvasAspectRatio) {
      displayWidth = canvas.width * 0.8;
      displayHeight = displayWidth / cardAspectRatio;
    } else {
      displayHeight = canvas.height * 0.8;
      displayWidth = displayHeight * cardAspectRatio;
    }
    
    const offsetX = (canvas.width - displayWidth) / 2;
    const offsetY = (canvas.height - displayHeight) / 2;

    // Check which layer was clicked (top to bottom)
    const sortedLayers = [...processedPSD.layers].sort((a, b) => 
      b.properties.zIndex - a.properties.zIndex
    );

    for (const layer of sortedLayers) {
      if (!layer.metadata.isVisible) continue;

      const scaleX = displayWidth / processedPSD.width;
      const scaleY = displayHeight / processedPSD.height;
      
      const layerX = offsetX + (layer.properties.position.x * scaleX);
      const layerY = offsetY + (layer.properties.position.y * scaleY);
      const layerWidth = layer.properties.dimensions.width * scaleX;
      const layerHeight = layer.properties.dimensions.height * scaleY;

      if (
        transformedX >= layerX &&
        transformedX <= layerX + layerWidth &&
        transformedY >= layerY &&
        transformedY <= layerY + layerHeight
      ) {
        onLayerSelect(layer.id);
        break;
      }
    }
  }, [processedPSD, zoom, pan, onLayerSelect]);

  // Handle mouse wheel for zooming
  const handleWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-4 bg-[#2a2a2a] border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showBackground}
              onCheckedChange={setShowBackground}
              id="show-background"
            />
            <label htmlFor="show-background" className="text-white text-sm">
              Show Background
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={focusMode}
              onCheckedChange={setFocusMode}
              id="focus-mode"
            />
            <label htmlFor="focus-mode" className="text-white text-sm">
              <Focus className="w-4 h-4 inline mr-1" />
              Focus Mode
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-white" />
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={0.1}
              max={3}
              step={0.1}
              className="w-24"
            />
            <ZoomIn className="w-4 h-4 text-white" />
            <span className="text-white text-sm min-w-[3rem]">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            Reset View
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
          onWheel={handleWheel}
        />
        
        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-2 rounded">
          Click layers to select • CMD+scroll to zoom • Focus mode highlights selected layer
        </div>
      </div>

      {/* Layer Controls */}
      {selectedLayerId && (
        <div className="p-4 bg-[#2a2a2a] border-t border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">
              Layer: {processedPSD.layers.find(l => l.id === selectedLayerId)?.name}
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Opacity:</span>
                <Slider
                  value={[layerOpacity[selectedLayerId] ?? 1]}
                  onValueChange={([value]) => 
                    setLayerOpacity(prev => ({ ...prev, [selectedLayerId]: value }))
                  }
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-24"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const layer = processedPSD.layers.find(l => l.id === selectedLayerId);
                  if (layer) {
                    onLayerToggle(selectedLayerId, !layer.metadata.isVisible);
                  }
                }}
              >
                {processedPSD.layers.find(l => l.id === selectedLayerId)?.metadata.isVisible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};