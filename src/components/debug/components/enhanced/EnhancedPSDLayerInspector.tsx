
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, EyeOff, Image, Layers, Grid, Wrench, Info, Star, Target } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');

  const getSemanticTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      background: 'bg-blue-500/20 text-blue-400',
      player: 'bg-green-500/20 text-green-400',
      stats: 'bg-yellow-500/20 text-yellow-400',
      logo: 'bg-purple-500/20 text-purple-400',
      border: 'bg-red-500/20 text-red-400',
      text: 'bg-cyan-500/20 text-cyan-400',
      image: 'bg-gray-500/20 text-gray-400',
      effect: 'bg-pink-500/20 text-pink-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const getPositionColor = (position: string) => {
    const colors: { [key: string]: string } = {
      header: 'bg-indigo-500/20 text-indigo-400',
      center: 'bg-emerald-500/20 text-emerald-400',
      footer: 'bg-orange-500/20 text-orange-400',
      overlay: 'bg-violet-500/20 text-violet-400',
      edge: 'bg-rose-500/20 text-rose-400'
    };
    return colors[position] || 'bg-gray-500/20 text-gray-400';
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0a0f1b] border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-crd-green" />
              <span className="text-slate-400 text-sm">Total Layers</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{layers.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1b] border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Layer Groups</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{layerGroups.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1b] border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Visible Layers</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {layers.filter(layer => !hiddenLayers.has(layer.id)).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Layer List */}
      <Card className="bg-[#0a0f1b] border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Layer Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-700/50 ${
                  selectedLayerId === layer.id ? 'bg-slate-600/50' : ''
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center gap-3">
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
                  
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-medium">{layer.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSemanticTypeColor(layer.semanticType || 'unknown')}>
                    {layer.semanticType || 'unknown'}
                  </Badge>
                  <Badge variant="outline" className={getPositionColor(layer.positionCategory || 'unknown')}>
                    {layer.positionCategory || 'unknown'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetailedAnalysisTab = () => (
    <Card className="bg-[#0a0f1b] border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Info className="w-5 h-5" />
          Detailed Layer Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-400">Layer</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Position</TableHead>
                <TableHead className="text-slate-400">Confidence</TableHead>
                <TableHead className="text-slate-400">3D Readiness</TableHead>
                <TableHead className="text-slate-400">Materials</TableHead>
                <TableHead className="text-slate-400">Quality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {layers.map((layer) => (
                <TableRow
                  key={layer.id}
                  className={`border-slate-800 cursor-pointer hover:bg-slate-700/50 ${
                    selectedLayerId === layer.id ? 'bg-slate-600/50' : ''
                  }`}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <TableCell className="text-white font-medium">{layer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSemanticTypeColor(layer.semanticType || 'unknown')}>
                      {layer.semanticType || 'unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPositionColor(layer.positionCategory || 'unknown')}>
                      {layer.positionCategory || 'unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {layer.analysisData ? `${(layer.analysisData.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {layer.analysisData ? `${(layer.analysisData.threeDReadiness * 100).toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {layer.materialHints?.isMetallic && (
                        <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400">
                          Metallic
                        </Badge>
                      )}
                      {layer.materialHints?.isHolographic && (
                        <Badge variant="outline" className="text-xs bg-rainbow-500/20 text-purple-400">
                          Holo
                        </Badge>
                      )}
                      {layer.materialHints?.hasGlow && (
                        <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-400">
                          Glow
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      layer.analysisData?.extractionQuality === 'excellent' ? 'bg-green-500/20 text-green-400' :
                      layer.analysisData?.extractionQuality === 'good' ? 'bg-blue-500/20 text-blue-400' :
                      layer.analysisData?.extractionQuality === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }>
                      {layer.analysisData?.extractionQuality || 'unknown'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderVisualGridTab = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {layers.map((layer) => (
        <Card
          key={layer.id}
          className={`bg-[#0a0f1b] border-slate-800 cursor-pointer hover:border-crd-green/50 transition-colors ${
            selectedLayerId === layer.id ? 'border-crd-green' : ''
          }`}
          onClick={() => onLayerSelect(layer.id)}
        >
          <CardContent className="p-4">
            <div className="aspect-square bg-slate-800/50 rounded-lg mb-3 flex items-center justify-center">
              {layer.imageData ? (
                <img
                  src={layer.imageData}
                  alt={layer.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Image className="w-8 h-8 text-slate-500" />
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-medium text-sm truncate">{layer.name}</h4>
              
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className={`text-xs ${getSemanticTypeColor(layer.semanticType || 'unknown')}`}>
                  {layer.semanticType || 'unknown'}
                </Badge>
              </div>
              
              {layer.analysisData && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Star className="w-3 h-3" />
                  <span>{(layer.analysisData.confidence * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFrameBuilderTab = () => (
    <div className="space-y-6">
      <Card className="bg-[#0a0f1b] border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Frame Element Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {layers
              .filter(layer => layer.analysisData?.frameElementPotential !== 'low')
              .map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                      <Target className="w-4 h-4 text-crd-green" />
                    </div>
                    <div>
                      <h5 className="text-white font-medium">{layer.name}</h5>
                      <p className="text-slate-400 text-sm">
                        {layer.analysisData?.suggestedFrameRole || 'Unknown role'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      layer.analysisData?.frameElementPotential === 'high' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }>
                      {layer.analysisData?.frameElementPotential || 'unknown'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
                    >
                      Add to Frame
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="detailed" className="text-slate-300 data-[state=active]:text-white">
            Detailed Analysis
          </TabsTrigger>
          <TabsTrigger value="visual" className="text-slate-300 data-[state=active]:text-white">
            Visual Grid
          </TabsTrigger>
          <TabsTrigger value="frame-builder" className="text-slate-300 data-[state=active]:text-white">
            Frame Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="detailed" className="mt-6">
          {renderDetailedAnalysisTab()}
        </TabsContent>

        <TabsContent value="visual" className="mt-6">
          {renderVisualGridTab()}
        </TabsContent>

        <TabsContent value="frame-builder" className="mt-6">
          {renderFrameBuilderTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
