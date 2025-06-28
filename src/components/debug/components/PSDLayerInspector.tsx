
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';
import { calculateLayerVolume } from '@/utils/layerUtils';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mountain, 
  BarChart, 
  Zap, 
  Square,
  Layers,
  ChevronDown,
  ChevronRight,
  Shield,
  Sparkles,
  Type,
  Image
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
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getLayerIcon = (layer: ProcessedPSDLayer) => {
    // First check semantic type for more meaningful icons
    if (layer.semanticType === 'player') return User;
    if (layer.semanticType === 'background') return Mountain;
    if (layer.semanticType === 'stats') return BarChart;
    if (layer.semanticType === 'logo') return Shield;
    if (layer.semanticType === 'border') return Square;
    
    // Fall back to layer type icons
    if (layer.type === 'text') return Type;
    if (layer.type === 'image') return Image;
    if (layer.type === 'shape') return Square;
    if (layer.type === 'group') return Layers;
    
    // Default icon for other types
    return Sparkles;
  };

  const getSemanticColor = (semanticType?: string) => {
    if (!semanticType) return 'bg-slate-600 text-slate-300';
    
    const colors = {
      'player': 'bg-emerald-500 text-white',
      'background': 'bg-slate-500 text-white',
      'stats': 'bg-cyan-500 text-white',
      'logo': 'bg-pink-500 text-white',
      'border': 'bg-amber-500 text-black',
      'text': 'bg-blue-500 text-white',
      'effect': 'bg-purple-500 text-white'
    };
    
    return colors[semanticType as keyof typeof colors] || 'bg-slate-600 text-slate-300';
  };

  const getLayerTypeColor = (type: string) => {
    const colors = {
      'text': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'image': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'shape': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'group': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'adjustment': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    
    return colors[type as keyof typeof colors] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  const getGroupSemanticType = (group: LayerGroup): string => {
    // Determine group semantic type based on the most common semantic type in the group
    const semanticCounts: Record<string, number> = {};
    group.layers.forEach(layer => {
      const semantic = layer.semanticType || 'unknown';
      semanticCounts[semantic] = (semanticCounts[semantic] || 0) + 1;
    });
    
    // Return the most common semantic type
    const mostCommon = Object.entries(semanticCounts).reduce((a, b) => 
      semanticCounts[a[0]] > semanticCounts[b[0]] ? a : b
    );
    
    return mostCommon[0];
  };

  return (
    <Card className="bg-[#1a1f2e] border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-crd-green" />
          <h3 className="text-lg font-semibold text-white">Layer Inspector</h3>
          <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-600">
            {layers.length} layers
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {layerGroups.map((group) => {
          const groupSemanticType = getGroupSemanticType(group);
          
          return (
            <div key={group.id} className="space-y-2">
              {/* Group Header */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleGroup(group.id)}
                  className="p-1 h-6 w-6 text-slate-400 hover:text-white"
                >
                  {expandedGroups.has(group.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                <Badge className={`text-xs ${getSemanticColor(groupSemanticType)} font-medium`}>
                  {group.name} ({group.layers.length})
                </Badge>
              </div>

              {/* Group Layers */}
              {expandedGroups.has(group.id) && (
                <div className="ml-6 space-y-2">
                  {group.layers.map((layer) => {
                    const LayerIcon = getLayerIcon(layer);
                    const isSelected = selectedLayerId === layer.id;
                    const isHidden = hiddenLayers.has(layer.id);
                    const volume = calculateLayerVolume(layer);
                    
                    return (
                      <div
                        key={layer.id}
                        className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-crd-green/50 ${
                          isSelected 
                            ? 'border-crd-green bg-crd-green/10' 
                            : 'border-slate-600 bg-slate-800/50'
                        } ${isHidden ? 'opacity-50' : ''}`}
                        onClick={() => onLayerSelect(layer.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <LayerIcon className={`w-4 h-4 ${isSelected ? 'text-crd-green' : 'text-slate-400'}`} />
                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {layer.name}
                            </span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLayerToggle(layer.id);
                            }}
                            className="p-1 h-6 w-6 text-slate-400 hover:text-white"
                          >
                            {isHidden ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={`text-xs border ${getLayerTypeColor(layer.type)}`}>
                            {layer.type}
                          </Badge>
                          {layer.semanticType && (
                            <Badge className={`text-xs ${getSemanticColor(layer.semanticType)}`}>
                              {layer.semanticType}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>
                            {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}px
                          </span>
                          <span>
                            Vol: {Math.round(volume).toLocaleString()}
                          </span>
                        </div>
                        
                        {layer.inferredDepth && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                              Depth: {layer.inferredDepth.toFixed(2)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
