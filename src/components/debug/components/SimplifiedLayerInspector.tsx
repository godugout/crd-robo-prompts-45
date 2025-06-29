
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Search, 
  Image, 
  Type, 
  Layers, 
  Palette,
  ChevronDown,
  ChevronRight,
  Focus,
  Frame,
  Wand2
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
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all']));
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());

  // Filter and group layers
  const filteredLayers = useMemo(() => {
    return layers.filter(layer => 
      layer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [layers, searchTerm]);

  // Group layers by type for different view modes
  const groupedLayers = useMemo(() => {
    const groups = {
      text: filteredLayers.filter(l => l.type === 'text'),
      image: filteredLayers.filter(l => l.type === 'image'),
      shape: filteredLayers.filter(l => l.type === 'shape'),
      group: filteredLayers.filter(l => l.type === 'group'),
      other: filteredLayers.filter(l => !['text', 'image', 'shape', 'group'].includes(l.type))
    };
    return groups;
  }, [filteredLayers]);

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleLayerFlip = (layerId: string) => {
    const newFlipped = new Set(flippedLayers);
    if (newFlipped.has(layerId)) {
      newFlipped.delete(layerId);
    } else {
      newFlipped.add(layerId);
    }
    setFlippedLayers(newFlipped);
    onFlippedLayersChange?.(newFlipped);
  };

  const getLayerIcon = (layerType: string) => {
    switch (layerType) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'shape': return <Palette className="w-4 h-4" />;
      case 'group': return <Layers className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'inspect': return <Focus className="w-4 h-4" />;
      case 'frame': return <Frame className="w-4 h-4" />;
      case 'build': return <Wand2 className="w-4 h-4" />;
      default: return <Focus className="w-4 h-4" />;
    }
  };

  const getViewModeContent = () => {
    switch (viewMode) {
      case 'inspect':
        return (
          <div className="space-y-4">
            <div className="text-sm text-slate-400">
              Click layers to inspect their properties and content. Use focus mode to isolate selected layers.
            </div>
            {selectedLayer && (
              <div className="bg-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  {getLayerIcon(selectedLayer.type)}
                  <span className="font-medium text-white">{selectedLayer.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Type:</span>
                    <Badge variant="outline" className="ml-1 text-xs">
                      {selectedLayer.type}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-400">Opacity:</span>
                    <span className="ml-1 text-white">{Math.round((selectedLayer.opacity || 1) * 100)}%</span>
                  </div>
                </div>
                {selectedLayer.bounds && (
                  <div className="text-xs text-slate-400">
                    Bounds: {selectedLayer.bounds.width} × {selectedLayer.bounds.height}px
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 'frame':
        return (
          <div className="space-y-4">
            <div className="text-sm text-slate-400">
              Analyze how layers fit within frame boundaries. Select layers to optimize frame positioning.
            </div>
            {selectedLayer && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <div className="text-yellow-400 text-sm font-medium mb-2">Frame Analysis</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Position:</span>
                    <span className="text-white">
                      {selectedLayer.bounds?.left || 0}, {selectedLayer.bounds?.top || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-white">
                      {selectedLayer.bounds?.width || 0} × {selectedLayer.bounds?.height || 0}
                    </span>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    Optimized for frames
                  </Badge>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'build':
        return (
          <div className="space-y-4">
            <div className="text-sm text-slate-400">
              Generate custom CRD frames from selected layers. Flip layers to create CRD-branded elements.
            </div>
            {selectedLayer && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                <div className="text-purple-400 text-sm font-medium mb-2">CRD Frame Builder</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleLayerFlip(selectedLayer.id)}
                  className={`w-full ${
                    flippedLayers.has(selectedLayer.id)
                      ? 'bg-crd-blue text-white border-crd-blue'
                      : 'border-purple-500/30 text-purple-300'
                  }`}
                >
                  {flippedLayers.has(selectedLayer.id) ? 'CRD Branded' : 'Make CRD Element'}
                </Button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderLayerGroup = (groupName: string, groupLayers: ProcessedPSDLayer[]) => {
    if (groupLayers.length === 0) return null;

    const isExpanded = expandedGroups.has(groupName);
    const groupIcon = {
      text: <Type className="w-4 h-4" />,
      image: <Image className="w-4 h-4" />,
      shape: <Palette className="w-4 h-4" />,
      group: <Layers className="w-4 h-4" />,
      other: <Layers className="w-4 h-4" />
    }[groupName];

    return (
      <div key={groupName} className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleGroup(groupName)}
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700 h-8"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
          {groupIcon}
          <span className="ml-2 capitalize">{groupName}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {groupLayers.length}
          </Badge>
        </Button>
        
        {isExpanded && (
          <div className="ml-4 space-y-1">
            {groupLayers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors group ${
                  layer.id === selectedLayerId
                    ? 'bg-crd-green text-black'
                    : focusMode && selectedLayerId && layer.id !== selectedLayerId
                    ? 'opacity-30'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggle(layer.id);
                  }}
                  className="p-0 h-auto w-auto hover:bg-transparent"
                >
                  {hiddenLayers.has(layer.id) ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  )}
                </Button>
                
                {getLayerIcon(layer.type)}
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{layer.name}</div>
                  <div className="text-xs opacity-70">
                    {layer.bounds ? `${layer.bounds.width} × ${layer.bounds.height}` : 'No bounds'}
                  </div>
                </div>
                
                {layer.semanticType && (
                  <Badge variant="outline" className="text-xs">
                    {layer.semanticType}
                  </Badge>
                )}
                
                {flippedLayers.has(layer.id) && (
                  <Badge className="bg-crd-blue text-white text-xs">
                    CRD
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1f2e]">
      {/* Header with mode indicator */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          {getViewModeIcon()}
          <span className="text-white font-medium">
            {viewMode === 'inspect' && 'Layer Inspector'}
            {viewMode === 'frame' && 'Frame Analysis'}
            {viewMode === 'build' && 'CRD Builder'}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Mode-specific content */}
      <div className="px-4 py-3 border-b border-slate-700">
        {getViewModeContent()}
      </div>

      {/* Layer list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {viewMode === 'inspect' ? (
            // Flat list for inspection
            <div className="space-y-1">
              {filteredLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors group ${
                    layer.id === selectedLayerId
                      ? 'bg-crd-green text-black'
                      : focusMode && selectedLayerId && layer.id !== selectedLayerId
                      ? 'opacity-30'
                      : 'hover:bg-slate-700 text-slate-300'
                  }`}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggle(layer.id);
                    }}
                    className="p-0 h-auto w-auto hover:bg-transparent"
                  >
                    {hiddenLayers.has(layer.id) ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    )}
                  </Button>
                  
                  {getLayerIcon(layer.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{layer.name}</div>
                    <div className="text-xs opacity-70">
                      {layer.bounds ? `${layer.bounds.width} × ${layer.bounds.height}` : 'No bounds'}
                    </div>
                  </div>
                  
                  {layer.semanticType && (
                    <Badge variant="outline" className="text-xs">
                      {layer.semanticType}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Grouped view for frame and build modes
            <div className="space-y-2">
              {Object.entries(groupedLayers).map(([groupName, groupLayers]) =>
                renderLayerGroup(groupName, groupLayers)
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer stats */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>{filteredLayers.length} layers</span>
          <span>{hiddenLayers.size} hidden</span>
          {focusMode && <span className="text-blue-400">Focus Mode</span>}
        </div>
      </div>
    </div>
  );
};
