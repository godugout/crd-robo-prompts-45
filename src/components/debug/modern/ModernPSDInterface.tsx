
import React, { useState, useCallback, useMemo } from 'react';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StablePSDCanvasViewer } from './StablePSDCanvasViewer';
import { PSDLayerInspector } from './PSDLayerInspector';
import { PSDViewModeSelector } from './PSDViewModeSelector';
import { SavePSDCardDialog } from '@/components/debug/components/SavePSDCardDialog';
import { Eye, EyeOff, Save, Layers, Grid, Frame, Wrench } from 'lucide-react';
import { findLargestLayerByVolume } from '@/utils/layerUtils';

interface ModernPSDInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
}

type ViewMode = 'inspect' | 'thumbnails' | 'frame' | 'build';

export const ModernPSDInterface: React.FC<ModernPSDInterfaceProps> = ({ processedPSD }) => {
  // All hooks are called at the top level - no conditional hooks
  const [activeTab, setActiveTab] = useState<ViewMode>('inspect');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [reorderedLayers, setReorderedLayers] = useState<ProcessedPSDLayer[]>(processedPSD.layers);
  const [showBackground, setShowBackground] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Initialize selected layer on mount
  React.useEffect(() => {
    if (!selectedLayerId && processedPSD.layers.length > 0) {
      const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
      if (largestLayerId) {
        setSelectedLayerId(largestLayerId);
      }
    }
  }, [selectedLayerId, processedPSD.layers]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleLayerSelect = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);

  const handleLayerToggle = useCallback((layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  }, []);

  const handleLayersReorder = useCallback((newLayers: ProcessedPSDLayer[]) => {
    setReorderedLayers(newLayers);
  }, []);

  const handleToggleBackground = useCallback(() => {
    setShowBackground(prev => !prev);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as ViewMode);
  }, []);

  // Memoized selected layer IDs for save dialog
  const selectedLayerIds = useMemo(() => {
    const visibleLayers = reorderedLayers.filter(layer => !hiddenLayers.has(layer.id));
    return visibleLayers.map(layer => layer.id);
  }, [reorderedLayers, hiddenLayers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-full p-4">
      {/* Layer Inspector - Left Sidebar */}
      <div className="lg:col-span-1 h-full">
        <PSDLayerInspector
          layers={reorderedLayers}
          selectedLayerId={selectedLayerId}
          hiddenLayers={hiddenLayers}
          onLayerSelect={handleLayerSelect}
          onLayerToggle={handleLayerToggle}
          onLayersReorder={handleLayersReorder}
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-4 h-full flex flex-col">
        <Card className="bg-[#1a1f2e] border-slate-700 flex-1 flex flex-col">
          {/* Header with Tabs and Controls */}
          <div className="border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center justify-between p-3">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="bg-transparent">
                  <TabsTrigger 
                    value="inspect" 
                    className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1"
                  >
                    <Layers className="w-3 h-3 mr-1" />
                    Inspect
                  </TabsTrigger>
                  <TabsTrigger 
                    value="thumbnails" 
                    className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1"
                  >
                    <Grid className="w-3 h-3 mr-1" />
                    Thumbnails
                  </TabsTrigger>
                  <TabsTrigger 
                    value="frame" 
                    className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1"
                  >
                    <Frame className="w-3 h-3 mr-1" />
                    Frame
                  </TabsTrigger>
                  <TabsTrigger 
                    value="build" 
                    className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1"
                  >
                    <Wrench className="w-3 h-3 mr-1" />
                    Build
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleBackground}
                  className="text-xs px-2 py-1"
                >
                  {showBackground ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  className="bg-crd-green text-black hover:bg-crd-green/90 text-xs px-2 py-1"
                  size="sm"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Badge variant="secondary" className="text-xs">
                  {processedPSD.width} × {processedPSD.height}
                </Badge>
              </div>
            </div>
          </div>

          {/* Canvas Viewer - Always rendered, mode controlled by props */}
          <div className="flex-1 min-h-0">
            <StablePSDCanvasViewer
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              reorderedLayers={reorderedLayers}
              showBackground={showBackground}
              viewMode={activeTab}
              onLayerSelect={handleLayerSelect}
            />
          </div>

          {/* View Mode Specific Content */}
          <div className="border-t border-slate-700 flex-shrink-0">
            <PSDViewModeSelector
              viewMode={activeTab}
              layers={reorderedLayers}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={handleLayerSelect}
              onLayerToggle={handleLayerToggle}
            />
          </div>
        </Card>
      </div>

      {/* Save Dialog */}
      <SavePSDCardDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        processedPSD={processedPSD}
        selectedLayerIds={selectedLayerIds}
      />
    </div>
  );
};
