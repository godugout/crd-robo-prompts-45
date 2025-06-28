
import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, ChevronRight, ChevronDown, Layers } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerGroup } from '@/services/psdProcessor/layerGroupingService';

interface PSDLayerInspectorProps {
  processedLayers: ProcessedPSDLayer[];
  layerGroups?: LayerGroup[];
  onLayerSelect?: (layer: ProcessedPSDLayer) => void;
  selectedLayerId?: string | null;
  layerVisibility?: Map<string, boolean>;
  onToggleVisibility?: (layerId: string) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  processedLayers,
  layerGroups = [],
  onLayerSelect,
  selectedLayerId,
  layerVisibility,
  onToggleVisibility
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showGrouped, setShowGrouped] = useState(true);

  // Get layer's group color
  const getLayerGroupColor = (layerId: string): string | null => {
    const group = layerGroups.find(g => g.layers.some(l => l.id === layerId));
    return group?.color || null;
  };

  // Organize layers by groups or flat list
  const organizedContent = useMemo(() => {
    if (!showGrouped || layerGroups.length === 0) {
      return processedLayers.map(layer => ({
        type: 'layer' as const,
        layer,
        level: 0,
        groupColor: getLayerGroupColor(layer.id)
      }));
    }

    const content: Array<{
      type: 'group' | 'layer';
      group?: LayerGroup;
      layer?: ProcessedPSDLayer;
      level: number;
      groupColor?: string | null;
    }> = [];

    // Add ungrouped layers first
    const groupedLayerIds = new Set(layerGroups.flatMap(g => g.layers.map(l => l.id)));
    const ungroupedLayers = processedLayers.filter(layer => !groupedLayerIds.has(layer.id));
    
    ungroupedLayers.forEach(layer => {
      content.push({
        type: 'layer',
        layer,
        level: 0,
        groupColor: null
      });
    });

    // Add groups and their layers
    layerGroups.forEach(group => {
      content.push({
        type: 'group',
        group,
        level: 0
      });

      if (expandedGroups.has(group.id)) {
        group.layers.forEach(layer => {
          content.push({
            type: 'layer',
            layer,
            level: 1,
            groupColor: group.color
          });
        });
      }
    });

    return content;
  }, [processedLayers, layerGroups, showGrouped, expandedGroups]);

  const handleLayerClick = (layer: ProcessedPSDLayer) => {
    onLayerSelect?.(layer);
  };

  const toggleVisibility = (layerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleVisibility?.(layerId);
  };

  const toggleGroup = (groupId: string, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const toggleGroupVisibility = (group: LayerGroup, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!onToggleVisibility) return;

    const allVisible = group.layers.every(layer => 
      layerVisibility?.get(layer.id) ?? layer.visible
    );

    group.layers.forEach(layer => {
      onToggleVisibility(layer.id);
    });
  };

  const getSemanticTypeBadge = (semanticType?: string) => {
    if (!semanticType) return null;

    const badgeConfig = {
      background: { color: 'bg-slate-600', label: 'BG' },
      player: { color: 'bg-blue-600', label: 'PLAYER' },
      stats: { color: 'bg-green-600', label: 'STATS' },
      logo: { color: 'bg-purple-600', label: 'LOGO' },
      effect: { color: 'bg-orange-600', label: 'FX' },
      border: { color: 'bg-gray-600', label: 'BORDER' },
      text: { color: 'bg-yellow-600', label: 'TEXT' },
      image: { color: 'bg-cyan-600', label: 'IMG' }
    };

    const config = badgeConfig[semanticType as keyof typeof badgeConfig];
    if (!config) return null;

    return (
      <Badge variant="secondary" className={`${config.color} text-white text-xs px-1 py-0.5 h-5`}>
        {config.label}
      </Badge>
    );
  };

  const GroupItem: React.FC<{ group: LayerGroup }> = ({ group }) => {
    const isExpanded = expandedGroups.has(group.id);
    const visibleLayers = group.layers.filter(layer => 
      layerVisibility?.get(layer.id) ?? layer.visible
    ).length;

    return (
      <div className="space-y-1">
        <div
          className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-slate-800/50 border-l-4"
          style={{ borderLeftColor: group.color }}
          onClick={(e) => toggleGroup(group.id, e)}
        >
          <button className="text-slate-400 hover:text-white transition-colors p-1">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          <div 
            className="w-4 h-4 rounded border-2 border-white/20"
            style={{ backgroundColor: group.color }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium truncate">{group.name}</span>
              <Badge variant="outline" className="text-xs">
                {visibleLayers}/{group.layers.length}
              </Badge>
            </div>
            <div className="text-xs text-slate-400">
              Depth: {Math.round(group.averageDepth * 100)}% • {group.type}
            </div>
          </div>

          <button
            onClick={(e) => toggleGroupVisibility(group, e)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            {visibleLayers === group.layers.length ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>
    );
  };

  const LayerItem: React.FC<{ 
    layer: ProcessedPSDLayer; 
    level: number; 
    groupColor?: string | null;
  }> = ({ layer, level, groupColor }) => {
    const isSelected = selectedLayerId === layer.id;
    const isVisible = layerVisibility?.get(layer.id) ?? layer.visible;
    const depthPercentage = Math.round((layer.inferredDepth || 0) * 100);

    return (
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
          hover:bg-slate-800/50 touch-manipulation
          ${isSelected ? 'bg-blue-900/50 border-2 border-blue-500/70 shadow-lg shadow-blue-500/20' : 'border-2 border-transparent'}
          ${!isVisible ? 'opacity-50' : ''}
          ${groupColor ? 'border-l-4' : ''}
        `}
        style={{ 
          paddingLeft: `${8 + level * 16}px`,
          borderLeftColor: groupColor || 'transparent'
        }}
        onClick={() => handleLayerClick(layer)}
      >
        {/* Layer thumbnail */}
        <div className={`w-10 h-10 bg-slate-700 rounded border flex-shrink-0 overflow-hidden ${
          isSelected ? 'ring-2 ring-blue-400' : ''
        }`}>
          {layer.imageData ? (
            <img
              src={layer.imageData}
              alt={layer.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
              {layer.type === 'text' ? 'T' : layer.type === 'group' ? 'G' : 'L'}
            </div>
          )}
        </div>

        {/* Layer info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium truncate ${
              isSelected ? 'text-blue-200' : 'text-white'
            }`}>
              {layer.name}
            </span>
            {getSemanticTypeBadge(layer.semanticType)}
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${
              isSelected ? 'text-blue-300' : 'text-slate-400'
            }`}>
              Depth: {depthPercentage}%
            </span>
            {groupColor && (
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: groupColor }}
                title="Group color"
              />
            )}
          </div>
        </div>

        {/* Visibility toggle */}
        <button
          onClick={(e) => toggleVisibility(layer.id, e)}
          className={`transition-colors p-1 ${
            isSelected 
              ? 'text-blue-300 hover:text-blue-100' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
    );
  };

  if (processedLayers.length === 0) {
    return (
      <div className="bg-[#0a0f1b] rounded-lg p-6 text-center">
        <p className="text-slate-400">No layers to display</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0f1b] rounded-lg border border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Layers ({processedLayers.length})
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrouped(!showGrouped)}
              className={`border-slate-600 text-xs ${
                showGrouped ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              {showGrouped ? 'Grouped' : 'Flat'}
            </Button>
          </div>
        </div>
        
        {layerGroups.length > 0 && (
          <div className="flex gap-2 text-xs flex-wrap">
            <Badge variant="outline" className="text-slate-300">
              {layerGroups.length} groups
            </Badge>
            {layerGroups.map(group => (
              <Badge 
                key={group.id}
                variant="outline" 
                className="text-slate-300 border-l-4 pl-2"
                style={{ borderLeftColor: group.color }}
              >
                {group.layers.length} {group.type}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Layers list */}
      <ScrollArea className="h-96">
        <div className="p-2 space-y-1">
          {organizedContent.map((item, index) => (
            <div key={`${item.type}-${index}`}>
              {item.type === 'group' && item.group ? (
                <GroupItem group={item.group} />
              ) : item.type === 'layer' && item.layer ? (
                <LayerItem
                  layer={item.layer}
                  level={item.level}
                  groupColor={item.groupColor}
                />
              ) : null}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
