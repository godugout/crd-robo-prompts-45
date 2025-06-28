
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { Layers, TrendingUp, Zap, Target, Building, BarChart3 } from 'lucide-react';

interface LayerArchitectureViewProps {
  processedPSD: ProcessedPSD;
}

export const LayerArchitectureView: React.FC<LayerArchitectureViewProps> = ({
  processedPSD
}) => {
  // Analyze layer architecture
  const layerTypes = processedPSD.layers.reduce((acc, layer) => {
    acc[layer.type] = (acc[layer.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const semanticTypes = processedPSD.layers.reduce((acc, layer) => {
    if (layer.semanticType) {
      acc[layer.semanticType] = (acc[layer.semanticType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const depthDistribution = processedPSD.layers
    .filter(layer => layer.inferredDepth !== undefined)
    .map(layer => layer.inferredDepth!);

  const avgDepth = depthDistribution.length > 0 
    ? depthDistribution.reduce((a, b) => a + b, 0) / depthDistribution.length 
    : 0;

  const complexityScore = Math.min(100, (processedPSD.totalLayers * 2) + 
    (Object.keys(semanticTypes).length * 5) + 
    (Object.keys(layerTypes).length * 3));

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'text': 'bg-blue-500',
      'image': 'bg-green-500',
      'shape': 'bg-purple-500',
      'group': 'bg-orange-500',
      'adjustment': 'bg-red-500',
      'effect': 'bg-yellow-500'
    };
    return colors[type] || 'bg-slate-500';
  };

  const getSemanticColor = (type: string) => {
    const colors: Record<string, string> = {
      'player': 'bg-emerald-500',
      'background': 'bg-indigo-500',
      'stats': 'bg-cyan-500',
      'logo': 'bg-pink-500',
      'border': 'bg-amber-500'
    };
    return colors[type] || 'bg-slate-500';
  };

  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-crd-green" />
              <span className="text-sm text-slate-300">Total Layers</span>
            </div>
            <p className="text-2xl font-bold text-white">{processedPSD.totalLayers}</p>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">Avg Depth</span>
            </div>
            <p className="text-2xl font-bold text-white">{avgDepth.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-300">Complexity</span>
            </div>
            <p className="text-2xl font-bold text-white">{complexityScore}</p>
            <Progress value={complexityScore} className="mt-2" />
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-300">Layer Types</span>
            </div>
            <p className="text-2xl font-bold text-white">{Object.keys(layerTypes).length}</p>
          </div>
        </Card>
      </div>

      {/* Layer Type Distribution */}
      <Card className="bg-slate-800 border-slate-600">
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-crd-green" />
            Layer Type Distribution
          </h4>
          <div className="space-y-3">
            {Object.entries(layerTypes)
              .sort(([,a], [,b]) => b - a)
              .map(([type, count]) => {
                const percentage = (count / processedPSD.totalLayers) * 100;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${getTypeColor(type)}`} />
                        <span className="text-white capitalize">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm">{count} layers</span>
                        <Badge variant="outline" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
          </div>
        </div>
      </Card>

      {/* Semantic Type Analysis */}
      {Object.keys(semanticTypes).length > 0 && (
        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-crd-green" />
              Semantic Analysis
            </h4>
            <div className="space-y-3">
              {Object.entries(semanticTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => {
                  const percentage = (count / processedPSD.totalLayers) * 100;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${getSemanticColor(type)}`} />
                          <span className="text-white capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 text-sm">{count} layers</span>
                          <Badge variant="outline" className="text-xs">
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      )}

      {/* Layer Hierarchy Tree */}
      <Card className="bg-slate-800 border-slate-600">
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-crd-green" />
            Layer Hierarchy
          </h4>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {processedPSD.layers.map((layer, index) => (
              <div key={layer.id} className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded">
                <span className="text-slate-400 text-xs font-mono w-8">{index + 1}</span>
                <div className={`w-2 h-2 rounded ${getTypeColor(layer.type)}`} />
                <span className="text-white text-sm flex-1">{layer.name}</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {layer.type}
                  </Badge>
                  {layer.semanticType && (
                    <Badge variant="outline" className={`text-xs ${getSemanticColor(layer.semanticType)} text-white`}>
                      {layer.semanticType}
                    </Badge>
                  )}
                  {layer.inferredDepth && (
                    <Badge variant="outline" className="text-xs">
                      Z: {layer.inferredDepth.toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
