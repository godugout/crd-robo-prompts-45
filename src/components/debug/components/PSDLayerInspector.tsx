
import React, { useState, useMemo } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { enhancedLayerAnalysisService, LayerAnalysisData, LayerPreviewData } from '@/services/psdProcessor/enhancedLayerAnalysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Search, 
  Grid3X3, 
  List, 
  Download,
  Layers,
  Zap,
  Palette,
  Box,
  Filter
} from 'lucide-react';

interface PSDLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  layerGroups: LayerGroup[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  layers,
  layerGroups,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState('overview');

  // Generate enhanced analysis data
  const analysisData = useMemo(() => {
    return layers.map(layer => enhancedLayerAnalysisService.analyzeLayer(layer));
  }, [layers]);

  const previewData = useMemo(() => {
    return layers.map(layer => enhancedLayerAnalysisService.generateLayerPreview(layer));
  }, [layers]);

  const filteredLayers = useMemo(() => {
    if (!searchQuery) return layers;
    return layers.filter(layer => 
      layer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [layers, searchQuery]);

  const LayerPreviewItem = ({ layer, analysis, preview }: { 
    layer: ProcessedPSDLayer; 
    analysis: LayerAnalysisData; 
    preview: LayerPreviewData; 
  }) => (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        selectedLayerId === layer.id 
          ? 'border-crd-green bg-crd-green/10' 
          : 'border-slate-700 hover:border-slate-600'
      }`}
      onClick={() => onLayerSelect(layer.id)}
    >
      <div className="flex items-center gap-3">
        {/* Layer Preview Thumbnail */}
        <div className="w-12 h-12 bg-slate-800 rounded border overflow-hidden flex-shrink-0">
          {preview.thumbnailUrl ? (
            <img 
              src={preview.thumbnailUrl} 
              alt={layer.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Layers className="w-4 h-4 text-slate-500" />
            </div>
          )}
        </div>

        {/* Layer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-white truncate">{layer.name}</h4>
            <Badge variant="outline" className="text-xs">
              {analysis.confidence.toFixed(2)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Badge variant="secondary" className="text-xs">
              {analysis.semanticType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {analysis.positionCategory}
            </Badge>
            {analysis.materialHints.length > 0 && (
              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400">
                {analysis.materialHints[0]}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLayerToggle(layer.id);
            }}
            className="p-1 h-6 w-6"
          >
            {hiddenLayers.has(layer.id) ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-crd-green" />
              <span className="text-sm text-slate-400">Total Layers</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{layers.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-400">High Confidence</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {analysisData.filter(a => a.confidence > 0.7).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Layer List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Layer Analysis</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>

        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
          {filteredLayers.map((layer, index) => {
            const analysis = analysisData.find(a => a.id === layer.id);
            const preview = previewData.find(p => p.layerId === layer.id);
            
            if (!analysis || !preview) return null;
            
            return (
              <LayerPreviewItem
                key={layer.id}
                layer={layer}
                analysis={analysis}
                preview={preview}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  const DetailedAnalysisTab = () => (
    <div className="space-y-6">
      {/* Confidence Analysis Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Confidence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisData
              .sort((a, b) => b.confidence - a.confidence)
              .map(analysis => {
                const layer = layers.find(l => l.id === analysis.id);
                if (!layer) return null;
                
                return (
                  <div key={analysis.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded overflow-hidden">
                        {previewData.find(p => p.layerId === analysis.id)?.thumbnailUrl && (
                          <img 
                            src={previewData.find(p => p.layerId === analysis.id)?.thumbnailUrl} 
                            alt={layer.name}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{layer.name}</p>
                        <p className="text-xs text-slate-400">{analysis.analysisReason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-full bg-crd-green rounded-full" 
                          style={{ width: `${analysis.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-white">{(analysis.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Semantic Type Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-crd-green" />
            Semantic Type Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              analysisData.reduce((acc, analysis) => {
                if (!acc[analysis.semanticType]) acc[analysis.semanticType] = [];
                acc[analysis.semanticType].push(analysis);
                return acc;
              }, {} as Record<string, LayerAnalysisData[]>)
            ).map(([type, typeAnalysis]) => (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-sm">
                    {type} ({typeAnalysis.length})
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-2 ml-4">
                  {typeAnalysis.map(analysis => {
                    const layer = layers.find(l => l.id === analysis.id);
                    if (!layer) return null;
                    
                    return (
                      <div key={analysis.id} className="flex items-center gap-2 p-2 bg-slate-900/30 rounded">
                        <div className="w-6 h-6 bg-slate-700 rounded overflow-hidden">
                          {previewData.find(p => p.layerId === analysis.id)?.thumbnailUrl && (
                            <img 
                              src={previewData.find(p => p.layerId === analysis.id)?.thumbnailUrl} 
                              alt={layer.name}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <span className="text-white text-sm">{layer.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {analysis.frameElementPotential}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const FrameBuilderTab = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-orange-400" />
            Frame Element Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['high', 'medium', 'low'].map(potential => {
              const potentialLayers = analysisData.filter(a => a.frameElementPotential === potential);
              if (potentialLayers.length === 0) return null;
              
              return (
                <div key={potential}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant={potential === 'high' ? 'default' : 'outline'}
                      className={`text-sm ${
                        potential === 'high' ? 'bg-green-500' : 
                        potential === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                    >
                      {potential.toUpperCase()} Potential ({potentialLayers.length})
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 ml-4">
                    {potentialLayers.map(analysis => {
                      const layer = layers.find(l => l.id === analysis.id);
                      const preview = previewData.find(p => p.layerId === analysis.id);
                      if (!layer || !preview) return null;
                      
                      return (
                        <div key={analysis.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-700 rounded overflow-hidden">
                              {preview.thumbnailUrl && (
                                <img 
                                  src={preview.thumbnailUrl} 
                                  alt={layer.name}
                                  className="w-full h-full object-contain"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{layer.name}</p>
                              <p className="text-xs text-slate-400">
                                Suggested role: {analysis.suggestedFrameRole}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              3D: {(analysis.threeDReadiness * 100).toFixed(0)}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {analysis.extractionQuality}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Card className="bg-[#0a0f1b] border-slate-800 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-crd-green" />
            Layer Inspector
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="px-4 pb-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs">Analysis</TabsTrigger>
              <TabsTrigger value="frames" className="text-xs">Frame Builder</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="px-4 max-h-[600px] overflow-y-auto">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0">
              <DetailedAnalysisTab />
            </TabsContent>
            
            <TabsContent value="frames" className="mt-0">
              <FrameBuilderTab />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
