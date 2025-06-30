
import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProcessedPSDLayer } from '@/types/psdTypes';

interface EnhancedLayerVisualizationProps {
  processedPSD: any;
  selectedLayers: Set<string>;
  onLayerSelectionChange: (selectedLayers: Set<string>) => void;
  showOriginal: boolean;
}

interface DraggableLayerProps {
  layer: ProcessedPSDLayer;
  index: number;
  isSelected: boolean;
  onSelect: (layerId: string, multiSelect: boolean) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  showGlow: boolean;
  opacity: number;
}

const DraggableLayer: React.FC<DraggableLayerProps> = ({
  layer,
  index,
  isSelected,
  onSelect,
  onMove,
  showGlow,
  opacity
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'layer',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'layer',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    onSelect(layer.id, e.ctrlKey || e.metaKey);
  };

  // Calculate layer dimensions from bounds
  const layerWidth = layer.bounds.right - layer.bounds.left;
  const layerHeight = layer.bounds.bottom - layer.bounds.top;
  const layerX = layer.bounds.left;
  const layerY = layer.bounds.top;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        absolute border-2 cursor-pointer transition-all duration-500 ease-in-out
        ${isSelected ? 'border-cardshow-primary z-20' : 'border-transparent hover:border-cardshow-primary/50'}
        ${isDragging ? 'opacity-50' : ''}
        ${showGlow && isSelected ? 'shadow-lg shadow-cardshow-primary/50' : ''}
      `}
      style={{
        left: layerX,
        top: layerY,
        width: layerWidth,
        height: layerHeight,
        opacity: opacity,
        filter: showGlow && isSelected ? 'brightness(1.3) saturate(1.2)' : 
                !showGlow ? 'grayscale(100%) brightness(0.7)' : 'none',
        transform: showGlow && isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: showGlow && isSelected ? 
          `0 0 20px rgba(55, 114, 255, 0.6), 0 0 40px rgba(55, 114, 255, 0.4)` : 'none'
      }}
      onClick={handleClick}
    >
      {layer.imageUrl && (
        <img
          src={layer.imageUrl}
          alt={layer.name}
          className="w-full h-full object-contain pointer-events-none"
          style={{
            filter: showGlow && isSelected ? 
              'brightness(1.4) saturate(1.5) contrast(1.1)' : 
              !showGlow ? 'grayscale(100%) brightness(0.6)' : 'brightness(1.1)'
          }}
        />
      )}
      
      {/* Layer name tooltip */}
      <div className={`
        absolute -top-8 left-0 bg-cardshow-dark text-cardshow-light text-xs px-2 py-1 rounded
        transition-opacity duration-200 pointer-events-none z-30
        ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
      `}>
        {layer.name}
      </div>
    </div>
  );
};

export const EnhancedLayerVisualization: React.FC<EnhancedLayerVisualizationProps> = ({
  processedPSD,
  selectedLayers,
  onLayerSelectionChange,
  showOriginal
}) => {
  const [layerOrder, setLayerOrder] = useState<ProcessedPSDLayer[]>([]);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'glow' | 'grayscale' | 'colorRevival'>('initial');

  // Initialize layer order
  useEffect(() => {
    if (processedPSD?.layers) {
      setLayerOrder([...processedPSD.layers]);
    }
  }, [processedPSD]);

  // Handle animation sequence when original is turned off
  useEffect(() => {
    if (!showOriginal) {
      setAnimationPhase('glow');
      
      const timer1 = setTimeout(() => {
        setAnimationPhase('grayscale');
      }, 800);
      
      const timer2 = setTimeout(() => {
        setAnimationPhase('colorRevival');
      }, 1600);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setAnimationPhase('initial');
    }
  }, [showOriginal]);

  const handleLayerSelect = useCallback((layerId: string, multiSelect: boolean) => {
    const newSelection = new Set(selectedLayers);
    
    if (multiSelect) {
      if (newSelection.has(layerId)) {
        newSelection.delete(layerId);
      } else {
        newSelection.add(layerId);
      }
    } else {
      newSelection.clear();
      newSelection.add(layerId);
    }
    
    onLayerSelectionChange(newSelection);
  }, [selectedLayers, onLayerSelectionChange]);

  const handleLayerMove = useCallback((dragIndex: number, hoverIndex: number) => {
    setLayerOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const draggedLayer = newOrder[dragIndex];
      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, draggedLayer);
      return newOrder;
    });
  }, []);

  const getLayerOpacity = (layerId: string) => {
    if (showOriginal) return 1;
    
    switch (animationPhase) {
      case 'glow':
        return selectedLayers.has(layerId) ? 1 : 0.3;
      case 'grayscale':
        return selectedLayers.has(layerId) ? 0.8 : 0.2;
      case 'colorRevival':
        return selectedLayers.has(layerId) ? 1 : 0.1;
      default:
        return 1;
    }
  };

  const shouldShowGlow = (layerId: string) => {
    return !showOriginal && selectedLayers.has(layerId) && 
           (animationPhase === 'glow' || animationPhase === 'colorRevival');
  };

  if (!processedPSD) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Original background layer with grayscale effect */}
        {!showOriginal && processedPSD.flattenedImageUrl && (
          <div 
            className="absolute inset-0 transition-all duration-1000"
            style={{
              filter: 'grayscale(100%) brightness(0.4)',
              opacity: 0.3
            }}
          >
            <img
              src={processedPSD.flattenedImageUrl}
              alt="Original PSD"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Interactive layers */}
        <div 
          className="absolute inset-0"
          style={{
            width: processedPSD.width,
            height: processedPSD.height
          }}
        >
          {layerOrder.map((layer, index) => (
            <DraggableLayer
              key={layer.id}
              layer={layer}
              index={index}
              isSelected={selectedLayers.has(layer.id)}
              onSelect={handleLayerSelect}
              onMove={handleLayerMove}
              showGlow={shouldShowGlow(layer.id)}
              opacity={getLayerOpacity(layer.id)}
            />
          ))}
        </div>

        {/* Selection info */}
        {selectedLayers.size > 0 && (
          <div className="absolute top-4 right-4 bg-cardshow-dark/90 text-cardshow-light px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="text-sm font-medium">
              {selectedLayers.size} layer{selectedLayers.size !== 1 ? 's' : ''} selected
            </div>
            <div className="text-xs text-cardshow-light-700 mt-1">
              Ctrl/Cmd + Click for multi-select
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};
