
import React, { useState, useMemo } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { enhancedLayerAnalysisService, LayerAnalysisData } from '@/services/psdProcessor/enhancedLayerAnalysisService';
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
  Grid2x2, 
  Layers,
  Download,
  Filter,
  Star,
  Zap,
  Target,
  Palette
} from 'lucide-react';

interface EnhancedPSDLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  layerGroups: LayerGroup[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
}

export const EnhancedPSDLayerInspector: React.FC<EnhancedPSDLayerInspectorProps> = ({
  layers,
  layerGroups,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Analyze all layers
  const layersWithAnalysis = useMemo(() => {
    return layers.map(layer => ({
      layer,
      analysis: enhancedLayerAnalysisService.analyzeLayer(layer),
      preview: enhancedLayerAnalysisService.generateLayerPreview(layer)
    }));
  }, [layers]);

  // Filter layers based on search and type
  const filteredLayers = useMemo(() => {
    return layersWithAnalysis.filter(({ layer, analysis }) => {
      const matchesSearch = layer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || analysis.semanticType === filterType;
      return matchesSearch && matchesType;
    });
  }, [layersWithAnalysis, searchTerm, filterType]);

  // Get unique semantic types for filter
  const semanticTypes = useMemo(() => {
    const types = new Set(layersWithAnalysis.map(({ analysis }) => analysis.semanticType));
    return Array.from(types);
  }, [layersWithAnalysis]);

  // Analysis statistics
  const analysisStats = useMemo(() => {
    const totalLayers = layersWithAnalysis.length;
    const highConfidence = layersWithAnalysis.filter(({ analysis }) => analysis.confidence > 0.7).length;
    const frameElements = layersWithAnalysis.filter(({ analysis }) => analysis.frameElementPotential === 'high').length;
    const threeDReady = layersWithAnalysis.filter(({ analysis }) => analysis.threeDReadiness > 0.7).length;

    return {
      totalLayers,
      highConfidence,
      frameElements,
      threeDReady,
      avgConfidence: layersWithAnalysis.reduce((acc, { analysis }) => acc + analysis.confidence, 0) / totalLayers
    };
  }, [layersWithAnalysis]);

  const LayerThumbnail: React.FC<{ layer: ProcessedPSDLayer; analysis: LayerAnalysisData }> = ({ layer, analysis }) => (
    <div 
      className={`relative w-12 h-12 bg-slate-800 rounded border-2 cursor-pointer transition-all ${
        selectedLayerId === layer.id ? 'border-crd-green' : 'border-slate-600'
      }`}
      onClick={() => onLayerSelect(layer.id)}
    >
      {layer.imageData ? (
        <img 
          src={layer.imageData} 
          alt={layer.name}
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
          {layer.type}
        </div>
      )}
      <div className="absolute -top-1 -right-1">
        <Badge 
          variant={analysis.confidence > 0.7 ? "default" : "outline"} 
          className="text-xs px-1"
        >
          {Math.round(analysis.confidence * 100)}%
        </Badge>
      </div>
    </div>
  );

  const ConfidenceIndicator: React.FC<{ confidence: number }> = ({ confidence }) => (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-slate-700 rounded-full h-2">
        <div 
          className={`h-full rounded-full ${
            confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      <span className="text-xs text-slate-300 w-8">{Math.round(confidence * 100)}%</span>
    </div>
  );

  return (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-crd-green" />
            Enhanced Layer Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search layers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
          >
            <option value="all">All Types</option>
            {semanticTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{analysisStats.totalLayers}</div>
            <div className="text-xs text-slate-400">Total Layers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{analysisStats.highConfidence}</div>
            <div className="text-xs text-slate-400">High Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{analysisStats.frameElements}</div>
            <div className="text-xs text-slate-400">Frame Elements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{analysisStats.threeDReady}</div>
            <div className="text-xs text-slate-400">3D Ready</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="visual">Visual Grid</TabsTrigger>
            <TabsTrigger value="frame-builder">Frame Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredLayers.map(({ layer, analysis, preview }) => (
                <div
                  key={layer.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedLayerId === layer.id 
                      ? 'bg-crd-green/10 border border-crd-green/30' 
                      : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50'
                  }`}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <LayerThumbnail layer={layer} analysis={analysis} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium truncate">{layer.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {analysis.semanticType}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{layer.type}</span>
                      <span>{analysis.positionCategory}</span>
                      <ConfidenceIndicator confidence={analysis.confidence} />
                    </div>
                    
                    {analysis.materialHints.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {analysis.materialHints.map(hint => (
                          <Badge key={hint} variant="secondary" className="text-xs">
                            {hint}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggle(layer.id);
                      }}
                    >
                      {hiddenLayers.has(layer.id) ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-2 text-slate-300">Layer</th>
                    <th className="text-left p-2 text-slate-300">Type</th>
                    <th className="text-left p-2 text-slate-300">Position</th>
                    <th className="text-left p-2 text-slate-300">Confidence</th>
                    <th className="text-left p-2 text-slate-300">3D Ready</th>
                    <th className="text-left p-2 text-slate-300">Frame Potential</th>
                    <th className="text-left p-2 text-slate-300">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLayers.map(({ layer, analysis }) => (
                    <tr 
                      key={layer.id}
                      className={`border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer ${
                        selectedLayerId === layer.id ? 'bg-crd-green/10' : ''
                      }`}
                      onClick={() => onLayerSelect(layer.id)}
                    >
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <LayerThumbnail layer={layer} analysis={analysis} />
                          <div>
                            <div className="text-white font-medium">{layer.name}</div>
                            <div className="text-xs text-slate-400">{layer.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{analysis.semanticType}</Badge>
                      </td>
                      <td className="p-2 text-slate-300">{analysis.positionCategory}</td>
                      <td className="p-2">
                        <ConfidenceIndicator confidence={analysis.confidence} />
                      </td>
                      <td className="p-2">
                        <ConfidenceIndicator confidence={analysis.threeDReadiness} />
                      </td>
                      <td className="p-2">
                        <Badge 
                          variant={analysis.frameElementPotential === 'high' ? 'default' : 'outline'}
                        >
                          {analysis.frameElementPotential}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge 
                          variant={analysis.extractionQuality === 'excellent' ? 'default' : 'outline'}
                        >
                          {analysis.extractionQuality}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4">
            <div className="grid grid-cols-6 gap-4">
              {filteredLayers.map(({ layer, analysis }) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedLayerId === layer.id 
                      ? 'border-crd-green bg-crd-green/10' 
                      : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <div className="relative">
                    <LayerThumbnail layer={layer} analysis={analysis} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -left-1 p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggle(layer.id);
                      }}
                    >
                      {hiddenLayers.has(layer.id) ? (
                        <EyeOff className="w-3 h-3 text-slate-400" />
                      ) : (
                        <Eye className="w-3 h-3 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-xs text-white font-medium truncate">{layer.name}</div>
                    <div className="text-xs text-slate-400">{analysis.semanticType}</div>
                    <div className="mt-1">
                      <ConfidenceIndicator confidence={analysis.confidence} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="frame-builder" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* High Frame Potential Elements */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    High Frame Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {filteredLayers
                      .filter(({ analysis }) => analysis.frameElementPotential === 'high')
                      .map(({ layer, analysis }) => (
                        <div
                          key={layer.id}
                          className="p-2 rounded border border-slate-600 cursor-pointer hover:border-crd-green/50"
                          onClick={() => onLayerSelect(layer.id)}
                        >
                          <LayerThumbnail layer={layer} analysis={analysis} />
                          <div className="mt-1 text-xs text-white truncate">{layer.name}</div>
                          <div className="text-xs text-slate-400">{analysis.suggestedFrameRole}</div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>

              {/* 3D Ready Elements */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    3D Ready Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {filteredLayers
                      .filter(({ analysis }) => analysis.threeDReadiness > 0.7)
                      .map(({ layer, analysis }) => (
                        <div
                          key={layer.id}
                          className="p-2 rounded border border-slate-600 cursor-pointer hover:border-blue-500/50"
                          onClick={() => onLayerSelect(layer.id)}
                        >
                          <LayerThumbnail layer={layer} analysis={analysis} />
                          <div className="mt-1 text-xs text-white truncate">{layer.name}</div>
                          <div className="text-xs text-blue-400">
                            {Math.round(analysis.threeDReadiness * 100)}% Ready
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
