import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, ChevronRight, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';

interface PSDLayerInspectorProps {
  processedLayers: ProcessedPSDLayer[];
  onLayerSelect?: (layer: ProcessedPSDLayer) => void;
  selectedLayerId?: string | null;
  layerVisibility?: Map<string, boolean>;
  onToggleVisibility?: (layerId: string) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  processedLayers,
  onLayerSelect,
  selectedLayerId,
  layerVisibility,
  onToggleVisibility
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Organize layers into hierarchy (basic implementation - flat for now)
  const organizedLayers = useMemo(() => {
    return processedLayers.map(layer => ({
      layer,
      level: 0,
      isGroup: layer.type === 'group'
    }));
  }, [processedLayers]);

  const handleLayerClick = (layer: ProcessedPSDLayer) => {
    onLayerSelect?.(layer);
  };

  const toggleVisibility = (layerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleVisibility?.(layerId);
  };

  const toggleGroup = (layerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
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

  const getMaterialHintBadges = (materialHints?: ProcessedPSDLayer['materialHints']) => {
    if (!materialHints) return null;

    const badges = [];

    if (materialHints.isMetallic) {
      badges.push(
        <Badge 
          key="metallic" 
          className="bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs px-1 py-0.5 h-5"
        >
          ✨
        </Badge>
      );
    }

    if (materialHints.isHolographic) {
      badges.push(
        <Badge 
          key="holographic" 
          className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white text-xs px-1 py-0.5 h-5"
        >
          🌈
        </Badge>
      );
    }

    if (materialHints.hasGlow) {
      badges.push(
        <Badge 
          key="glow" 
          className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-1 py-0.5 h-5"
        >
          💫
        </Badge>
      );
    }

    return badges.length > 0 ? <div className="flex gap-1">{badges}</div> : null;
  };

  const LayerItem: React.FC<{ 
    layer: ProcessedPSDLayer; 
    level: number; 
    isGroup: boolean;
  }> = ({ layer, level, isGroup }) => {
    const isSelected = selectedLayerId === layer.id;
    const isVisible = layerVisibility?.get(layer.id) ?? layer.visible;
    const isExpanded = expandedGroups.has(layer.id);
    const depthPercentage = Math.round((layer.inferredDepth || 0) * 100);

    return (
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
          hover:bg-slate-800/50 touch-manipulation
          ${isSelected ? 'bg-blue-900/50 border-2 border-blue-500/70 shadow-lg shadow-blue-500/20' : 'border-2 border-transparent'}
          ${!isVisible ? 'opacity-50' : ''}
        `}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => handleLayerClick(layer)}
      >
        {/* Group expand/collapse */}
        {isGroup && (
          <button
            onClick={(e) => toggleGroup(layer.id, e)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

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
            {getMaterialHintBadges(layer.materialHints)}
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

  // Virtualization for large layer counts
  const shouldVirtualize = processedLayers.length > 50;

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
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Layers ({processedLayers.length})</h3>
          <div className="flex gap-2 text-xs">
            {/* Quick stats */}
            <Badge variant="outline" className="text-slate-300">
              {processedLayers.filter(l => l.semanticType === 'background').length} BG
            </Badge>
            <Badge variant="outline" className="text-slate-300">
              {processedLayers.filter(l => l.materialHints?.isMetallic).length} Metal
            </Badge>
            <Badge variant="outline" className="text-slate-300">
              {processedLayers.filter(l => l.materialHints?.isHolographic).length} Holo
            </Badge>
          </div>
        </div>
      </div>

      {/* Layers list */}
      <ScrollArea className="h-96">
        <div className="p-2 space-y-1">
          {shouldVirtualize ? (
            // For large lists, we'd implement proper virtualization here
            // For now, just render all items with a warning
            <>
              <div className="text-yellow-400 text-xs p-2 bg-yellow-900/20 rounded mb-2">
                Large layer count detected. Performance may be impacted.
              </div>
              {organizedLayers.map(({ layer, level, isGroup }) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  level={level}
                  isGroup={isGroup}
                />
              ))}
            </>
          ) : (
            organizedLayers.map(({ layer, level, isGroup }) => (
              <LayerItem
                key={layer.id}
                layer={layer}
                level={level}
                isGroup={isGroup}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
