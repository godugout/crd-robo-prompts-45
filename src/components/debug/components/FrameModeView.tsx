
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';

interface FrameModeViewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
}

export const FrameModeView: React.FC<FrameModeViewProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect
}) => {
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Frame Mode</h3>
        <p className="text-slate-400">
          Explore different frame options and layer configurations
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layers.map(layer => {
          const isSelected = layer.id === selectedLayerId;
          const isHidden = hiddenLayers.has(layer.id);

          return (
            <Card
              key={layer.id}
              className={`bg-slate-700 border-slate-600 p-3 cursor-pointer ${
                isSelected ? 'ring-2 ring-crd-green' : 'hover:bg-slate-600'
              } ${isHidden ? 'opacity-50' : ''}`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white truncate">
                  {layer.name}
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                >
                  {isHidden ? 'Show' : 'Hide'}
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
