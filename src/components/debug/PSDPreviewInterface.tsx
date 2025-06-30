
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { PersistentCardPreview } from './components/PersistentCardPreview';
import { ElementsModeView } from './components/ElementsModeView';
import { FrameModeView } from './components/FrameModeView';
import { PreviewModeView } from './components/PreviewModeView';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Eye, EyeOff, Layers, Frame, Play, Wrench, Settings } from 'lucide-react';

type ViewMode = 'inspect' | 'frame' | 'elements' | 'preview' | 'build';

interface PSDPreviewInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({ 
  processedPSD 
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set());
  const [showOriginal, setShowOriginal] = useState(false);
  const [mode, setMode] = useState<ViewMode>('inspect');
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());

  const handleLayerSelect = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);

  const handleLayerToggle = useCallback((layerId: string) => {
    setHiddenLayers((prevHiddenLayers) => {
      const newHiddenLayers = new Set(prevHiddenLayers);
      if (newHiddenLayers.has(layerId)) {
        newHiddenLayers.delete(layerId);
      } else {
        newHiddenLayers.add(layerId);
      }
      return newHiddenLayers;
    });
  }, []);

  const handleToggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <div className="h-screen bg-[#0a0a0b] flex flex-col">
      {/* Compact Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">
              {processedPSD.fileName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span>{processedPSD.width} × {processedPSD.height}px</span>
              <Badge variant="secondary">{processedPSD.layers.length} layers</Badge>
            </div>
          </div>
          
          <Button
            variant={showOriginal ? "default" : "outline"}
            size="sm"
            onClick={handleToggleOriginal}
            className="flex items-center gap-2"
          >
            {showOriginal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Original
          </Button>
        </div>
      </div>

      {/* Main Layout with Persistent Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Always Visible Card Preview */}
        <div className="w-1/2 bg-slate-900 flex items-center justify-center p-6">
          <PersistentCardPreview
            processedPSD={processedPSD}
            selectedLayerId={selectedLayerId}
            hiddenLayers={hiddenLayers}
            flippedLayers={flippedLayers}
            showOriginal={showOriginal}
            mode={mode}
            onLayerSelect={handleLayerSelect}
          />
        </div>

        {/* Right: Dynamic Interface Based on Mode */}
        <div className="w-1/2 bg-[#1a1f2e] flex flex-col">
          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={(value: ViewMode) => setMode(value)} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-b border-slate-700 rounded-none">
              <TabsTrigger value="inspect" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Inspect
              </TabsTrigger>
              <TabsTrigger value="frame" className="flex items-center gap-2">
                <Frame className="w-4 h-4" />
                Frame
              </TabsTrigger>
              <TabsTrigger value="elements" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Elements
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="build" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Build
              </TabsTrigger>
            </TabsList>

            {/* Dynamic Content Area */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="inspect" className="h-full m-0 p-0">
                <div className="h-full p-4">
                  <SimplifiedLayerInspector
                    layers={processedPSD.layers}
                    selectedLayerId={selectedLayerId}
                    hiddenLayers={hiddenLayers}
                    onLayerSelect={handleLayerSelect}
                    onToggleVisibility={handleLayerToggle}
                    mode={mode}
                    flippedLayers={flippedLayers}
                    onFlippedLayersChange={setFlippedLayers}
                  />
                </div>
              </TabsContent>

              <TabsContent value="frame" className="h-full m-0 p-0">
                <FrameModeView 
                  processedPSD={processedPSD}
                  selectedLayerId={selectedLayerId}
                  hiddenLayers={hiddenLayers}
                  onLayerSelect={handleLayerSelect}
                  onToggleVisibility={handleLayerToggle}
                />
              </TabsContent>

              <TabsContent value="elements" className="h-full m-0 p-0">
                <ElementsModeView 
                  processedPSD={processedPSD}
                  selectedLayerId={selectedLayerId}
                  hiddenLayers={hiddenLayers}
                  onLayerSelect={handleLayerSelect}
                  onToggleVisibility={handleLayerToggle}
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full m-0 p-0">
                <PreviewModeView 
                  processedPSD={processedPSD}
                  selectedLayerId={selectedLayerId}
                  hiddenLayers={hiddenLayers}
                  onLayerSelect={handleLayerSelect}
                  onToggleVisibility={handleLayerToggle}
                />
              </TabsContent>

              <TabsContent value="build" className="h-full m-0 p-0">
                <CRDFrameBuilder 
                  processedPSD={processedPSD}
                  selectedLayerId={selectedLayerId}
                  hiddenLayers={hiddenLayers}
                  flippedLayers={flippedLayers}
                  onLayerSelect={handleLayerSelect}
                  onToggleVisibility={handleLayerToggle}
                  onFlippedLayersChange={setFlippedLayers}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
