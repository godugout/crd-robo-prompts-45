
import React, { useRef, useEffect } from 'react';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';

interface Layer3DVisualizationProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  canvasWidth: number;
  canvasHeight: number;
  onLayerSelect: (layerId: string) => void;
}

export const Layer3DVisualization: React.FC<Layer3DVisualizationProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  canvasWidth,
  canvasHeight,
  onLayerSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getLayerStyle = (layer: ProcessedPSDLayer, isSelected: boolean) => {
    const left = (layer.bounds.left / canvasWidth) * 100;
    const top = (layer.bounds.top / canvasHeight) * 100;
    const width = ((layer.bounds.right - layer.bounds.left) / canvasWidth) * 100;
    const height = ((layer.bounds.bottom - layer.bounds.top) / canvasHeight) * 100;
    
    const semanticColor = getSemanticTypeColor(layer.semanticType);
    const zIndex = isSelected ? 1000 : 100;
    const elevation = isSelected ? 20 : 10;

    return {
      position: 'absolute' as const,
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
      zIndex,
      transform: `translateZ(${elevation}px) ${isSelected ? 'scale(1.02)' : 'scale(1)'}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      borderRadius: '4px',
      border: `2px solid ${semanticColor}`,
      boxShadow: `
        0 ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1),
        inset 0 0 20px ${semanticColor}33
      `,
      backgroundColor: `${semanticColor}15`,
      backdropFilter: 'blur(1px)',
    };
  };

  const visibleLayers = layers.filter(layer => 
    !hiddenLayers.has(layer.id) && layer.hasRealImage
  );

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {visibleLayers.map(layer => {
        const isSelected = layer.id === selectedLayerId;
        
        return (
          <div
            key={layer.id}
            style={getLayerStyle(layer, isSelected)}
            className="pointer-events-auto group hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onLayerSelect(layer.id);
            }}
          >
            {/* Layer content preview */}
            {layer.imageUrl && (
              <img
                src={layer.imageUrl}
                alt={layer.name}
                className="w-full h-full object-cover rounded opacity-80 group-hover:opacity-100"
                style={{ mixBlendMode: 'multiply' }}
              />
            )}
            
            {/* Layer info tooltip */}
            <div className="absolute -top-8 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {layer.name} ({layer.semanticType})
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 border-2 border-white animate-pulse rounded" />
            )}
          </div>
        );
      })}
    </div>
  );
};
