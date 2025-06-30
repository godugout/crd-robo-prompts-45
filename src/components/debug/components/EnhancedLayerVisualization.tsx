
import React, { useState, useEffect, useMemo } from 'react';
import { EnhancedProcessedPSD, ProcessedLayer } from '@/types/psdTypes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Layers,
  Palette,
  Zap,
  Move,
  CheckSquare,
  Square
} from 'lucide-react';

interface EnhancedLayerVisualizationProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerIds: Set<string>;
  hiddenLayers: Set<string>;
  showOriginal: boolean;
  onLayerSelect: (layerId: string, multiSelect?: boolean) => void;
  onLayerToggle: (layerId: string) => void;
  onLayerReorder: (dragIndex: number, hoverIndex: number) => void;
  onToggleOriginal: () => void;
}

export const EnhancedLayerVisualization: React.FC<EnhancedLayerVisualizationProps> = ({
  processedPSD,
  selectedLayerIds,
  hiddenLayers,
  showOriginal,
  onLayerSelect,
  onLayerToggle,
  onLayerReorder,
  onToggleOriginal
}) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when original card is toggled
  useEffect(() => {
    if (!showOriginal) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showOriginal]);

  const visibleLayers = useMemo(() => 
    processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id)),
    [processedPSD.layers, hiddenLayers]
  );

  const getLayerStyle = (layer: ProcessedLayer, index: number) => {
    const isSelected = selectedLayerIds.has(layer.id);
    const baseDelay = index * 0.1;
    
    if (!showOriginal) {
      return {
        filter: isSelected 
          ? `brightness(1.5) saturate(1.8) drop-shadow(0 0 20px rgba(55, 114, 255, 0.8))` 
          : 'grayscale(1) brightness(0.3)',
        transition: `all 1.5s cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${baseDelay}s`,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        zIndex: isSelected ? 10 : 1,
      };
    }
    
    return {
      filter: 'none',
      transition: 'all 0.3s ease',
      transform: 'scale(1)',
      zIndex: 1,
    };
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== dropIndex) {
      onLayerReorder(draggedItem, dropIndex);
    }
    setDraggedItem(null);
  };

  const handleLayerClick = (e: React.MouseEvent, layerId: string) => {
    const multiSelect = e.ctrlKey || e.metaKey || e.shiftKey;
    onLayerSelect(layerId, multiSelect);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-cardshow-dark-100 rounded-lg border border-cardshow-dark-100">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-cardshow-primary" />
          <h3 className="cardshow-section-text text-lg">Layer Visualization</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-cardshow-primary/20 text-cardshow-primary border-cardshow-primary/50">
            {selectedLayerIds.size} selected
          </Badge>
          
          <Button
            onClick={onToggleOriginal}
            variant={showOriginal ? "default" : "secondary"}
            size="sm"
            className="flex items-center gap-2"
          >
            {showOriginal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showOriginal ? 'Hide Original' : 'Show Original'}
          </Button>
        </div>
      </div>

      {/* Canvas Preview */}
      <div className="relative aspect-[3/4] bg-cardshow-dark border border-cardshow-dark-100 rounded-lg overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3772FF 0%, transparent 50%), radial-gradient(circle at 75% 75%, #F97316 0%, transparent 50%)`,
          }} />
        </div>

        {/* Layer Visualization */}
        <div className="absolute inset-4">
          {visibleLayers.map((layer, index) => (
            <div
              key={layer.id}
              className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${
                selectedLayerIds.has(layer.id) ? 'ring-2 ring-cardshow-primary shadow-xl' : ''
              }`}
              style={{
                left: `${(layer.bounds.x / processedPSD.width) * 100}%`,
                top: `${(layer.bounds.y / processedPSD.height) * 100}%`,
                width: `${(layer.bounds.width / processedPSD.width) * 100}%`,
                height: `${(layer.bounds.height / processedPSD.height) * 100}%`,
                ...getLayerStyle(layer, index),
              }}
              onClick={(e) => handleLayerClick(e, layer.id)}
            >
              {layer.imageData && (
                <img
                  src={layer.imageData}
                  alt={layer.name}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ 
                    opacity: selectedLayerIds.has(layer.id) && !showOriginal ? 0.95 : 0.8,
                  }}
                />
              )}
              
              {/* Glow effect for selected layers */}
              {selectedLayerIds.has(layer.id) && !showOriginal && (
                <div 
                  className="absolute inset-0 rounded-lg animate-pulse"
                  style={{
                    boxShadow: `0 0 30px rgba(55, 114, 255, 0.6), inset 0 0 20px rgba(55, 114, 255, 0.2)`,
                    background: 'linear-gradient(45deg, rgba(55, 114, 255, 0.1), rgba(249, 115, 22, 0.1))',
                  }}
                />
              )}

              {/* Layer Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg opacity-0 hover:opacity-100 transition-opacity">
                {layer.name}
              </div>
            </div>
          ))}
        </div>

        {/* Animation Overlay */}
        {isAnimating && (
          <div className="absolute inset-0 bg-gradient-to-br from-cardshow-primary/20 to-cardshow-secondary/20 animate-pulse" />
        )}
      </div>

      {/* Layer List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {visibleLayers.map((layer, index) => (
          <Card
            key={layer.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`p-3 cursor-pointer transition-all duration-300 ${
              selectedLayerIds.has(layer.id)
                ? 'bg-cardshow-primary/20 border-cardshow-primary/50 shadow-lg'
                : 'bg-cardshow-dark-100 border-cardshow-dark-100 hover:border-cardshow-primary/30'
            } ${draggedItem === index ? 'opacity-50' : ''}`}
            onClick={(e) => handleLayerClick(e, layer.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {selectedLayerIds.has(layer.id) ? (
                    <CheckSquare className="w-4 h-4 text-cardshow-primary" />
                  ) : (
                    <Square className="w-4 h-4 text-cardshow-light-700" />
                  )}
                  <Move className="w-4 h-4 text-cardshow-light-700 cursor-grab" />
                </div>
                
                <div className="w-8 h-8 rounded overflow-hidden bg-cardshow-dark">
                  {layer.imageData && (
                    <img
                      src={layer.imageData}
                      alt={layer.name}
                      className="w-full h-full object-cover"
                      style={{
                        filter: selectedLayerIds.has(layer.id) && !showOriginal
                          ? 'brightness(1.2) saturate(1.5)'
                          : showOriginal ? 'none' : 'grayscale(1) brightness(0.5)'
                      }}
                    />
                  )}
                </div>
                
                <div>
                  <div className="font-medium text-cardshow-light text-sm">
                    {layer.name}
                  </div>
                  <div className="text-xs text-cardshow-light-700">
                    {layer.bounds.width}×{layer.bounds.height}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedLayerIds.has(layer.id) && (
                  <Badge className="bg-cardshow-primary text-white text-xs px-2 py-1">
                    Active
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggle(layer.id);
                  }}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Multi-select Instructions */}
      <div className="text-xs text-cardshow-light-700 bg-cardshow-dark-100 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-cardshow-primary" />
          <span className="font-medium">Multi-Selection Tips:</span>
        </div>
        <ul className="space-y-1 text-cardshow-light-700">
          <li>• Hold <kbd className="px-1 py-0.5 bg-cardshow-dark rounded text-xs">Ctrl</kbd> (or <kbd className="px-1 py-0.5 bg-cardshow-dark rounded text-xs">Cmd</kbd>) + click to multi-select layers</li>
          <li>• Drag layers to reorder them in the stack</li>
          <li>• Toggle "Show Original" to see the glow and grayscale effects</li>
          <li>• Selected layers glow brightly while others fade to grayscale</li>
        </ul>
      </div>
    </div>
  );
};
