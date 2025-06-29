
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { 
  Search, 
  Layers, 
  Eye, 
  EyeOff, 
  Grid, 
  List,
  CheckSquare,
  Square,
  Filter
} from 'lucide-react';

interface LayerElementSelectorProps {
  processedPSDs: EnhancedProcessedPSD[];
  selectedElements: Set<string>;
  onElementToggle: (elementId: string) => void;
  onBulkSelect: (elementIds: string[]) => void;
}

export const LayerElementSelector: React.FC<LayerElementSelectorProps> = ({
  processedPSDs,
  selectedElements,
  onElementToggle,
  onBulkSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [selectedPSDId, setSelectedPSDId] = useState<string | null>(null);

  // Get all layers from all PSDs
  const allLayers = useMemo(() => {
    return processedPSDs.flatMap(psd => 
      psd.layers.map(layer => ({
        ...layer,
        psdId: psd.id,
        psdName: psd.fileName
      }))
    );
  }, [processedPSDs]);

  // Filter layers based on search and selection
  const filteredLayers = useMemo(() => {
    let layers = allLayers;
    
    // Apply search filter
    if (searchTerm) {
      layers = layers.filter(layer => 
        layer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (layer.semanticType && layer.semanticType.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply PSD filter
    if (selectedPSDId) {
      layers = layers.filter(layer => layer.psdId === selectedPSDId);
    }
    
    return layers;
  }, [allLayers, searchTerm, selectedPSDId]);

  const handleToggleLayer = (layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allLayerIds = filteredLayers.map(layer => layer.id);
    onBulkSelect(allLayerIds);
  };

  const handleClearAll = () => {
    onBulkSelect([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-crd-blue" />
          <h3 className="text-lg font-semibold text-white">Layer Element Selector</h3>
          <Badge variant="outline" className="bg-slate-800 text-slate-300">
            {filteredLayers.length} layers
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search layers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600"
          />
        </div>
        
        <select
          value={selectedPSDId || ''}
          onChange={(e) => setSelectedPSDId(e.target.value || null)}
          className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white"
        >
          <option value="">All PSDs</option>
          {processedPSDs.map(psd => (
            <option key={psd.id} value={psd.id}>
              {psd.fileName}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          disabled={filteredLayers.length === 0}
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          disabled={selectedElements.size === 0}
        >
          <Square className="w-4 h-4 mr-2" />
          Clear All
        </Button>
        
        {selectedElements.size > 0 && (
          <Badge className="bg-crd-green text-black">
            {selectedElements.size} selected
          </Badge>
        )}
      </div>

      {/* Layer Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-2"
      }>
        {filteredLayers.map((layer) => {
          const isSelected = selectedElements.has(layer.id);
          const isHidden = hiddenLayers.has(layer.id);
          
          return (
            <Card
              key={layer.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-crd-green bg-slate-700' : 'bg-slate-800 hover:bg-slate-750'
              } ${isHidden ? 'opacity-50' : ''}`}
              onClick={() => onElementToggle(layer.id)}
            >
              <div className="flex items-start gap-3">
                {/* Layer Preview */}
                <div className="w-12 h-12 bg-slate-600 rounded flex-shrink-0 flex items-center justify-center">
                  {layer.imageUrl ? (
                    <img
                      src={layer.imageUrl}
                      alt={layer.name}
                      className="w-full h-full object-contain rounded"
                    />
                  ) : (
                    <span className="text-slate-400 text-xs font-mono">
                      {layer.type.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* Layer Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {layer.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {(layer as any).psdName}
                  </p>
                  
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {layer.type}
                    </Badge>
                    {layer.semanticType && (
                      <Badge className="text-xs bg-blue-500/20 text-blue-400">
                        {layer.semanticType}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLayer(layer.id);
                    }}
                  >
                    {isHidden ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                  
                  {isSelected && (
                    <CheckSquare className="w-4 h-4 text-crd-green" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredLayers.length === 0 && (
        <div className="text-center py-8">
          <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No layers found</h3>
          <p className="text-slate-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};
