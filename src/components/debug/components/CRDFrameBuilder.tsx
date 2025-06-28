
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { Download, Eye, EyeOff, Layers, Palette } from 'lucide-react';

export interface CRDFrameBuilderProps {
  layers: ProcessedPSDLayer[];
  layerGroups: LayerGroup[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
}

export const CRDFrameBuilder: React.FC<CRDFrameBuilderProps> = ({
  layers,
  layerGroups,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle
}) => {
  return (
    <div className="space-y-4">
      {/* Layer List */}
      <Card className="bg-[#0a0f1b] border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-crd-green" />
              <h3 className="text-lg font-semibold text-white">Layers</h3>
              <Badge variant="outline" className="text-xs">
                {layers.length} Layers
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-700 ${
                selectedLayerId === layer.id ? 'bg-slate-600' : ''
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggle(layer.id);
                  }}
                >
                  {hiddenLayers.has(layer.id) ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
                <span className="text-sm text-white">{layer.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {layer.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Layer Grouping */}
      <Card className="bg-[#0a0f1b] border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-crd-green" />
              <h3 className="text-lg font-semibold text-white">Groups</h3>
              <Badge variant="outline" className="text-xs">
                {layerGroups.length} Groups
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-[200px] overflow-y-auto">
          {layerGroups.map((group) => (
            <div key={group.id} className="p-2 rounded-md bg-slate-800">
              <h4 className="text-sm font-medium text-white">{group.name}</h4>
              <p className="text-xs text-slate-400">
                {group.layers.length} layers
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
