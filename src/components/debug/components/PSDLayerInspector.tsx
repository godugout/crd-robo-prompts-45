
import React from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { EnhancedPSDLayerInspector } from './enhanced/EnhancedPSDLayerInspector';

interface PSDLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  layerGroups: LayerGroup[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = (props) => {
  return <EnhancedPSDLayerInspector {...props} />;
};
