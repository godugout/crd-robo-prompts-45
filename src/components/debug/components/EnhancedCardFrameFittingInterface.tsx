
import React, { useState } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDCanvasPreview } from './PSDCanvasPreview';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';

interface EnhancedCardFrameFittingInterfaceProps {
  processedPSD: ProcessedPSD;
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  selectedFrame: string;
  availableFrames: any[];
  onFrameSelect: (frameId: string) => void;
}

export const EnhancedCardFrameFittingInterface: React.FC<EnhancedCardFrameFittingInterfaceProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  selectedFrame,
  availableFrames,
  onFrameSelect
}) => {
  const [focusMode, setFocusMode] = useState(false);

  // Create empty layer groups for now - you can enhance this later
  const layerGroups: LayerGroup[] = [];

  return (
    <div className="h-full bg-[#0a0a0b] flex flex-col">
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-[#1a1f2e] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">PSD Preview</h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={focusMode}
                    onChange={(e) => setFocusMode(e.target.checked)}
                    className="rounded bg-slate-700 border-slate-600"
                  />
                  Focus Mode
                </label>
              </div>
            </div>
            
            <PSDCanvasPreview
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              layerGroups={layerGroups}
              onLayerSelect={onLayerSelect}
              frameBuilderMode={false}
              focusMode={focusMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
