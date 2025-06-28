import React, { useState, useMemo } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { EnhancedCardFrameFittingInterface } from './components/EnhancedCardFrameFittingInterface';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { findLargestLayerByVolume } from '@/utils/layerUtils';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  Square,
  Wand2,
  FrameIcon
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
  const [activeTab, setActiveTab] = useState<'fitting' | 'builder'>('fitting');
  const [generatedFrames, setGeneratedFrames] = useState<any[]>([]);
  const [currentMode, setCurrentMode] = useState<'elements' | 'frame' | 'preview'>('elements');
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());

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

  const handleFrameGenerated = (svgContent: string) => {
    const newFrame = {
      id: `generated-${Date.now()}`,
      name: `Generated Frame ${generatedFrames.length + 1}`,
      category: 'AI Generated',
      svgContent
    };
    setGeneratedFrames(prev => [...prev, newFrame]);
    setSelectedFrame(newFrame.id);
    setActiveTab('fitting');
  };

  const handleModeChange = (mode: 'elements' | 'frame' | 'preview') => {
    setCurrentMode(mode);
  };

  const handleFlippedLayersChange = (flipped: Set<string>) => {
    setFlippedLayers(flipped);
  };

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const visibleLayerCount = processedPSD.layers.length - hiddenLayers.size;
  const allFrames = [...generatedFrames];

  return (
    <div className="h-full bg-[#0a0a0b] flex flex-col">
      {/* Tab Navigation Bar */}
      <div className="bg-[#1a1f2e] border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PSDButton
              variant={activeTab === 'fitting' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveTab('fitting')}
            >
              <FrameIcon className="w-4 h-4 mr-2" />
              Frame Fitting
            </PSDButton>
            <PSDButton
              variant={activeTab === 'builder' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveTab('builder')}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              CRD Builder
            </PSDButton>
            
            {generatedFrames.length > 0 && (
              <Badge className="bg-crd-blue text-white">
                {generatedFrames.length} Generated
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
              {visibleLayerCount} visible
            </Badge>
            {selectedLayer && activeTab === 'fitting' && currentMode !== 'preview' && (
              <Badge className="bg-crd-green text-black font-medium px-3 py-1">
                Active: {selectedLayer.name}
              </Badge>
            )}
            {currentMode === 'preview' && flippedLayers.size > 0 && (
              <Badge className="bg-crd-blue text-white font-medium px-3 py-1">
                {flippedLayers.size} CRD Branded
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1">
          {activeTab === 'fitting' && (
            <EnhancedCardFrameFittingInterface
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={setSelectedLayerId}
              selectedFrame={selectedFrame}
              availableFrames={allFrames}
              onFrameSelect={setSelectedFrame}
            />
          )}
          
          {activeTab === 'builder' && (
            <CRDFrameBuilder
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              onFrameGenerated={handleFrameGenerated}
            />
          )}
        </div>

        {/* Layer Inspector Sidebar */}
        <div className="w-80 bg-[#1a1f2e] border-l border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Square className="w-5 h-5 text-crd-blue" />
              <h2 className="text-lg font-semibold text-white">Layer Inspector</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {currentMode === 'elements' && 'Detailed layer analysis and sorting'}
              {currentMode === 'frame' && 'Content vs Design separation'}
              {currentMode === 'preview' && 'CRD branding preview mode'}
            </p>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <SimplifiedLayerInspector
              layers={processedPSD.layers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={setSelectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerToggle={toggleLayerVisibility}
              onModeChange={handleModeChange}
              onFlippedLayersChange={handleFlippedLayersChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
