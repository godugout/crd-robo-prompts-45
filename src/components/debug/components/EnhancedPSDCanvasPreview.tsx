
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { EnhancedProcessedPSD, EnhancedProcessedPSDLayer } from '@/services/psdProcessor/enhancedPsdProcessingService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Layers, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface EnhancedPSDCanvasPreviewProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  focusMode?: boolean;
  onFocusModeToggle?: () => void;
  showBackground?: boolean;
  onToggleBackground?: () => void;
  viewMode?: 'inspect' | 'frame' | 'build';
}

// Semantic color mapping for layer types
const SEMANTIC_COLORS = {
  player: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', label: 'Player' },
  background: { bg: 'rgba(156, 163, 175, 0.15)', border: '#9ca3af', label: 'Background' },
  stats: { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', label: 'Stats' },
  text: { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', label: 'Text' },
  logo: { bg: 'rgba(245, 101, 101, 0.15)', border: '#f56565', label: 'Logo' },
  effect: { bg: 'rgba(251, 191, 36, 0.15)', border: '#fbbf24', label: 'Effect' },
  border: { bg: 'rgba(99, 102, 241, 0.15)', border: '#6366f1', label: 'Border' },
  unknown: { bg: 'rgba(107, 114, 128, 0.15)', border: '#6b7280', label: 'Unknown' }
};

export const EnhancedPSDCanvasPreview: React.FC<EnhancedPSDCanvasPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  focusMode = false,
  onFocusModeToggle,
  showBackground = true,
  onToggleBackground,
  viewMode = 'inspect'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [showFullCard, setShowFullCard] = useState(false);
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(new Set(Object.keys(SEMANTIC_COLORS)));
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Load images from enhanced PSD data
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      // Load flattened image if available
      if (processedPSD.extractedImages?.flattenedImageUrl) {
        const flattenedImg = new Image();
        flattenedImg.src = processedPSD.extractedImages.flattenedImageUrl;
        await new Promise(resolve => {
          flattenedImg.onload = resolve;
          flattenedImg.onerror = resolve;
        });
        imageMap.set('flattened', flattenedImg);
      }

      // Load individual layer images
      for (const layer of processedPSD.layers as EnhancedProcessedPSDLayer[]) {
        if (layer.imageUrl) {
          const img = new Image();
          img.src = layer.imageUrl;
          await new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          imageMap.set(layer.id, img);
        }
      }
      
      setLoadedImages(imageMap);
    };

    loadImages();
  }, [processedPSD]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const containerRect = canvas.parentElement?.getBoundingClientRect();
    if (containerRect) {
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    if (showFullCard && loadedImages.has('flattened')) {
      // Show full card view
      const flattenedImg = loadedImages.get('flattened')!;
      const scale = Math.min(canvas.width / flattenedImg.width, canvas.height / flattenedImg.height) * 0.8;
      const x = (canvas.width / zoom - flattenedImg.width * scale) / 2;
      const y = (canvas.height / zoom - flattenedImg.height * scale) / 2;
      ctx.drawImage(flattenedImg, x, y, flattenedImg.width * scale, flattenedImg.height * scale);
    } else {
      // Show individual layers
      processedPSD.layers.forEach((layer) => {
        const enhancedLayer = layer as EnhancedProcessedPSDLayer;
        const semanticType = enhancedLayer.semanticType || 'unknown';
        
        // Skip hidden layers or filtered types
        if (hiddenLayers.has(layer.id) || !visibleTypes.has(semanticType)) {
          return;
        }

        // Skip if focus mode is on and this isn't the selected layer
        if (focusMode && layer.id !== selectedLayerId) {
          return;
        }

        const colors = SEMANTIC_COLORS[semanticType as keyof typeof SEMANTIC_COLORS];
        const isSelected = layer.id === selectedLayerId;
        
        // Calculate position and size
        const layerX = layer.bounds.left;
        const layerY = layer.bounds.top;
        const layerWidth = layer.bounds.right - layer.bounds.left;
        const layerHeight = layer.bounds.bottom - layer.bounds.top;

        // Draw layer image if available
        const layerImg = loadedImages.get(layer.id);
        if (layerImg && layerImg.complete) {
          ctx.globalAlpha = layer.opacity;
          ctx.drawImage(layerImg, layerX, layerY, layerWidth, layerHeight);
          ctx.globalAlpha = 1;
        } else {
          // Fallback: draw colored rectangle
          ctx.fillStyle = colors.bg;
          ctx.fillRect(layerX, layerY, layerWidth, layerHeight);
        }

        // Draw subtle overlay
        ctx.fillStyle = isSelected ? 
          colors.bg.replace('0.15', '0.25') : 
          colors.bg;
        ctx.fillRect(layerX, layerY, layerWidth, layerHeight);

        // Draw border
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.setLineDash(isSelected ? [] : [5, 5]);
        ctx.strokeRect(layerX, layerY, layerWidth, layerHeight);
        ctx.setLineDash([]);

        // Draw layer label
        if (layerWidth > 60 && layerHeight > 20) {
          ctx.fillStyle = colors.border;
          ctx.font = '12px sans-serif';
          ctx.fillText(
            layer.name.substring(0, 20),
            layerX + 4,
            layerY + 16
          );
        }
      });
    }

    ctx.restore();
  }, [processedPSD, loadedImages, selectedLayerId, hiddenLayers, focusMode, visibleTypes, showFullCard, zoom, pan]);

  // Handle canvas interactions
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (showFullCard) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;

    // Find clicked layer (reverse order for top-most)
    const layers = [...processedPSD.layers].reverse();
    for (const layer of layers) {
      if (hiddenLayers.has(layer.id)) continue;
      
      const enhancedLayer = layer as EnhancedProcessedPSDLayer;
      const semanticType = enhancedLayer.semanticType || 'unknown';
      if (!visibleTypes.has(semanticType)) continue;

      if (x >= layer.bounds.left && x <= layer.bounds.right &&
          y >= layer.bounds.top && y <= layer.bounds.bottom) {
        onLayerSelect(layer.id);
        break;
      }
    }
  }, [processedPSD, hiddenLayers, visibleTypes, onLayerSelect, showFullCard, zoom, pan]);

  // Mouse drag handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;
    
    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Type filter toggles
  const uniqueTypes = Array.from(new Set(
    processedPSD.layers.map(layer => (layer as EnhancedProcessedPSDLayer).semanticType || 'unknown')
  ));

  const toggleTypeVisibility = (type: string) => {
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

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Canvas Controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowFullCard(!showFullCard)}
              variant={showFullCard ? "default" : "outline"}
              size="sm"
            >
              <Layers className="w-4 h-4 mr-2" />
              {showFullCard ? 'Show Layers' : 'Show Full Card'}
            </Button>
            
            {onFocusModeToggle && (
              <Button
                onClick={onFocusModeToggle}
                variant={focusMode ? "default" : "outline"}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Focus Mode
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))} size="sm" variant="outline">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-300">{Math.round(zoom * 100)}%</span>
            <Button onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.1))} size="sm" variant="outline">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {uniqueTypes.map(type => {
            const colors = SEMANTIC_COLORS[type as keyof typeof SEMANTIC_COLORS];
            const isVisible = visibleTypes.has(type);
            
            return (
              <Badge
                key={type}
                onClick={() => toggleTypeVisibility(type)}
                className={`cursor-pointer transition-all ${
                  isVisible 
                    ? 'opacity-100' 
                    : 'opacity-50 grayscale'
                }`}
                style={{
                  backgroundColor: isVisible ? colors.border : 'transparent',
                  borderColor: colors.border,
                  color: isVisible ? 'white' : colors.border
                }}
              >
                {colors.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
        
        {/* Loading indicator */}
        {loadedImages.size === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="text-white">Loading layer images...</div>
          </div>
        )}
      </div>
    </div>
  );
};
