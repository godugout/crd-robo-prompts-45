
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Info } from 'lucide-react';
import { DraggableLayerList } from './DraggableLayerList';

interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onFlippedLayersChange?: (flipped: Set<string>) => void;
  viewMode?: 'inspect' | 'frame' | 'build';
  focusMode?: boolean;
  showBackground?: boolean;
  onLayersReorder?: (newLayers: ProcessedPSDLayer[]) => void;
}

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle,
  onFlippedLayersChange,
  viewMode = 'inspect',
  focusMode = false,
  showBackground = true,
  onLayersReorder
}) => {
  const [originalLayers] = useState(layers);
  const [currentLayers, setCurrentLayers] = useState(layers);

  const handleLayersReorder = (newLayers: ProcessedPSDLayer[]) => {
    setCurrentLayers(newLayers);
    onLayersReorder?.(newLayers);
  };

  const handleReset = () => {
    setCurrentLayers(originalLayers);
    onLayersReorder?.(originalLayers);
  };

  const visibleLayers = currentLayers.filter(layer => !hiddenLayers.has(layer.id));
  const layersWithImages = currentLayers.filter(layer => layer.hasRealImage).length;

  return (
    <div className="h-full flex flex-col bg-[#1a1f2e]">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">
              Layers ({visibleLayers.length}/{currentLayers.length})
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {layersWithImages} with images
          </Badge>
        </div>

        {/* Mode-specific info */}
        {viewMode === 'frame' && (
          <div className="text-xs text-slate-400 mb-2">
            <Info className="w-3 h-3 inline mr-1" />
            Frame fitting analysis active
          </div>
        )}
        
        {viewMode === 'build' && (
          <div className="text-xs text-slate-400 mb-2">
            <Info className="w-3 h-3 inline mr-1" />
            CRD frame generation mode
          </div>
        )}
      </div>

      {/* Draggable Layer List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <DraggableLayerList
            layers={currentLayers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
            onLayerToggle={onLayerToggle}
            onLayersReorder={handleLayersReorder}
            onReset={handleReset}
          />
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-3 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <div>Selected: {currentLayers.find(l => l.id === selectedLayerId)?.name || 'None'}</div>
          <div>Visible: {visibleLayers.length} / {currentLayers.length} layers</div>
          {focusMode && <div className="text-blue-400">Focus mode active</div>}
        </div>
      </div>
    </div>
  );
};
