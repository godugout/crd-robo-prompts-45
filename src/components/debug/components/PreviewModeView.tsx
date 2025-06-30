
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';

interface PreviewModeViewProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
}

export const PreviewModeView: React.FC<PreviewModeViewProps> = ({ 
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onToggleVisibility
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Preview Mode</h3>
        <p className="text-slate-400">
          Preview your layers and compositions
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processedPSD.layers.map(layer => {
          const isSelected = layer.id === selectedLayerId;
          const isHidden = hiddenLayers.has(layer.id);

          return (
            <Card
              key={layer.id}
              className={`bg-slate-700 border-slate-600 p-4 cursor-pointer ${
                isSelected ? 'ring-2 ring-crd-green' : 'hover:bg-slate-600'
              } ${isHidden ? 'opacity-50' : ''}`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{layer.name}</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                >
                  {isHidden ? 'Show' : 'Hide'}
                </Button>
              </div>
              <div className="h-24 bg-slate-900 rounded overflow-hidden">
                {layer.imageUrl && (
                  <img
                    src={layer.imageUrl}
                    alt={layer.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
