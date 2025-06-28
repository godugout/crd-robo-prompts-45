
import React, { useState, useRef, useEffect } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Move, 
  RotateCw, 
  Maximize2, 
  RefreshCw,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface CardFrameFittingInterfaceProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  selectedFrame?: string;
}

export const CardFrameFittingInterface: React.FC<CardFrameFittingInterfaceProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  selectedFrame = 'classic-sports'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageTransparency, setImageTransparency] = useState([70]);
  const [frameInFront, setFrameInFront] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      for (const layer of processedPSD.layers) {
        if (layer.imageData && !hiddenLayers.has(layer.id)) {
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
  }, [processedPSD, hiddenLayers]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedPSD) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const containerWidth = 600;
    const containerHeight = 400;
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw card frame background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw card frame outline (simulated)
    const frameWidth = 300;
    const frameHeight = 420;
    const frameX = (canvas.width - frameWidth) / 2;
    const frameY = (canvas.height - frameHeight) / 2;

    if (!frameInFront) {
      drawFrame(ctx, frameX, frameY, frameWidth, frameHeight);
    }

    // Draw composite image
    const visibleLayers = processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));
    visibleLayers.forEach(layer => {
      const img = loadedImages.get(layer.id);
      if (!img) return;

      const layerWidth = layer.bounds.right - layer.bounds.left;
      const layerHeight = layer.bounds.bottom - layer.bounds.top;
      
      // Apply transformations
      const scaledWidth = layerWidth * imageScale;
      const scaledHeight = layerHeight * imageScale;
      const x = frameX + imagePosition.x + (layer.bounds.left * imageScale);
      const y = frameY + imagePosition.y + (layer.bounds.top * imageScale);

      ctx.globalAlpha = layer.opacity * (imageTransparency[0] / 100);
      
      try {
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      } catch (error) {
        console.warn('Failed to draw layer:', layer.name, error);
      }
    });

    ctx.globalAlpha = 1;

    if (frameInFront) {
      drawFrame(ctx, frameX, frameY, frameWidth, frameHeight);
    }

    // Draw crop guides
    if (selectedLayerId) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(frameX + 20, frameY + 20, frameWidth - 40, frameHeight - 160);
      ctx.setLineDash([]);
    }

  }, [processedPSD, hiddenLayers, selectedLayerId, loadedImages, imageTransparency, frameInFront, imagePosition, imageScale]);

  const drawFrame = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    // Draw frame border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);
    
    // Draw inner frame details
    ctx.strokeStyle = '#b8941f';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + 10, width - 20, height - 20);
    
    // Draw placeholder for image area
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(x + 20, y + 20, width - 40, height - 160);
    ctx.setLineDash([]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x: x - imagePosition.x, y: y - imagePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setImagePosition({
      x: x - dragStart.x,
      y: y - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!isHovering) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const resetPosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
    setZoom(1);
  };

  const autoFit = () => {
    // Auto-fit image to frame
    setImageScale(0.8);
    setImagePosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar */}
      <PSDCard variant="elevated">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge className="bg-crd-green text-black">
                Frame Fitting Mode
              </Badge>
              <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                {selectedFrame || 'Classic Sports'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <PSDButton
                variant={frameInFront ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFrameInFront(!frameInFront)}
              >
                {frameInFront ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Frame Front
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Frame Behind
                  </>
                )}
              </PSDButton>
            </div>
          </div>

          {/* Transparency Control */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-slate-300 min-w-[100px]">Image Opacity:</span>
            <Slider
              value={imageTransparency}
              onValueChange={setImageTransparency}
              min={0}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-slate-400 min-w-[40px]">{imageTransparency[0]}%</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <PSDButton
              variant="secondary"
              size="sm"
              onClick={autoFit}
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Auto Fit
            </PSDButton>
            
            <PSDButton
              variant="secondary"
              size="sm"
              onClick={resetPosition}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </PSDButton>

            <div className="flex items-center gap-2 ml-4">
              <ZoomOut className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300 min-w-[60px]">
                {Math.round(zoom * 100)}%
              </span>
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </PSDCard>

      {/* Canvas Area */}
      <PSDCard variant="elevated">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div
              ref={containerRef}
              className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-800"
              style={{
                width: 600,
                height: 400,
                transform: `scale(${zoom})`,
                transformOrigin: 'center'
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className={`block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              />
              
              {/* Hover indicator */}
              {isHovering && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Scroll to zoom
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-slate-400">
            <Move className="w-4 h-4 inline mr-2" />
            Drag to position • Hover + scroll to zoom • Toggle frame position
          </div>
        </div>
      </PSDCard>
    </div>
  );
};
