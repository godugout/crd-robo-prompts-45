
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  BarChart3, 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  FlipHorizontal
} from 'lucide-react';

interface UnifiedVisualAnalysisInterfaceProps {
  psdData: BulkPSDData[];
  onRemovePSD: (id: string) => void;
}

export const UnifiedVisualAnalysisInterface: React.FC<UnifiedVisualAnalysisInterfaceProps> = ({
  psdData,
  onRemovePSD
}) => {
  const [selectedPSDId, setSelectedPSDId] = useState<string | null>(
    psdData.length > 0 ? psdData[0].id : null
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [analysisMode, setAnalysisMode] = useState<'hierarchy' | 'semantic' | 'spatial'>('hierarchy');

  const selectedPSD = psdData.find(psd => psd.id === selectedPSDId);
  const selectedLayer = selectedPSD?.enhancedProcessedPSD.layers.find(layer => layer.id === selectedLayerId);

  const handlePSDSelect = (psdId: string) => {
    setSelectedPSDId(psdId);
    setSelectedLayerId(null);
    setHiddenLayers(new Set());
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  const handleLayerToggle = (layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const layerAnalysis = useMemo(() => {
    if (!selectedPSD) return { hierarchy: [], semantic: [], spatial: [] };

    const layers = selectedPSD.enhancedProcessedPSD.layers;

    return {
      hierarchy: [...layers].sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0)),
      semantic: [...layers].sort((a, b) => {
        const aType = a.semanticType || 'unknown';
        const bType = b.semanticType || 'unknown';
        return aType.localeCompare(bType);
      }),
      spatial: [...layers].sort((a, b) => {
        const aArea = (a.bounds.right - a.bounds.left) * (a.bounds.bottom - a.bounds.top);
        const bArea = (b.bounds.right - b.bounds.left) * (b.bounds.bottom - b.bounds.top);
        return bArea - aArea;
      })
    };
  }, [selectedPSD]);

  const visibleLayers = selectedPSD?.enhancedProcessedPSD.layers.filter(layer => !hiddenLayers.has(layer.id)) || [];

  return (
    <div className="h-screen bg-[#0a0a0b] flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">Unified Visual Analysis</h2>
            <Badge variant="secondary">{psdData.length} PSDs loaded</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-300 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PSD Selection Grid */}
        <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">PSD Files</h3>
            <p className="text-sm text-slate-400">Select a PSD to analyze</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {psdData.map((psd) => (
              <Card
                key={psd.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPSDId === psd.id 
                    ? 'border-crd-green bg-slate-800 ring-1 ring-crd-green/50' 
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
                onClick={() => handlePSDSelect(psd.id)}
              >
                <div className="p-3">
                  {/* Card Preview */}
                  <div className="aspect-square bg-slate-700 rounded-lg mb-3 overflow-hidden">
                    {psd.enhancedProcessedPSD.flattenedImageUrl ? (
                      <img
                        src={psd.enhancedProcessedPSD.flattenedImageUrl}
                        alt={psd.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers className="w-8 h-8 text-slate-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* PSD Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-white text-sm truncate">{psd.fileName}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{psd.enhancedProcessedPSD.width} × {psd.enhancedProcessedPSD.height}</span>
                      <Badge variant="outline" className="text-xs">
                        {psd.enhancedProcessedPSD.layers.length} layers
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Analysis Interface */}
        {selectedPSD ? (
          <div className="flex-1 flex">
            {/* Center: Interactive Card Preview */}
            <div className="flex-1 bg-slate-900 flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{selectedPSD.fileName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{visibleLayers.length}/{selectedPSD.enhancedProcessedPSD.layers.length} visible</Badge>
                    {selectedLayer && (
                      <Badge variant="outline" className="text-crd-green border-crd-green">
                        {selectedLayer.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Preview */}
              <div className="flex-1 flex items-center justify-center p-6">
                <div
                  className="relative bg-white rounded-lg shadow-2xl"
                  style={{
                    width: Math.min(400, window.innerWidth * 0.3),
                    height: Math.min(560, window.innerHeight * 0.7),
                    transform: `scale(${zoom})`,
                    aspectRatio: '3/4'
                  }}
                >
                  {/* Layer Stack */}
                  {visibleLayers.map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`absolute cursor-pointer transition-all duration-200 ${
                        selectedLayerId === layer.id ? 'ring-2 ring-crd-green' : 'hover:ring-1 hover:ring-slate-400'
                      }`}
                      style={{
                        left: `${((layer.bounds.left / selectedPSD.enhancedProcessedPSD.width) * 100)}%`,
                        top: `${((layer.bounds.top / selectedPSD.enhancedProcessedPSD.height) * 100)}%`,
                        width: `${(((layer.bounds.right - layer.bounds.left) / selectedPSD.enhancedProcessedPSD.width) * 100)}%`,
                        height: `${(((layer.bounds.bottom - layer.bounds.top) / selectedPSD.enhancedProcessedPSD.height) * 100)}%`,
                        zIndex: selectedPSD.enhancedProcessedPSD.layers.length - index,
                        opacity: layer.opacity || 1
                      }}
                      onClick={() => handleLayerSelect(layer.id)}
                    >
                      {layer.imageUrl && (
                        <img
                          src={layer.imageUrl}
                          alt={layer.name}
                          className="w-full h-full object-contain"
                        />
                      )}
                      
                      {/* Layer Hover Info */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="text-white text-xs text-center p-2">
                          <div className="font-medium">{layer.name}</div>
                          {layer.semanticType && (
                            <div className="text-crd-green mt-1">{layer.semanticType}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Analysis Panels */}
            <div className="w-96 bg-[#1a1f2e] border-l border-slate-700 flex flex-col">
              <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as any)} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-b border-slate-700 rounded-none">
                  <TabsTrigger value="hierarchy" className="text-xs">Hierarchy</TabsTrigger>
                  <TabsTrigger value="semantic" className="text-xs">Semantic</TabsTrigger>
                  <TabsTrigger value="spatial" className="text-xs">Spatial</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="hierarchy" className="h-full m-0 p-0">
                    <LayerAnalysisPanel
                      layers={layerAnalysis.hierarchy}
                      selectedLayerId={selectedLayerId}
                      hiddenLayers={hiddenLayers}
                      onLayerSelect={handleLayerSelect}
                      onLayerToggle={handleLayerToggle}
                      title="Visual Hierarchy"
                      description="Layers ordered by depth"
                    />
                  </TabsContent>

                  <TabsContent value="semantic" className="h-full m-0 p-0">
                    <LayerAnalysisPanel
                      layers={layerAnalysis.semantic}
                      selectedLayerId={selectedLayerId}
                      hiddenLayers={hiddenLayers}
                      onLayerSelect={handleLayerSelect}
                      onLayerToggle={handleLayerToggle}
                      title="Semantic Types"
                      description="Layers grouped by meaning"
                    />
                  </TabsContent>

                  <TabsContent value="spatial" className="h-full m-0 p-0">
                    <LayerAnalysisPanel
                      layers={layerAnalysis.spatial}
                      selectedLayerId={selectedLayerId}
                      hiddenLayers={hiddenLayers}
                      onLayerSelect={handleLayerSelect}
                      onLayerToggle={handleLayerToggle}
                      title="Spatial Analysis"
                      description="Layers ordered by size"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <Grid className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Select a PSD to Analyze</h3>
              <p className="text-slate-400">Choose a PSD from the left panel to begin visual analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface LayerAnalysisPanelProps {
  layers: any[];
  selectedLayerId: string | null;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
  title: string;
  description: string;
}

const LayerAnalysisPanel: React.FC<LayerAnalysisPanelProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle,
  title,
  description
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedLayerId === layer.id
                ? 'border-crd-green bg-crd-green/10'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500'
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm truncate">
                    {layer.name}
                  </span>
                  {layer.semanticType && (
                    <Badge
                      style={{
                        backgroundColor: getSemanticTypeColor(layer.semanticType),
                        color: 'black'
                      }}
                      className="text-xs"
                    >
                      {layer.semanticType}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-slate-400">
                  {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
                  {layer.opacity && layer.opacity < 1 && (
                    <span className="ml-2">
                      {Math.round(layer.opacity * 100)}% opacity
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerToggle(layer.id);
                }}
                className="w-8 h-8 p-0 flex-shrink-0"
              >
                {hiddenLayers.has(layer.id) ? (
                  <EyeOff className="w-4 h-4 text-slate-500" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-300" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
