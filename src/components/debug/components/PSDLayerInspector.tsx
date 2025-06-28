
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  List,
  Info,
  MousePointer2,
  Palette
} from 'lucide-react';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { layerGroupingService, LayerGroup, GroupingResult } from '@/services/psdProcessor/layerGroupingService';

interface PSDLayerInspectorProps {
  processedPSD: ProcessedPSD;
  selectedLayerIds: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
  onLayerHover: (layerId: string | null) => void;
  visibleLayers: Set<string>;
}

type ViewMode = 'smart' | 'grouped' | 'flat';

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  processedPSD,
  selectedLayerIds,
  onLayerSelect,
  onLayerToggle,
  onLayerHover,
  visibleLayers
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('smart');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupingResult = useMemo((): GroupingResult => {
    return layerGroupingService.analyzeAndGroupLayers(processedPSD.layers);
  }, [processedPSD.layers]);

  const effectiveViewMode = useMemo((): 'grouped' | 'flat' => {
    if (viewMode === 'smart') {
      return groupingResult.shouldUseGrouping ? 'grouped' : 'flat';
    }
    return viewMode === 'grouped' ? 'grouped' : 'flat';
  }, [viewMode, groupingResult.shouldUseGrouping]);

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleLayerClick = (layer: ProcessedPSDLayer, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      onLayerSelect(layer.id);
    } else {
      onLayerToggle(layer.id);
    }
  };

  const renderLayerItem = (layer: ProcessedPSDLayer, groupColor?: string) => {
    const isSelected = selectedLayerIds.has(layer.id);
    const isVisible = visibleLayers.has(layer.id);
    
    return (
      <div
        key={layer.id}
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'bg-crd-green/20 border border-crd-green/50' 
            : 'hover:bg-slate-800/50'
        }`}
        onClick={(e) => handleLayerClick(layer, e)}
        onMouseEnter={() => onLayerHover(layer.id)}
        onMouseLeave={() => onLayerHover(null)}
        style={groupColor ? { borderLeft: `3px solid ${groupColor}` } : {}}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLayerToggle(layer.id);
          }}
          className="p-1 hover:bg-slate-700 rounded"
        >
          {isVisible ? (
            <Eye className="w-4 h-4 text-crd-green" />
          ) : (
            <EyeOff className="w-4 h-4 text-slate-500" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-sm font-medium truncate">
              {layer.name}
            </span>
            {layer.semanticType && (
              <Badge variant="outline" className="text-xs">
                {layer.semanticType}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{layer.bounds.right - layer.bounds.left}×{layer.bounds.bottom - layer.bounds.top}</span>
            {layer.inferredDepth !== undefined && (
              <span>Z: {layer.inferredDepth.toFixed(2)}</span>
            )}
            {layer.opacity !== undefined && layer.opacity < 1 && (
              <span>{Math.round(layer.opacity * 100)}%</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {layer.materialHints && layer.materialHints.length > 0 && (
            <Palette className="w-3 h-3 text-slate-500" />
          )}
          <MousePointer2 className="w-3 h-3 text-slate-600" />
        </div>
      </div>
    );
  };

  const renderGroupedView = () => {
    return (
      <div className="space-y-2">
        {groupingResult.groups.map((group) => {
          const isExpanded = expandedGroups.has(group.id);
          
          return (
            <div key={group.id} className="border border-slate-700 rounded-lg overflow-hidden">
              <div
                className="flex items-center gap-2 p-3 bg-slate-800/50 cursor-pointer hover:bg-slate-800/70 transition-colors"
                onClick={() => toggleGroup(group.id)}
                style={{ borderLeft: `4px solid ${group.color}` }}
              >
                <button className="p-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: group.color }}
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{group.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {group.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">
                    Avg Depth: {group.averageDepth.toFixed(2)} • {group.layers.length} layers
                  </div>
                </div>

                <Layers className="w-4 h-4 text-slate-500" />
              </div>

              {isExpanded && (
                <div className="p-2 space-y-1 bg-slate-900/30">
                  {group.layers.map((layer) => renderLayerItem(layer, group.color))}
                </div>
              )}
            </div>
          );
        })}

        {/* Ungrouped layers */}
        {groupingResult.flatLayers.some(layer => 
          !groupingResult.groups.some(group => 
            group.layers.some(groupLayer => groupLayer.id === layer.id)
          )
        ) && (
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 p-3 bg-slate-800/30">
              <List className="w-4 h-4 text-slate-500" />
              <span className="text-white font-medium">Individual Layers</span>
            </div>
            <div className="p-2 space-y-1">
              {groupingResult.flatLayers
                .filter(layer => 
                  !groupingResult.groups.some(group => 
                    group.layers.some(groupLayer => groupLayer.id === layer.id)
                  )
                )
                .map((layer) => renderLayerItem(layer))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFlatView = () => {
    return (
      <div className="space-y-1">
        {groupingResult.flatLayers.map((layer) => renderLayerItem(layer))}
      </div>
    );
  };

  return (
    <Card className="bg-[#0a0f1b] border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-crd-green" />
            Layer Inspector
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setViewMode('smart')}
              variant={viewMode === 'smart' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'smart' ? 'bg-crd-green text-black' : ''}
            >
              Smart
            </Button>
            <Button
              onClick={() => setViewMode('grouped')}
              variant={viewMode === 'grouped' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'grouped' ? 'bg-crd-green text-black' : ''}
              disabled={!groupingResult.shouldUseGrouping && viewMode !== 'grouped'}
            >
              <Layers className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => setViewMode('flat')}
              variant={viewMode === 'flat' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'flat' ? 'bg-crd-green text-black' : ''}
            >
              <List className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Grouping Info */}
        {viewMode === 'smart' && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-slate-800/30 rounded-lg">
            <Info className="w-4 h-4 text-crd-green" />
            <div className="text-xs text-slate-300">
              {effectiveViewMode === 'grouped' ? (
                <span>
                  Smart grouping active • {groupingResult.groups.length} groups • 
                  {Math.round(groupingResult.groupingEfficiency * 100)}% efficiency
                </span>
              ) : (
                <span>
                  Flat view active • Grouping not beneficial for this PSD
                </span>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="mb-4 text-sm text-slate-400">
          {processedPSD.layers.length} layers • {selectedLayerIds.size} selected • {visibleLayers.size} visible
        </div>

        {effectiveViewMode === 'grouped' ? renderGroupedView() : renderFlatView()}
      </CardContent>
    </Card>
  );
};
