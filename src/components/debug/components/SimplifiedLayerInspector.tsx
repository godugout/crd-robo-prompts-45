
import React, { useState, useMemo } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Image,
  Type,
  Square,
  Layers,
  Focus,
  Palette,
  Zap
} from 'lucide-react';

interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onFlippedLayersChange?: (flipped: Set<string>) => void;
  viewMode?: 'inspect' | 'frame' | 'build';
  focusMode?: boolean;
  showBackground?: boolean;
}

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle,
  onFlippedLayersChange,
  viewMode = 'inspect',
  focusMode = false,
  showBackground = true
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());

  // Get layer type icon
  const getLayerIcon = (layer: ProcessedPSDLayer) => {
    switch (layer.type) {
      case 'text':
        return <Type className="w-4 h-4 text-blue-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-green-400" />;
      case 'shape':
        return <Square className="w-4 h-4 text-purple-400" />;
      case 'group':
        return <Layers className="w-4 h-4 text-orange-400" />;
      default:
        return <Square className="w-4 h-4 text-slate-400" />;
    }
  };

  // Calculate layer dimensions
  const getLayerDimensions = (layer: ProcessedPSDLayer) => {
    const width = layer.bounds.right - layer.bounds.left;
    const height = layer.bounds.bottom - layer.bounds.top;
    return { width, height };
  };

  // Get layer priority for different view modes
  const getLayerPriority = (layer: ProcessedPSDLayer) => {
    const { width, height } = getLayerDimensions(layer);
    const area = width * height;
    
    if (viewMode === 'frame') {
      // Prioritize larger layers and images for frame fitting
      return layer.type === 'image' ? area * 2 : area;
    } else if (viewMode === 'build') {
      // Prioritize structural elements
      return layer.type === 'shape' ? area * 1.5 : area;
    }
    return area; // Default inspect mode
  };

  // Sort layers by priority for current view mode
  const sortedLayers = useMemo(() => {
    const sorted = [...layers].sort((a, b) => {
      const priorityA = getLayerPriority(a);
      const priorityB = getLayerPriority(b);
      return priorityB - priorityA;
    });
    return sorted;
  }, [layers, viewMode]);

  // Filter layers based on view mode
  const filteredLayers = useMemo(() => {
    if (viewMode === 'frame') {
      // Show only image and shape layers for frame analysis
      return sortedLayers.filter(layer => 
        layer.type === 'image' || layer.type === 'shape'
      );
    } else if (viewMode === 'build') {
      // Show structural elements for frame building
      return sortedLayers.filter(layer => 
        layer.type === 'shape' || layer.type === 'group' || layer.type === 'image'
      );
    }
    return sortedLayers; // Show all in inspect mode
  }, [sortedLayers, viewMode]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return newExpanded;
    });
  };

  const handleFlipLayer = (layerId: string) => {
    setFlippedLayers(prev => {
      const newFlipped = new Set(prev);
      if (newFlipped.has(layerId)) {
        newFlipped.delete(layerId);
      } else {
        newFlipped.add(layerId);
      }
      onFlippedLayersChange?.(newFlipped);
      return newFlipped;
    });
  };

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  return (
    <div className="h-full flex flex-col bg-[#1a1f2e]">
      {/* Mode-specific header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          {viewMode === 'inspect' && <Focus className="w-4 h-4 text-blue-400" />}
          {viewMode === 'frame' && <Square className="w-4 h-4 text-green-400" />}
          {viewMode === 'build' && <Zap className="w-4 h-4 text-purple-400" />}
          <span className="text-sm font-medium text-white">
            {viewMode === 'inspect' && 'Layer Analysis'}
            {viewMode === 'frame' && 'Frame Fitting'}
            {viewMode === 'build' && 'Frame Construction'}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {viewMode === 'inspect' && 'Explore and analyze individual layers'}
          {viewMode === 'frame' && 'Optimize content for frame templates'}
          {viewMode === 'build' && 'Generate custom CRD frame elements'}
        </p>
      </div>

      {/* Layer count and filters */}
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{filteredLayers.length} layers</span>
          <div className="flex items-center gap-2">
            {focusMode && (
              <Badge className="bg-blue-500/20 text-blue-400 text-xs">Focus</Badge>
            )}
            {!showBackground && (
              <Badge className="bg-slate-600 text-slate-300 text-xs">No BG</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Layers list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredLayers.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            const isVisible = !hiddenLayers.has(layer.id);
            const isFlipped = flippedLayers.has(layer.id);
            const { width, height } = getLayerDimensions(layer);

            return (
              <div key={layer.id} className="group">
                <div
                  className={`
                    flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-crd-blue/20 border border-crd-blue/40' 
                      : 'hover:bg-slate-700/50'
                    }
                    ${!isVisible ? 'opacity-50' : ''}
                  `}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  {/* Layer type icon */}
                  <div className="flex-shrink-0">
                    {getLayerIcon(layer)}
                  </div>

                  {/* Layer info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {layer.name}
                      </span>
                      
                      {/* Layer type badge */}
                      <Badge 
                        variant="outline" 
                        className="text-xs border-slate-600 text-slate-400"
                      >
                        {layer.type}
                      </Badge>
                    </div>
                    
                    {/* Layer dimensions */}
                    <div className="text-xs text-slate-400 mt-1">
                      {width}×{height}px
                      {layer.opacity && layer.opacity < 1 && (
                        <span className="ml-2">
                          {Math.round(layer.opacity * 100)}% opacity
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Layer controls */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Visibility toggle */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0 text-slate-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggle(layer.id);
                      }}
                    >
                      {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>

                    {/* CRD flip button (for frame and build modes) */}
                    {(viewMode === 'frame' || viewMode === 'build') && layer.type === 'image' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`w-6 h-6 p-0 transition-colors ${
                          isFlipped 
                            ? 'text-crd-green bg-crd-green/20' 
                            : 'text-slate-400 hover:text-crd-green'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlipLayer(layer.id);
                        }}
                        title="Convert to CRD branding"
                      >
                        <Palette className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Selected layer details */}
      {selectedLayer && (
        <>
          <Separator />
          <div className="p-4 bg-[#151922]">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              {getLayerIcon(selectedLayer)}
              Layer Details
            </h3>
            
            <div className="space-y-3">
              {/* Basic info */}
              <div>
                <div className="text-xs text-slate-400 mb-1">Name</div>
                <div className="text-sm text-white font-medium">{selectedLayer.name}</div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Size</div>
                  <div className="text-sm text-white">
                    {getLayerDimensions(selectedLayer).width}×{getLayerDimensions(selectedLayer).height}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Type</div>
                  <div className="text-sm text-white capitalize">{selectedLayer.type}</div>
                </div>
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Position</div>
                  <div className="text-sm text-white">
                    {selectedLayer.bounds.left}, {selectedLayer.bounds.top}
                  </div>
                </div>
                {selectedLayer.opacity && (
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Opacity</div>
                    <div className="text-sm text-white">
                      {Math.round(selectedLayer.opacity * 100)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Mode-specific analysis */}
              {viewMode === 'frame' && selectedLayer.type === 'image' && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-xs text-green-400 mb-1">Frame Analysis</div>
                  <div className="text-xs text-slate-300">
                    Optimal for frame fitting • High priority content
                  </div>
                </div>
              )}

              {viewMode === 'build' && (
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="text-xs text-purple-400 mb-1">Build Potential</div>
                  <div className="text-xs text-slate-300">
                    {selectedLayer.type === 'shape' && 'Structural element • Good for frame construction'}
                    {selectedLayer.type === 'image' && 'Content element • Can be enhanced with CRD branding'}
                    {selectedLayer.type === 'text' && 'Typography element • Consider for frame labels'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
