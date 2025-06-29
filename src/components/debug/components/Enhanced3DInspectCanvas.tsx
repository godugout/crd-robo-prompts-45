
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Layer3DVisualization } from './Layer3DVisualization';

interface Enhanced3DInspectCanvasProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId?: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  reorderedLayers?: ProcessedPSDLayer[];
}

export const Enhanced3DInspectCanvas: React.FC<Enhanced3DInspectCanvasProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  reorderedLayers
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  const layersToRender = reorderedLayers || processedPSD.layers;

  useEffect(() => {
    if (!processedPSD || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate canvas size to fit container while maintaining aspect ratio
    const containerRect = container.getBoundingClientRect();
    const aspectRatio = processedPSD.width / processedPSD.height;
    
    let displayWidth = Math.min(containerRect.width * 0.9, 800);
    let displayHeight = displayWidth / aspectRatio;
    
    if (displayHeight > containerRect.height * 0.8) {
      displayHeight = containerRect.height * 0.8;
      displayWidth = displayHeight * aspectRatio;
    }

    setCanvasSize({ width: displayWidth, height: displayHeight });

    // Set canvas dimensions
    canvas.width = processedPSD.width;
    canvas.height = processedPSD.height;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the flattened image as semi-transparent background
    if (processedPSD.flattenedImageUrl) {
      const backgroundImg = new Image();
      backgroundImg.crossOrigin = 'anonymous';
      backgroundImg.onload = () => {
        ctx.globalAlpha = 0.4; // Semi-transparent background
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        setIsBackgroundLoaded(true);
      };
      backgroundImg.src = processedPSD.flattenedImageUrl;
    }
  }, [processedPSD]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!processedPSD || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = processedPSD.width / rect.width;
    const scaleY = processedPSD.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find the topmost layer at click position
    for (let i = layersToRender.length - 1; i >= 0; i--) {
      const layer = layersToRender[i];
      if (hiddenLayers.has(layer.id)) continue;

      const { left, top, right, bottom } = layer.bounds;
      if (x >= left && x <= right && y >= top && y <= bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0b]">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="bg-slate-900/50 border-slate-700 shadow-2xl relative overflow-hidden">
          <div 
            ref={containerRef}
            className="relative"
            style={{ 
              width: canvasSize.width,
              height: canvasSize.height,
              minWidth: 400,
              minHeight: 300
            }}
            onClick={handleCanvasClick}
          >
            {/* Background canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 cursor-crosshair"
              style={{
                imageRendering: 'pixelated',
                filter: 'brightness(1.1) contrast(1.05)'
              }}
            />
            
            {/* 3D Layer visualization overlay */}
            {isBackgroundLoaded && (
              <Layer3DVisualization
                layers={layersToRender}
                selectedLayerId={selectedLayerId || ''}
                hiddenLayers={hiddenLayers}
                canvasWidth={processedPSD.width}
                canvasHeight={processedPSD.height}
                onLayerSelect={onLayerSelect}
              />
            )}
            
            {/* Loading overlay */}
            {!isBackgroundLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <div className="text-slate-300 text-sm">
                  Loading 3D inspection view...
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Info panel */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-300">
            {selectedLayerId ? (
              <>
                Selected: <span className="text-crd-green font-medium">
                  {layersToRender.find(l => l.id === selectedLayerId)?.name}
                </span>
              </>
            ) : (
              'Click on a layer to inspect it in 3D'
            )}
          </div>
          <div className="text-slate-400">
            {processedPSD.width} × {processedPSD.height}px
          </div>
        </div>
      </div>
    </div>
  );
};
