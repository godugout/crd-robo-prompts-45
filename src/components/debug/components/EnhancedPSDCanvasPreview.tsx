
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers, Image as ImageIcon } from 'lucide-react';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: ProcessedPSD;
  selectedLayerId?: string;
  onLayerSelect?: (layerId: string) => void;
  onLayerHover?: (layerId: string | null) => void;
}

// Semantic color mapping for layer types
const SEMANTIC_COLORS = {
  player: { color: 'rgba(16, 185, 129, 0.25)', border: '#10b981', name: 'Player' },
  background: { color: 'rgba(99, 102, 241, 0.25)', border: '#6366f1', name: 'Background' },
  stats: { color: 'rgba(6, 182, 212, 0.25)', border: '#06b6d4', name: 'Stats' },
  logo: { color: 'rgba(236, 72, 153, 0.25)', border: '#ec4899', name: 'Logo' },
  border: { color: 'rgba(245, 158, 11, 0.25)', border: '#f59e0b', name: 'Border' },
  text: { color: 'rgba(59, 130, 246, 0.25)', border: '#3b82f6', name: 'Text' },
  effect: { color: 'rgba(168, 85, 247, 0.25)', border: '#a855f7', name: 'Effect' },
  image: { color: 'rgba(34, 197, 94, 0.25)', border: '#22c55e', name: 'Image' },
  default: { color: 'rgba(156, 163, 175, 0.25)', border: '#9ca3af', name: 'Unknown' }
};

