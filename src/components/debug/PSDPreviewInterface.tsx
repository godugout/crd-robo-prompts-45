
import React, { useState, useMemo } from 'react';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { EnhancedCardFrameFittingInterface } from './components/EnhancedCardFrameFittingInterface';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { EnhancedPSDCanvasPreview } from './components/EnhancedPSDCanvasPreview';
import { EnhancedLayerVisualization } from './components/EnhancedLayerVisualization';
import { findLargestLayerByVolume } from '@/utils/layerUtils';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Frame,
  Wand2,
  Layers,
  Palette
} from 'lucide-react';

interface PSDPreviewInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({
  processedPSD
}) => {
  const [selectedLayerIds, setSelectedLayerIds] = useState<Set<string>>(new Set());
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [selectedFrame, setSelectedFrame] = useState('classic-sports');
  const [activeTab, setActiveTab] = useState<'inspect' | 'frame' | 'build' | 'visualize'>('visualize');
  const [generatedFrames, setGeneratedFrames] = useState<any[]>([]);
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());
  const [focusMode, setFocusMode] = useState(false);
  const [showBackground, setShowBackground] = useState(true);
  const [showOriginal, setShowOriginal] = useState(true);
  const [layerOrder, setLayerOrder] = useState<number[]>([]);

  // Initialize layer order and selection
  React.useEffect(() => {
    if (processedPSD && layerOrder.length === 0) {
      setLayerOrder(processedPSD.layers.map((_, index) => index));
      
      // Auto-select the largest layer
      const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
      if (largestLayerId) {
        setSelectedLayerIds(new Set([largestLayerId]));
      }
    }
  }, [processedPSD, layerOrder.length]);

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayers((prev) => {
      const newHidden = new Set(prev);
      if (newHidden.has(layerId)) {
        newHidden.delete(layerId);
      } else {
        newHidden.add(layerId);
      }
      return newHidden;
    });
  };

  const handleLayerSelect = (layerId: string, multiSelect = false) => {
    setSelectedLayerIds((prev) => {
      const newSelected = new Set(prev);
      
      if (multiSelect) {
        if (newSelected.has(layerId)) {
          newSelected.delete(layerId);
        } else {
          newSelected.add(layerId);
        }
      } else {
        newSelected.clear();
        newSelected.add(layerId);
      }
      
      return newSelected;
    });
  };

  const handleLayerReorder = (dragIndex: number, hoverIndex: number) => {
    setLayerOrder((prev) => {
      const newOrder = [...prev];
      const draggedItem = newOrder[dragIndex];
      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, draggedItem);
      return newOrder;
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

  const selectedLayer = processedPSD.layers.find(layer => selectedLayerIds.has(layer.id));
  const visibleLayerCount = processedPSD.layers.length - hiddenLayers.size;
  const allFrames = [...generatedFrames];

  // Tab configuration with new visualize mode
  const tabConfig = [
    {
      id: 'visualize' as const,
      label: 'Layer Visualizer',
      icon: Palette,
      description: 'Interactive layer effects and multi-selection'
    },
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
    <div className="h-full bg-cardshow-dark flex flex-col">
      {/* Unified Tab Navigation */}
      <div className="bg-cardshow-dark-100 border-b border-cardshow-dark-100 p-4 flex-shrink-0">
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
              <Badge className="bg-cardshow-blue text-white ml-2">
                {generatedFrames.length} Generated
              </Badge>
            )}
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-cardshow-dark text-cardshow-light-300 border-cardshow-dark-100">
              {visibleLayerCount} visible
            </Badge>
            
            {selectedLayerIds.size > 0 && (
              <Badge className="bg-cardshow-green text-black font-medium px-3 py-1">
                {selectedLayerIds.size} selected
              </Badge>
            )}
            
            {focusMode && (
              <Badge className="bg-cardshow-primary text-white font-medium px-3 py-1">
                Focus Mode
              </Badge>
            )}
            
            {flippedLayers.size > 0 && (
              <Badge className="bg-cardshow-blue text-white font-medium px-3 py-1">
                {flippedLayers.size} CRD Branded
              </Badge>
            )}
          </div>
        </div>
        
        {/* Tab Description */}
        <div className="mt-2 text-sm text-cardshow-light-700">
          {tabConfig.find(tab => tab.id === activeTab)?.description}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 p-6">
          {activeTab === 'visualize' && (
            <EnhancedLayerVisualization
              processedPSD={processedPSD}
              selectedLayerIds={selectedLayerIds}
              hiddenLayers={hiddenLayers}
              showOriginal={showOriginal}
              onLayerSelect={handleLayerSelect}
              onLayerToggle={toggleLayerVisibility}
              onLayerReorder={handleLayerReorder}
              onToggleOriginal={() => setShowOriginal(!showOriginal)}
            />
          )}
          
          {activeTab === 'inspect' && (
            <EnhancedPSDCanvasPreview
              processedPSD={processedPSD}
              selectedLayerId={Array.from(selectedLayerIds)[0] || ''}
              hiddenLayers={hiddenLayers}
              onLayerSelect={(id) => handleLayerSelect(id)}
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
              selectedLayerId={Array.from(selectedLayerIds)[0] || ''}
              hiddenLayers={hiddenLayers}
              onLayerSelect={(id) => handleLayerSelect(id)}
              selectedFrame={selectedFrame}
              availableFrames={allFrames}
              onFrameSelect={setSelectedFrame}
            />
          )}
          
          {activeTab === 'build' && (
            <CRDFrameBuilder
              processedPSD={processedPSD}
              selectedLayerId={Array.from(selectedLayerIds)[0] || ''}
              onFrameGenerated={handleFrameGenerated}
            />
          )}
        </div>

        {/* Enhanced Inspector Sidebar - Only show for non-visualize tabs */}
        {activeTab !== 'visualize' && (
          <div className="w-80 bg-cardshow-dark-100 border-l border-cardshow-dark-100 flex flex-col">
            <div className="p-4 border-b border-cardshow-dark-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-cardshow-blue" />
                <h2 className="text-lg font-semibold text-white">Layer Inspector</h2>
              </div>
              <p className="text-sm text-cardshow-light-700 mt-1">
                {activeTab === 'inspect' && 'Interactive layer exploration and analysis'}
                {activeTab === 'frame' && 'Frame fitting optimization and content analysis'}
                {activeTab === 'build' && 'CRD frame generation and customization tools'}
              </p>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <SimplifiedLayerInspector
                layers={processedPSD.layers}
                selectedLayerId={Array.from(selectedLayerIds)[0] || ''}
                hiddenLayers={hiddenLayers}
                onLayerSelect={(id) => handleLayerSelect(id)}
                onToggleVisibility={toggleLayerVisibility}
                mode={activeTab}
                flippedLayers={flippedLayers}
                onFlippedLayersChange={handleFlippedLayersChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
