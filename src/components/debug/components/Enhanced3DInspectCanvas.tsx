
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
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  const layersToRender = reorderedLayers || processedPSD.layers;

  // Trading card aspect ratio (2.5" x 3.5" = 0.714)
  const CARD_ASPECT_RATIO = 2.5 / 3.5;

  useEffect(() => {
    if (!processedPSD || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use most of the available container space
    const containerRect = container.getBoundingClientRect();
    const availableWidth = containerRect.width - 40; // Some padding
    const availableHeight = containerRect.height - 40; // Some padding
    
    // Calculate card dimensions maintaining 2.5:3.5 aspect ratio
    let cardWidth, cardHeight;
    
    // Try fitting by width first
    cardWidth = Math.min(availableWidth * 0.8, 400); // Max 400px width
    cardHeight = cardWidth / CARD_ASPECT_RATIO;
    
    // If card is too tall, fit by height
    if (cardHeight > availableHeight * 0.8) {
      cardHeight = availableHeight * 0.8;
      cardWidth = cardHeight * CARD_ASPECT_RATIO;
    }

    setCardDimensions({ width: cardWidth, height: cardHeight });

    // Set canvas to use full container size
    const canvasWidth = availableWidth;
    const canvasHeight = availableHeight;
    
    setCanvasSize({ width: canvasWidth, height: canvasHeight });

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a0b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw card placeholder outline
    const cardX = (canvasWidth - cardWidth) / 2;
    const cardY = (canvasHeight - cardHeight) / 2;
    
    // Card outline
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
    
    // Inner card border
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(cardX + 10, cardY + 10, cardWidth - 20, cardHeight - 20);

    // Draw the flattened image as semi-transparent background if available
    if (processedPSD.flattenedImageUrl) {
      const backgroundImg = new Image();
      backgroundImg.crossOrigin = 'anonymous';
      backgroundImg.onload = () => {
        ctx.globalAlpha = 0.3; // More transparent to show the outline
        ctx.drawImage(backgroundImg, cardX, cardY, cardWidth, cardHeight);
        ctx.globalAlpha = 1;
        setIsBackgroundLoaded(true);
      };
      backgroundImg.src = processedPSD.flattenedImageUrl;
    } else {
      setIsBackgroundLoaded(true);
    }

    // Add text labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Trading Card Preview', canvasWidth / 2, cardY - 20);
    ctx.fillText('2.5" × 3.5" Aspect Ratio', canvasWidth / 2, cardY + cardHeight + 30);
    
  }, [processedPSD, CARD_ASPECT_RATIO]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!processedPSD || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to card coordinates
    const cardX = (canvasSize.width - cardDimensions.width) / 2;
    const cardY = (canvasSize.height - cardDimensions.height) / 2;
    
    // Check if click is within card area
    if (x >= cardX && x <= cardX + cardDimensions.width && 
        y >= cardY && y <= cardY + cardDimensions.height) {
      
      // Scale coordinates to PSD dimensions
      const psdX = ((x - cardX) / cardDimensions.width) * processedPSD.width;
      const psdY = ((y - cardY) / cardDimensions.height) * processedPSD.height;

      // Find the topmost layer at click position
      for (let i = layersToRender.length - 1; i >= 0; i--) {
        const layer = layersToRender[i];
        if (hiddenLayers.has(layer.id)) continue;

        const { left, top, right, bottom } = layer.bounds;
        if (psdX >= left && psdX <= right && psdY >= top && psdY <= bottom) {
          onLayerSelect(layer.id);
          break;
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0b]">
      {/* Expanded canvas area */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={containerRef}
          className="w-full h-full relative cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {/* Full-size background canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
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
                Loading card preview...
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Compact info panel */}
      <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="text-slate-300">
            {selectedLayerId ? (
              <>
                Selected: <span className="text-crd-green font-medium">
                  {layersToRender.find(l => l.id === selectedLayerId)?.name}
                </span>
              </>
            ) : (
              'Click within the card area to inspect layers'
            )}
          </div>
          <div className="text-slate-400">
            PSD: {processedPSD.width} × {processedPSD.height}px | Card: 2.5″ × 3.5″
          </div>
        </div>
      </div>
    </div>
  );
};
