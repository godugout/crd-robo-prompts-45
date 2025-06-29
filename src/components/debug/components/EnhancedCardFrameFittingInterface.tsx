import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { Button } from '@/components/ui/button';

interface EnhancedCardFrameFittingInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
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
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);

  const handleScaleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  }, []);

  const handleOffsetXChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setOffsetX(parseFloat(event.target.value));
  }, []);

  const handleOffsetYChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setOffsetY(parseFloat(event.target.value));
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b]">
      <div className="flex-1 p-6 space-y-6">
        <Card className="bg-[#1a1f2e] border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Frame Fitting Interface</h3>
          
          {selectedLayer && (
            <div className="mb-4 p-4 bg-slate-800 rounded-lg">
              <h4 className="text-white font-medium mb-2">Selected Layer</h4>
              <p className="text-slate-300">{selectedLayer.name}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Frame Selection */}
            <div>
              <h4 className="text-white font-medium mb-2">Select Frame</h4>
              <select
                value={selectedFrame}
                onChange={(e) => onFrameSelect(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-md p-2"
              >
                {availableFrames.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scaling */}
            <div>
              <h4 className="text-white font-medium mb-2">Scale</h4>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.01"
                value={scale}
                onChange={handleScaleChange}
                className="w-full"
              />
              <p className="text-slate-400 text-sm">Current Scale: {scale.toFixed(2)}</p>
            </div>

            {/* Offset X */}
            <div>
              <h4 className="text-white font-medium mb-2">Offset X</h4>
              <input
                type="range"
                min="-200"
                max="200"
                step="1"
                value={offsetX}
                onChange={handleOffsetXChange}
                className="w-full"
              />
              <p className="text-slate-400 text-sm">Current Offset X: {offsetX}</p>
            </div>

            {/* Offset Y */}
            <div>
              <h4 className="text-white font-medium mb-2">Offset Y</h4>
              <input
                type="range"
                min="-200"
                max="200"
                step="1"
                value={offsetY}
                onChange={handleOffsetYChange}
                className="w-full"
              />
              <p className="text-slate-400 text-sm">Current Offset Y: {offsetY}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1f2e] border-slate-700 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Frame Preview</h4>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="w-full h-64 flex items-center justify-center">
              {/* Placeholder for Frame Preview */}
              <svg width="400" height="300" viewBox="0 0 400 300">
                <rect width="400" height="300" fill="#334155" />
                {selectedLayer && (
                  <g transform={`scale(${scale}) translate(${offsetX}, ${offsetY})`}>
                    <text x="200" y="150" textAnchor="middle" fill="white" fontSize="20">
                      {selectedLayer.name}
                    </text>
                  </g>
                )}
                <text x="200" y="280" textAnchor="middle" fill="white" fontSize="12">
                  Frame: {selectedFrame}
                </text>
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
