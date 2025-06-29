
import React from 'react';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { LayerThumbnailView } from '@/components/debug/components/LayerThumbnailView';
import { FrameModeView } from '@/components/debug/components/FrameModeView';
import { CRDFrameBuilder } from '@/components/debug/components/CRDFrameBuilder';

interface PSDViewModeSelectorProps {
  viewMode: 'inspect' | 'thumbnails' | 'frame' | 'build';
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const PSDViewModeSelector: React.FC<PSDViewModeSelectorProps> = ({
  viewMode,
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  // Always render content based on viewMode - no conditional hooks
  if (viewMode === 'inspect') {
    return (
      <div className="p-3 text-center text-slate-400 text-sm">
        Inspect mode: Click on layers in the canvas to select them
      </div>
    );
  }

  if (viewMode === 'thumbnails') {
    return (
      <div className="p-3 max-h-48 overflow-y-auto">
        <LayerThumbnailView
          layers={layers}
          selectedLayerId={selectedLayerId}
          hiddenLayers={hiddenLayers}
          onLayerSelect={onLayerSelect}
          onLayerToggle={onLayerToggle}
        />
      </div>
    );
  }

  if (viewMode === 'frame') {
    return (
      <div className="p-3 max-h-48 overflow-y-auto">
        <FrameModeView
          layers={layers}
          selectedLayerId={selectedLayerId}
          onLayerSelect={onLayerSelect}
        />
      </div>
    );
  }

  if (viewMode === 'build') {
    return (
      <div className="p-3 max-h-48 overflow-y-auto">
        <CRDFrameBuilder
          selectedLayerId={selectedLayerId}
          hiddenLayers={hiddenLayers}
        />
      </div>
    );
  }

  return null;
};
