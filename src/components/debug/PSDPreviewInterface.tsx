
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Layers3, Map as MapIcon, Settings, Palette } from 'lucide-react';
import { ProcessedPSD, ProcessedPSDLayer, psdProcessingService } from '@/services/psdProcessor/psdProcessingService';
import { layerGroupingService, LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { PSDLayerInspector } from './components/PSDLayerInspector';
import { PSDCanvasPreview } from './components/PSDCanvasPreview';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { CRDFrame } from '@/types/crdFrames';
import { toast } from 'sonner';

interface PSDPreviewInterfaceProps {
  processedPSD?: ProcessedPSD | null;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({ processedPSD = null }) => {
  const [showDepthMap, setShowDepthMap] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [layerVisibility, setLayerVisibility] = useState<Map<string, boolean>>(new Map());
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>([]);
  const [activeTab, setActiveTab] = useState('layers');

  // Initialize layer visibility and groups when PSD data changes
  useEffect(() => {
    if (processedPSD?.layers) {
      const visibilityMap = new Map();
      processedPSD.layers.forEach(layer => {
        visibilityMap.set(layer.id, layer.visible);
      });
      setLayerVisibility(visibilityMap);
      
      // Auto-select first layer if none selected
      if (!selectedLayerId && processedPSD.layers.length > 0) {
        setSelectedLayerId(processedPSD.layers[0].id);
      }

      // Generate layer groups
      const groups = layerGroupingService.groupLayers(processedPSD.layers);
      setLayerGroups(groups);
      
      console.log('Generated layer groups:', groups);
    }
  }, [processedPSD, selectedLayerId]);

  const handleLayerSelect = useCallback((layer: ProcessedPSDLayer) => {
    setSelectedLayerId(layer.id);
  }, []);

  const handleCanvasLayerClick = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayerVisibility(prev => {
      const newMap = new Map(prev);
      newMap.set(layerId, !prev.get(layerId));
      return newMap;
    });
  }, []);

  const handleFrameCreated = useCallback((frame: CRDFrame) => {
    console.log('New CRD Frame created:', frame);
    toast.success(`CRD Frame "${frame.name}" created successfully!`);
    
    // Here you would typically save the frame to your database or frame library
    // For now, we'll just log it and show a success message
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!processedPSD?.layers || processedPSD.layers.length === 0) return;

      const currentIndex = selectedLayerId 
        ? processedPSD.layers.findIndex(layer => layer.id === selectedLayerId)
        : -1;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            setSelectedLayerId(processedPSD.layers[currentIndex - 1].id);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < processedPSD.layers.length - 1) {
            setSelectedLayerId(processedPSD.layers[currentIndex + 1].id);
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedLayerId) {
            toggleLayerVisibility(selectedLayerId);
          }
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          if (selectedLayerId) {
            setLayerVisibility(prev => {
              const newMap = new Map(prev);
              newMap.set(selectedLayerId, false);
              return newMap;
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processedPSD, selectedLayerId, toggleLayerVisibility]);

  if (!processedPSD) {
    return (
      <div className="bg-[#0a0f1b] rounded-lg p-6 text-center">
        <p className="text-slate-400">No PSD data to display</p>
      </div>
    );
  }

  const renderDepthVisualization = () => {
    if (!showDepthMap || !processedPSD.layers) return null;

    const layersToShow = processedPSD.layers.slice(0, 30);

    return (
      <Card className="bg-[#0a0f1b] border-slate-800">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <MapIcon className="w-5 h-5 mr-2 text-crd-green" />
            Depth Visualization
          </h3>
          <div 
            className="relative bg-slate-900 rounded-lg overflow-hidden"
            style={{ 
              width: Math.min(processedPSD.width, 600), 
              height: Math.min(processedPSD.height, 400) 
            }}
          >
            {layersToShow.map((layer) => {
              const isVisible = layerVisibility.get(layer.id) ?? layer.visible;
              const isSelected = selectedLayerId === layer.id;
              const depth = layer.inferredDepth ?? 0.5;
              const brightness = Math.round(depth * 255);
              const groupColor = layerGroups.find(g => g.layers.some(l => l.id === layer.id))?.color;
              
              if (!isVisible) return null;

              return (
                <div
                  key={layer.id}
                  className={`absolute cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-blue-400 z-10' : ''
                  }`}
                  style={{
                    left: `${(layer.bounds.left / processedPSD.width) * 100}%`,
                    top: `${(layer.bounds.top / processedPSD.height) * 100}%`,
                    width: `${((layer.bounds.right - layer.bounds.left) / processedPSD.width) * 100}%`,
                    height: `${((layer.bounds.bottom - layer.bounds.top) / processedPSD.height) * 100}%`,
                    backgroundColor: isSelected 
                      ? `rgba(59, 130, 246, 0.7)` 
                      : `rgb(${brightness}, ${brightness}, ${brightness})`,
                    minWidth: '20px',
                    minHeight: '20px',
                    border: groupColor ? `2px solid ${groupColor}` : '1px solid rgba(255,255,255,0.1)'
                  }}
                  onClick={() => handleLayerSelect(layer)}
                  title={`${layer.name} - Depth: ${Math.round(depth * 100)}%`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : brightness > 128 ? 'text-black' : 'text-white'
                      }`}
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {Math.round(depth * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Brightness represents depth: White = Front (100%), Black = Back (0%)
            {processedPSD.layers.length > 30 && (
              <span className="block text-yellow-400">
                Showing first 30 layers for performance
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center gap-4 bg-[#0a0f1b] rounded-lg p-4 border border-slate-800">
        <h2 className="text-white font-semibold">PSD Analysis & Preview</h2>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant={showDepthMap ? "default" : "outline"}
          size="sm"
          onClick={() => setShowDepthMap(!showDepthMap)}
          className={showDepthMap ? "bg-crd-green text-black" : "border-white/20 text-white hover:bg-white/10"}
        >
          <MapIcon className="w-4 h-4 mr-2" />
          Show Depth Map
        </Button>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Badge variant="outline" className="text-slate-300">
            {processedPSD.layers.length} layers
          </Badge>
          <Badge variant="outline" className="text-slate-300">
            {layerGroups.length} groups
          </Badge>
          <Badge variant="outline" className="text-slate-300">
            {processedPSD.width}×{processedPSD.height}
          </Badge>
        </div>
      </div>

      {/* Keyboard Navigation Help */}
      <div className="bg-[#0a0f1b] rounded-lg p-3 border border-slate-800">
        <div className="text-xs text-slate-400">
          <strong className="text-slate-300">Keyboard:</strong> ↑↓ Navigate • Enter Toggle Visibility • Delete Hide Layer
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Layers and Tools */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="layers" className="data-[state=active]:bg-slate-700">
                <Layers3 className="w-4 h-4 mr-2" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="groups" className="data-[state=active]:bg-slate-700">
                <Palette className="w-4 h-4 mr-2" />
                Groups
              </TabsTrigger>
              <TabsTrigger value="builder" className="data-[state=active]:bg-slate-700">
                <Settings className="w-4 h-4 mr-2" />
                Builder
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="layers" className="mt-4">
              <PSDLayerInspector
                processedLayers={processedPSD.layers}
                layerGroups={layerGroups}
                onLayerSelect={handleLayerSelect}
                selectedLayerId={selectedLayerId}
                layerVisibility={layerVisibility}
                onToggleVisibility={toggleLayerVisibility}
              />
            </TabsContent>
            
            <TabsContent value="groups" className="mt-4">
              <Card className="bg-[#0a0f1b] border-slate-800">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Layer Groups</h3>
                  <div className="space-y-3">
                    {layerGroups.map((group) => (
                      <div 
                        key={group.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        <div 
                          className="w-4 h-4 rounded border-2 border-white/20"
                          style={{ backgroundColor: group.color }}
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">{group.name}</div>
                          <div className="text-slate-400 text-sm">
                            {group.layers.length} layers • Avg depth: {Math.round(group.averageDepth * 100)}%
                          </div>
                        </div>
                        <Badge variant="outline" className="text-slate-300">
                          {group.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="builder" className="mt-4">
              <CRDFrameBuilder
                processedLayers={processedPSD.layers}
                layerGroups={layerGroups}
                psdDimensions={{ width: processedPSD.width, height: processedPSD.height }}
                onFrameCreated={handleFrameCreated}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Canvas Preview */}
        <PSDCanvasPreview
          processedPSD={processedPSD}
          selectedLayerId={selectedLayerId}
          layerVisibility={layerVisibility}
          layerGroups={layerGroups}
          onLayerClick={handleCanvasLayerClick}
        />
      </div>

      {/* Depth Visualization - Full Width */}
      {showDepthMap && renderDepthVisualization()}
    </div>
  );
};
