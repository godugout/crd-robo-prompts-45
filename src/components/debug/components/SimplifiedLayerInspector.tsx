
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerModeToggle, LayerMode } from './LayerModeToggle';
import { ElementsModeView } from './ElementsModeView';
import { FrameModeView } from './FrameModeView';
import { PreviewModeView } from './PreviewModeView';

interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onModeChange?: (mode: LayerMode) => void;
  onFlippedLayersChange?: (flippedLayers: Set<string>) => void;
}

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle,
  onModeChange,
  onFlippedLayersChange
}) => {
  const [currentMode, setCurrentMode] = useState<LayerMode>('elements');

  const handleModeChange = (mode: LayerMode) => {
    setCurrentMode(mode);
    onModeChange?.(mode);
  };

  const renderModeContent = () => {
    switch (currentMode) {
      case 'elements':
        return (
          <ElementsModeView
            layers={layers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
            onLayerToggle={onLayerToggle}
          />
        );
      case 'frame':
        return (
          <FrameModeView
            layers={layers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
            onLayerToggle={onLayerToggle}
          />
        );
      case 'preview':
        return (
          <PreviewModeView
            layers={layers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <LayerModeToggle
        currentMode={currentMode}
        onModeChange={handleModeChange}
        layerCount={layers.length}
      />
      
      <div className="min-h-0 flex-1">
        {renderModeContent()}
      </div>
    </div>
  );
};
