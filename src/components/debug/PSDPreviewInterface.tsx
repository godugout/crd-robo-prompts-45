import React, { useState, useMemo } from 'react';
import { EnhancedProcessedPSD } from '@/services/psdProcessor/enhancedPsdProcessingService';
import { EnhancedCardFrameFittingInterface } from './components/EnhancedCardFrameFittingInterface';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { EnhancedPSDCanvasPreview } from './components/EnhancedPSDCanvasPreview';
import { findLargestLayerByVolume } from '@/utils/layerUtils';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Frame,
  Wand2,
  Layers
} from 'lucide-react';

interface PSDPreviewInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({
  processedPSD
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [selectedFrame, setSelectedFrame] = useState('classic-sports');
  const [activeTab, setActiveTab] = useState<'inspect' | 'frame' | 'build'>('inspect');
  const [generatedFrames, setGeneratedFrames] = useState<any[]>([]);
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());
  const [focusMode, setFocusMode] = useState(false);
  const [showBackground, setShowBackground] = useState(true);

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
    setActiveTab('frame');
  };

  const handleFlippedLayersChange = (flipped: Set<string>) => {
    setFlippedLayers(flipped);
  };

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const visibleLayerCount = processedPSD.layers.length - hiddenLayers.size;
  const allFrames = [...generatedFrames];

  // Tab configuration with unified mode system
  const tabConfig = [
    {
      id: 'inspect' as const,
      label: 'Inspect Layers',
      icon: Search,
      description: 'Analyze and explore PSD layers'
    },
    {
      id: 'frame' as const,
      label: 'Frame Analysis',
      icon: Frame,
      description: 'Fit content to existing frames'
    },
    {
      id: 'build' as const,
      label: 'Build Frames',
      icon: Wand2,
      description: 'Generate custom CRD frames'
    }
  ];

  return (
    <div className="h-full bg-[#0a0a0b] flex flex-col">
      {/* Unified Tab Navigation */}
      <div className="bg-[#1a1f2e] border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <PSDButton
                  key={tab.id}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </PSDButton>
              );
            })}
            
            {generatedFrames.length > 0 && (
              <Badge className="bg-crd-blue text-white ml-2">
                {generatedFrames.length} Generated
              </Badge>
            )}
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
              {visibleLayerCount} visible
            </Badge>
            
            {selectedLayer && (
              <Badge className="bg-crd-green text-black font-medium px-3 py-1">
                Active: {selectedLayer.name}
              </Badge>
            )}
            
            {focusMode && (
              <Badge className="bg-blue-500 text-white font-medium px-3 py-1">
                Focus Mode
              </Badge>
            )}
            
            {flippedLayers.size > 0 && (
              <Badge className="bg-crd-blue text-white font-medium px-3 py-1">
                {flippedLayers.size} CRD Branded
              </Badge>
            )}
          </div>
        </div>
        
        {/* Tab Description */}
        <div className="mt-2 text-sm text-slate-400">
          {tabConfig.find(tab => tab.id === activeTab)?.description}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1">
          {activeTab === 'inspect' && (
            <EnhancedPSDCanvasPreview
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={setSelectedLayerId}
              focusMode={focusMode}
              onFocusModeToggle={() => setFocusMode(!focusMode)}
              showBackground={showBackground}
              onToggleBackground={() => setShowBackground(!showBackground)}
              viewMode="inspect"
            />
          )}
          
          {activeTab === 'frame' && (
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
          
          {activeTab === 'build' && (
            <CRDFrameBuilder
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              onFrameGenerated={handleFrameGenerated}
            />
          )}
        </div>

        {/* Enhanced Inspector Sidebar */}
        <div className="w-80 bg-[#1a1f2e] border-l border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-crd-blue" />
              <h2 className="text-lg font-semibold text-white">Layer Inspector</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {activeTab === 'inspect' && 'Interactive layer exploration and analysis'}
              {activeTab === 'frame' && 'Frame fitting optimization and content analysis'}
              {activeTab === 'build' && 'CRD frame generation and customization tools'}
            </p>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <SimplifiedLayerInspector
              layers={processedPSD.layers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={setSelectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerToggle={toggleLayerVisibility}
              onFlippedLayersChange={handleFlippedLayersChange}
              viewMode={activeTab}
              focusMode={focusMode}
              showBackground={showBackground}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