export const EnhancedPSDCanvasPreview: React.FC<EnhancedPSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  onLayerSelect,
  onLayerHover
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showFullCard, setShowFullCard] = useState(false);
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(new Set(Object.keys(SEMANTIC_COLORS)));
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);

  // Load all layer images
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      // Load flattened card image
      if (processedPSD.extractedImages.flattenedImageUrl) {
        try {
          const cardImg = new Image();
          cardImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            cardImg.onload = resolve;
            cardImg.onerror = reject;
            cardImg.src = processedPSD.extractedImages.flattenedImageUrl;
          });
          imageMap.set('fullCard', cardImg);
        } catch (error) {
          console.warn('Failed to load full card image:', error);
        }
      }

      // Load individual layer images
      for (const layer of processedPSD.layers) {
        if (layer.fullColorImageUrl) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = layer.fullColorImageUrl;
            });
            imageMap.set(layer.id, img);
          } catch (error) {
            console.warn(`Failed to load image for layer ${layer.name}:`, error);
          }
        }
      }
      
      setLoadedImages(imageMap);
    };

    loadImages();
  }, [processedPSD]);

  // Calculate canvas dimensions
  const canvasWidth = Math.max(800, processedPSD.width || 400);
  const canvasHeight = Math.max(600, processedPSD.height || 560);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transform
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    if (showFullCard) {
      // Show full flattened card
      const cardImg = loadedImages.get('fullCard');
      if (cardImg) {
        ctx.drawImage(cardImg, 0, 0, processedPSD.width || 400, processedPSD.height || 560);
      } else {
        // Fallback gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, '#475569');
        gradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, processedPSD.width || 400, processedPSD.height || 560);
      }
    } else {
      // Show individual layers
      for (const layer of processedPSD.layers) {
        const layerType = layer.semanticType || 'default';
        const colorConfig = SEMANTIC_COLORS[layerType as keyof typeof SEMANTIC_COLORS] || SEMANTIC_COLORS.default;
        
        // Skip if type is hidden
        if (!visibleTypes.has(layerType)) continue;

        const layerImg = loadedImages.get(layer.id);
        const bounds = layer.bounds;
        const width = bounds.right - bounds.left;
        const height = bounds.bottom - bounds.top;

        if (layerImg && width > 0 && height > 0) {
          // Draw the actual layer image
          ctx.drawImage(layerImg, bounds.left, bounds.top, width, height);
        } else {
          // Fallback rectangle with gradient
          const gradient = ctx.createLinearGradient(bounds.left, bounds.top, bounds.right, bounds.bottom);
          gradient.addColorStop(0, colorConfig.color.replace('0.25', '0.4'));
          gradient.addColorStop(1, colorConfig.color.replace('0.25', '0.2'));
          ctx.fillStyle = gradient;
          ctx.fillRect(bounds.left, bounds.top, width, height);
        }

        // Subtle overlay for layer identification
        ctx.fillStyle = colorConfig.color;
        ctx.fillRect(bounds.left, bounds.top, width, height);

        // Enhanced border for selected/hovered layers
        const isSelected = selectedLayerId === layer.id;
        const isHovered = hoveredLayerId === layer.id;
        
        if (isSelected || isHovered) {
          ctx.strokeStyle = colorConfig.border;
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.globalAlpha = isSelected ? 0.8 : 0.6;
          ctx.strokeRect(bounds.left, bounds.top, width, height);
          ctx.globalAlpha = 1;
        }

        // Layer type indicator
        if (width > 40 && height > 20) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(bounds.left + 2, bounds.top + 2, 60, 18);
          ctx.fillStyle = colorConfig.border;
          ctx.font = '11px sans-serif';
          ctx.fillText(colorConfig.name, bounds.left + 4, bounds.top + 14);
        }
      }
    }

    ctx.restore();
  }, [processedPSD, scale, offset, showFullCard, selectedLayerId, hoveredLayerId, visibleTypes, loadedImages]);

  // Redraw when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (showFullCard) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    if (showFullCard) return;

    // Layer hover detection
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    let hoveredLayer: string | null = null;
    
    // Check layers in reverse order (top to bottom)
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      const bounds = layer.bounds;
      
      if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
        const layerType = layer.semanticType || 'default';
        if (visibleTypes.has(layerType)) {
          hoveredLayer = layer.id;
          break;
        }
      }
    }

    setHoveredLayerId(hoveredLayer);
    onLayerHover?.(hoveredLayer);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (showFullCard || isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    // Find clicked layer
    for (let i = processedPSD.layers.length - 1; i >= 0; i--) {
      const layer = processedPSD.layers[i];
      const bounds = layer.bounds;
      
      if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
        const layerType = layer.semanticType || 'default';
        if (visibleTypes.has(layerType)) {
          onLayerSelect?.(layer.id);
          break;
        }
      }
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.1));
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const toggleLayerType = (type: string) => {
    setVisibleTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  // Get unique layer types present in the PSD
  const availableTypes = Array.from(
    new Set(processedPSD.layers.map(l => l.semanticType || 'default'))
  );

  return (
    <Card className="bg-slate-800 border-slate-600">
      <div className="p-4 border-b border-slate-600">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-crd-green" />
              PSD Layer Preview
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Show Full Card</span>
              <Switch
                checked={showFullCard}
                onCheckedChange={setShowFullCard}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-400 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Layer Type Filters */}
        {!showFullCard && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Layer Types</h4>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map(type => {
                const colorConfig = SEMANTIC_COLORS[type as keyof typeof SEMANTIC_COLORS] || SEMANTIC_COLORS.default;
                const layerCount = processedPSD.layers.filter(l => (l.semanticType || 'default') === type).length;
                const isVisible = visibleTypes.has(type);
                
                return (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    className={`text-xs ${isVisible ? 'opacity-100' : 'opacity-50'}`}
                    onClick={() => toggleLayerType(type)}
                  >
                    <div 
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: colorConfig.border }}
                    />
                    {colorConfig.name} ({layerCount})
                    {isVisible ? <Eye className="w-3 h-3 ml-1" /> : <EyeOff className="w-3 h-3 ml-1" />}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div 
          ref={containerRef}
          className="relative bg-slate-900 rounded-lg overflow-hidden"
          style={{ height: '600px' }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="absolute inset-0 cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
          />
          
          {/* Loading overlay */}
          {loadedImages.size === 0 && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-pulse" />
                <p className="text-slate-300">Loading layer images...</p>
              </div>
            </div>
          )}
        </div>

        {/* Layer Info */}
        {hoveredLayerId && !showFullCard && (
          <div className="mt-4 p-3 bg-slate-700 rounded-lg">
            {(() => {
              const layer = processedPSD.layers.find(l => l.id === hoveredLayerId);
              if (!layer) return null;
              
              const colorConfig = SEMANTIC_COLORS[layer.semanticType as keyof typeof SEMANTIC_COLORS] || SEMANTIC_COLORS.default;
              
              return (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colorConfig.border }}
                  />
                  <div>
                    <h4 className="text-white font-medium">{layer.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {colorConfig.name}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}px
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </Card>
  );
};
