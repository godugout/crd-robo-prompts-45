
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

  // Sort layers by visual stacking order for display
  const sortedLayers = [...layers].sort((a, b) => {
    const aDepth = a.inferredDepth || a.bounds.top;
    const bDepth = b.inferredDepth || b.bounds.top;
    return aDepth - bDepth; // Top to bottom in sidebar matches canvas rendering
  });

  const handleModeChange = (mode: LayerMode) => {
    setCurrentMode(mode);
    onModeChange?.(mode);
  };

  const renderModeContent = () => {
    switch (currentMode) {
      case 'elements':
        return (
          <ElementsModeView
            layers={sortedLayers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
            onLayerToggle={onLayerToggle}
          />
        );
      case 'frame':
        return (
          <FrameModeView
            layers={sortedLayers}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            onLayerSelect={onLayerSelect}
            onLayerToggle={onLayerToggle}
          />
        );
      case 'preview':
        return (
          <PreviewModeView
            layers={sortedLayers}
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
    <div className="h-full flex flex-col">
      {/* Prominent Mode Toggle at Top */}
      <div className="flex-shrink-0 p-3 border-b border-slate-700 bg-[#1a1f2e]">
        <LayerModeToggle
          currentMode={currentMode}
          onModeChange={handleModeChange}
          layerCount={layers.length}
        />
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderModeContent()}
      </div>
    </div>
  );
};
