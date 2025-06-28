
import React, { useState, useMemo } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { CardFrameFittingInterface } from './components/CardFrameFittingInterface';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { findLargestLayerByVolume } from '@/utils/layerUtils';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  Palette,
  Square,
  Settings
} from 'lucide-react';

interface PSDPreviewInterfaceProps {
  processedPSD: ProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({
  processedPSD
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [selectedFrame, setSelectedFrame] = useState('classic-sports');

  // Initialize with largest layer selected
  React.useEffect(() => {
    if (processedPSD && !selectedLayerId) {
      const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
      if (largestLayerId) {
        setSelectedLayerId(largestLayerId);
      }
    }
  }, [processedPSD, selectedLayerId]);

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayers((prevHiddenLayers) => {
      const newHiddenLayers = new Set(prevHiddenLayers);
      if (newHiddenLayers.has(layerId)) {
        newHiddenLayers.delete(layerId);
      } else {
        newHiddenLayers.add(layerId);
      }
      return newHiddenLayers;
    });
  };

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const visibleLayerCount = processedPSD.layers.length - hiddenLayers.size;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full max-w-7xl mx-auto">
      {/* Card Frame Fitting Interface - Takes up 3/4 width on large screens */}
      <div className="xl:col-span-3">
        <PSDCard variant="elevated">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-crd-green" />
                  <div>
                    <h1 className="text-xl font-bold text-white">Card Frame Fitting</h1>
                    <p className="text-sm text-slate-400">
                      Position and crop your image within the selected frame
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                  {processedPSD.width} × {processedPSD.height}px
                </Badge>
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                  {visibleLayerCount} visible
                </Badge>
              </div>
            </div>

            {/* Selected Layer Info */}
            {selectedLayer && (
              <div className="flex items-center justify-between">
                <Badge className="bg-crd-green text-black font-medium px-3 py-1">
                  Active: {selectedLayer.name}
                </Badge>
                
                <PSDButton
                  variant="secondary"
                  size="sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Frame Settings
                </PSDButton>
              </div>
            )}
          </div>
          
          {/* Frame Fitting Interface */}
          <div className="p-6">
            <CardFrameFittingInterface
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={setSelectedLayerId}
              selectedFrame={selectedFrame}
            />
          </div>
        </PSDCard>
      </div>

      {/* Layer Inspector - Takes up 1/4 width on large screens */}
      <div className="xl:col-span-1">
        <PSDCard variant="elevated">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Square className="w-5 h-5 text-crd-blue" />
              <h2 className="text-lg font-semibold text-white">Layer Inspector</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Organize layers for perfect card fitting
            </p>
          </div>
          
          <div className="p-4">
            <SimplifiedLayerInspector
              layers={processedPSD.layers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={setSelectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerToggle={toggleLayerVisibility}
            />
          </div>
        </PSDCard>
      </div>
    </div>
  );
};
