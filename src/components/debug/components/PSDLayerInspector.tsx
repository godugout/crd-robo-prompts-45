
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  Image as ImageIcon, 
  Type, 
  Shapes, 
  Folder,
  ChevronDown,
  ChevronRight,
  Circle
} from 'lucide-react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';

interface PSDLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  layerGroups: LayerGroup[];
  selectedLayerId: string | null;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  layers,
  layerGroups,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('flat');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group colors for visual distinction
  const groupColors = {
    'background': 'bg-gray-500',
    'character': 'bg-green-500', 
    'ui': 'bg-orange-500',
    'effects': 'bg-purple-500',
    'branding': 'bg-red-500',
    'mixed': 'bg-blue-500'
  };

  // Icon mapping for layer types
  const getLayerIcon = (layer: ProcessedPSDLayer) => {
    switch (layer.type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'shape': return <Shapes className="w-4 h-4" />;
      case 'group': return <Folder className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  // Get semantic type color
  const getSemanticColor = (semanticType?: string) => {
    const colors = {
      'background': 'text-gray-400',
      'player': 'text-green-400',
      'stats': 'text-orange-400', 
      'logo': 'text-red-400',
      'effect': 'text-purple-400',
      'border': 'text-blue-400',
      'text': 'text-yellow-400',
      'image': 'text-cyan-400'
    };
    return colors[semanticType as keyof typeof colors] || 'text-slate-400';
  };

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

  // Determine which view mode to show based on content
  const shouldShowGrouped = useMemo(() => {
    return layerGroups.length > 0 && layerGroups.some(group => group.layers.length > 1);
  }, [layerGroups]);

  // Stats for the current view
  const viewStats = useMemo(() => {
    if (viewMode === 'grouped' && shouldShowGrouped) {
      const meaningfulGroups = layerGroups.filter(group => group.layers.length > 1);
      const singleLayers = layers.length - meaningfulGroups.reduce((sum, group) => sum + group.layers.length, 0);
      return {
        groups: meaningfulGroups.length,
        singleLayers,
        totalLayers: layers.length
      };
    }
    return {
      groups: 0,
      singleLayers: layers.length,
      totalLayers: layers.length
    };
  }, [viewMode, layerGroups, layers.length, shouldShowGrouped]);

  const renderLayer = (layer: ProcessedPSDLayer, isInGroup = false, groupColor?: string) => {
    const isSelected = selectedLayerId === layer.id;
    const isHidden = hiddenLayers.has(layer.id);
    
    return (
      <div
        key={layer.id}
        className={`
          flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
          ${isSelected ? 'bg-crd-green/20 border border-crd-green/50' : 'hover:bg-slate-800/50'}
          ${isInGroup ? 'ml-4 border-l-2' : ''}
        `}
        style={isInGroup && groupColor ? { borderLeftColor: groupColor } : {}}
        onClick={() => onLayerSelect(layer.id)}
      >
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-slate-400 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onLayerToggle(layer.id);
          }}
        >
          {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>

        <div className="text-slate-400">
          {getLayerIcon(layer)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm truncate">{layer.name}</span>
            {layer.semanticType && (
              <Badge variant="outline" className={`text-xs ${getSemanticColor(layer.semanticType)}`}>
                {layer.semanticType}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span>z: {layer.zIndex}</span>
            <span>α: {Math.round(layer.opacity * 100)}%</span>
            {layer.inferredDepth !== undefined && (
              <span>d: {layer.inferredDepth.toFixed(1)}</span>
            )}
            {layer.materialHints && (
              <div className="flex gap-1">
                {layer.materialHints.isMetallic && <Circle className="w-2 h-2 fill-yellow-400 text-yellow-400" />}
                {layer.materialHints.isHolographic && <Circle className="w-2 h-2 fill-purple-400 text-purple-400" />}
                {layer.materialHints.hasGlow && <Circle className="w-2 h-2 fill-blue-400 text-blue-400" />}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGroup = (group: LayerGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    const groupColorClass = groupColors[group.groupType as keyof typeof groupColors] || groupColors.mixed;
    const groupColor = groupColorClass.replace('bg-', '').replace('-500', '');
    
    return (
      <div key={group.id} className="mb-2">
        <div
          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-800/30 border border-slate-700/50"
          onClick={() => toggleGroup(group.id)}
        >
          <Button variant="ghost" size="sm" className="p-1 h-auto text-slate-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
          
          <div className={`w-3 h-3 rounded ${groupColorClass}`} />
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{group.name}</span>
              <Badge variant="outline" className="text-xs">
                {group.layers.length} layers
              </Badge>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Score: {group.cohesionScore.toFixed(2)} • Type: {group.groupType}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-1 space-y-1">
            {group.layers.map(layer => renderLayer(layer, true, `#${groupColor}`))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-[#0a0f1b] border-slate-800 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Layers className="w-5 h-5 text-crd-green" />
          Layer Inspector
        </CardTitle>
        
        {/* View Stats */}
        <div className="flex gap-4 text-sm text-slate-400">
          <span>{viewStats.totalLayers} layers</span>
          {viewStats.groups > 0 && <span>{viewStats.groups} groups</span>}
          {viewStats.singleLayers > 0 && <span>{viewStats.singleLayers} individual</span>}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {shouldShowGrouped ? (
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'flat' | 'grouped')}>
            <div className="px-4 pb-3">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="flat" className="text-xs">Flat View</TabsTrigger>
                <TabsTrigger value="grouped" className="text-xs">Smart Groups</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="px-4 pb-4">
                <TabsContent value="flat" className="mt-0 space-y-1">
                  {layers.map(layer => renderLayer(layer))}
                </TabsContent>

                <TabsContent value="grouped" className="mt-0 space-y-2">
                  {layerGroups.filter(group => group.layers.length > 1).map(renderGroup)}
                  
                  {/* Single layers not in meaningful groups */}
                  {(() => {
                    const groupedLayerIds = new Set(
                      layerGroups
                        .filter(group => group.layers.length > 1)
                        .flatMap(group => group.layers.map(layer => layer.id))
                    );
                    const singleLayers = layers.filter(layer => !groupedLayerIds.has(layer.id));
                    
                    return singleLayers.length > 0 ? (
                      <div className="space-y-1 pt-2 border-t border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-2">Individual Layers</div>
                        {singleLayers.map(layer => renderLayer(layer))}
                      </div>
                    ) : null;
                  })()}
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="px-4 pb-4 space-y-1">
              {layers.map(layer => renderLayer(layer))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
