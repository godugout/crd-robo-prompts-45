
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Layers, 
  Info, 
  Eye, 
  EyeOff, 
  Palette,
  Sparkles,
  Gem,
  Zap
} from 'lucide-react';
import { PSDFileProcessor } from './components/PSDFileProcessor';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';

export const PSDPreviewInterface: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<ProcessedPSD | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set());

  const handlePSDProcessed = (psd: ProcessedPSD) => {
    setProcessedPSD(psd);
    setSelectedLayers(new Set());
  };

  const toggleLayerSelection = (layerId: string) => {
    const newSelection = new Set(selectedLayers);
    if (newSelection.has(layerId)) {
      newSelection.delete(layerId);
    } else {
      newSelection.add(layerId);
    }
    setSelectedLayers(newSelection);
  };

  const getSemanticTypeColor = (type: ProcessedPSDLayer['semanticType']) => {
    const colors: Record<string, string> = {
      background: 'bg-slate-500',
      player: 'bg-blue-500',
      stats: 'bg-green-500',
      logo: 'bg-purple-500',
      effect: 'bg-yellow-500',
      border: 'bg-orange-500',
      text: 'bg-pink-500',
      image: 'bg-gray-500'
    };
    return colors[type || 'image'] || 'bg-gray-500';
  };

  const renderLayerItem = (layer: ProcessedPSDLayer) => {
    const isSelected = selectedLayers.has(layer.id);
    
    return (
      <div
        key={layer.id}
        className={`p-3 rounded-lg border cursor-pointer transition-all ${
          isSelected 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-gray-700 hover:border-gray-600'
        }`}
        onClick={() => toggleLayerSelection(layer.id)}
      >
        <div className="flex items-center gap-3">
          {/* Layer thumbnail */}
          {layer.imageData && (
            <div className="w-10 h-10 rounded border border-gray-600 overflow-hidden flex-shrink-0">
              <img 
                src={layer.imageData} 
                alt={layer.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Layer info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium truncate">{layer.name}</span>
              {layer.visible ? (
                <Eye className="w-4 h-4 text-green-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-500" />
              )}
            </div>
            
            {/* Semantic type and depth */}
            <div className="flex items-center gap-2 mb-2">
              {layer.semanticType && (
                <Badge className={`text-xs ${getSemanticTypeColor(layer.semanticType)} text-white`}>
                  {layer.semanticType}
                </Badge>
              )}
              {layer.inferredDepth !== undefined && (
                <span className="text-xs text-gray-400">
                  Depth: {Math.round(layer.inferredDepth * 100)}%
                </span>
              )}
            </div>
            
            {/* Material hints */}
            {layer.materialHints && (
              <div className="flex gap-1">
                {layer.materialHints.isMetallic && (
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Metallic
                  </Badge>
                )}
                {layer.materialHints.isHolographic && (
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    <Gem className="w-3 h-3 mr-1" />
                    Holo
                  </Badge>
                )}
                {layer.materialHints.hasGlow && (
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    <Zap className="w-3 h-3 mr-1" />
                    Glow
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            PSD Preview & Analysis
          </h1>
          <p className="text-gray-400">
            Upload and analyze PSD files for 3D card creation. Extract layers with semantic intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Upload */}
          <div className="lg:col-span-1">
            <PSDFileProcessor onPSDProcessed={handlePSDProcessed} />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            {processedPSD ? (
              <Card className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    PSD Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                      <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="layers" className="text-gray-300 data-[state=active]:text-white">
                        Layers ({processedPSD.layers.length})
                      </TabsTrigger>
                      <TabsTrigger value="analysis" className="text-gray-300 data-[state=active]:text-white">
                        Analysis
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-white">
                            {processedPSD.width} × {processedPSD.height}
                          </div>
                          <div className="text-gray-400 text-sm">Dimensions</div>
                        </div>
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-white">
                            {processedPSD.totalLayers}
                          </div>
                          <div className="text-gray-400 text-sm">Total Layers</div>
                        </div>
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-white">
                            {processedPSD.colorMode}
                          </div>
                          <div className="text-gray-400 text-sm">Color Mode</div>
                        </div>
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-white">
                            {processedPSD.bitsPerChannel}-bit
                          </div>
                          <div className="text-gray-400 text-sm">Color Depth</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="layers" className="space-y-3">
                      <div className="space-y-2">
                        {processedPSD.layers.map(renderLayerItem)}
                      </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                      {/* Semantic Analysis Results */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Palette className="w-5 h-5" />
                          Semantic Analysis
                        </h3>
                        
                        {/* Layer Type Distribution */}
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <h4 className="text-white font-medium mb-3">Layer Types</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(
                              processedPSD.layers.reduce((acc, layer) => {
                                const type = layer.semanticType || 'unknown';
                                acc[type] = (acc[type] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>)
                            ).map(([type, count]) => (
                              <div key={type} className="flex justify-between items-center">
                                <Badge className={`${getSemanticTypeColor(type as any)} text-white text-xs`}>
                                  {type}
                                </Badge>
                                <span className="text-gray-300 text-sm">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Material Hints Summary */}
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                          <h4 className="text-white font-medium mb-3">Material Effects</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Metallic Layers
                              </span>
                              <span className="text-white">
                                {processedPSD.layers.filter(l => l.materialHints?.isMetallic).length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Gem className="w-4 h-4" />
                                Holographic Layers
                              </span>
                              <span className="text-white">
                                {processedPSD.layers.filter(l => l.materialHints?.isHolographic).length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Glow Layers
                              </span>
                              <span className="text-white">
                                {processedPSD.layers.filter(l => l.materialHints?.hasGlow).length}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 3D Readiness */}
                        <div className="p-4 bg-crd-green/10 border border-crd-green/20 rounded-lg">
                          <h4 className="text-crd-green font-medium mb-2">3D Reconstruction Ready</h4>
                          <div className="text-2xl font-bold text-white">
                            {processedPSD.layers.filter(l => 
                              l.semanticType && 
                              l.inferredDepth !== undefined && 
                              l.imageData
                            ).length} / {processedPSD.layers.length}
                          </div>
                          <p className="text-gray-300 text-sm mt-1">
                            Layers ready for 3D conversion with depth and material data
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-700 bg-gray-800/50">
                <CardContent className="p-12 text-center">
                  <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No PSD Loaded
                  </h3>
                  <p className="text-gray-500">
                    Upload a PSD file to see the layer analysis and preview
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
