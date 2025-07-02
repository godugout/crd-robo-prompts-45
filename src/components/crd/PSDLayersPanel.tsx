/**
 * PSD Layers Panel Component
 * Hierarchical layer management with drag-and-drop reordering and advanced controls
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, EyeOff, Lock, Unlock, ChevronDown, ChevronRight,
  Image, Type, Square, Layers, Move3D
} from 'lucide-react';
import type { ProcessedPSD, PSDLayer } from '@/services/crdElements/PSDProcessor';

interface PSDLayersPanelProps {
  processedPSD: ProcessedPSD;
  selectedLayerId?: string;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string, visible: boolean) => void;
  onLayerLock: (layerId: string, locked: boolean) => void;
  onLayerReorder: (layerId: string, newIndex: number) => void;
}

export const PSDLayersPanel: React.FC<PSDLayersPanelProps> = ({
  processedPSD,
  selectedLayerId,
  onLayerSelect,
  onLayerToggle,
  onLayerLock,
  onLayerReorder
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'zIndex' | 'name' | 'type'>('zIndex');

  // Get layer icon based on type
  const getLayerIcon = (layer: PSDLayer) => {
    switch (layer.type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'shape': return <Square className="w-4 h-4" />;
      case 'group': return <Layers className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  // Get layer category badge color
  const getCategoryColor = (layerId: string) => {
    const analysis = processedPSD.analysis.find(a => a.semantic);
    if (!analysis) return 'bg-gray-500';
    
    const category = analysis.semantic.category;
    switch (category) {
      case 'player': return 'bg-blue-500';
      case 'background': return 'bg-green-500';
      case 'stats': return 'bg-yellow-500';
      case 'logo': return 'bg-purple-500';
      case 'effect': return 'bg-pink-500';
      case 'border': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Sort layers based on selected criteria
  const sortedLayers = [...processedPSD.layers].sort((a, b) => {
    switch (sortBy) {
      case 'zIndex':
        return b.properties.zIndex - a.properties.zIndex; // Top to bottom
      case 'name':
        return a.name.localeCompare(b.name);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  // Toggle group expansion
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

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Layers ({processedPSD.layers.length})
          </h2>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#2a2a2a] text-white text-sm border border-gray-600 rounded px-2 py-1"
          >
            <option value="zIndex">Layer Order</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {sortedLayers.map((layer, index) => {
          const analysis = processedPSD.analysis[processedPSD.layers.indexOf(layer)];
          const isSelected = layer.id === selectedLayerId;
          const isGroup = layer.type === 'group';
          const isExpanded = expandedGroups.has(layer.id);

          return (
            <div key={layer.id} className="border-b border-gray-800">
              <div
                className={`
                  flex items-center p-3 cursor-pointer transition-colors
                  ${isSelected ? 'bg-blue-600/30 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/50'}
                `}
                onClick={() => onLayerSelect(layer.id)}
              >
                {/* Expand/Collapse for groups */}
                {isGroup && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(layer.id);
                    }}
                    className="text-gray-400 hover:text-white mr-2"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}

                {/* Layer Icon */}
                <div className="text-gray-400 mr-3">
                  {getLayerIcon(layer)}
                </div>

                {/* Layer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium truncate">
                      {layer.name}
                    </span>
                    
                    {/* Layer Type Badge */}
                    <Badge variant="outline" className="text-xs">
                      {layer.type.toUpperCase()}
                    </Badge>
                    
                    {/* Category Badge */}
                    {analysis && (
                      <Badge 
                        className={`text-xs text-white ${getCategoryColor(layer.id)}`}
                      >
                        {analysis.semantic.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {layer.properties.dimensions.width} × {layer.properties.dimensions.height}
                    {analysis && (
                      <span className="ml-2">
                        Depth: {analysis.spatial.depth.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Layer Controls */}
                <div className="flex items-center gap-2 ml-2">
                  {/* 3D Depth Indicator */}
                  {analysis && analysis.spatial.depth > 0 && (
                    <div title="3D Layer">
                      <Move3D className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                  
                  {/* Opacity */}
                  <span className="text-xs text-gray-400">
                    {Math.round(layer.properties.opacity * 100)}%
                  </span>
                  
                  {/* Lock Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerLock(layer.id, !layer.metadata.isLocked);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    {layer.metadata.isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggle(layer.id, !layer.metadata.isVisible);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    {layer.metadata.isVisible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Group Children (if expanded) */}
              {isGroup && isExpanded && layer.metadata.children && (
                <div className="pl-6 bg-gray-900/30">
                  {layer.metadata.children.map(childId => {
                    const childLayer = processedPSD.layers.find(l => l.id === childId);
                    if (!childLayer) return null;
                    
                    return (
                      <div
                        key={childId}
                        className="flex items-center p-2 text-sm text-gray-300 hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => onLayerSelect(childId)}
                      >
                        <div className="text-gray-500 mr-2">
                          {getLayerIcon(childLayer)}
                        </div>
                        <span>{childLayer.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Layer Details Panel */}
      {selectedLayerId && (
        <div className="border-t border-gray-700 p-4">
          {(() => {
            const selectedLayer = processedPSD.layers.find(l => l.id === selectedLayerId);
            const selectedAnalysis = processedPSD.analysis[processedPSD.layers.indexOf(selectedLayer!)];
            
            if (!selectedLayer) return null;

            return (
              <div>
                <h3 className="text-white font-medium mb-3">Layer Properties</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position:</span>
                    <span className="text-white">
                      {selectedLayer.properties.position.x}, {selectedLayer.properties.position.y}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white">
                      {selectedLayer.properties.dimensions.width} × {selectedLayer.properties.dimensions.height}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Z-Index:</span>
                    <span className="text-white">
                      {selectedLayer.properties.zIndex}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blend Mode:</span>
                    <span className="text-white">
                      {selectedLayer.properties.blendMode}
                    </span>
                  </div>
                  
                  {selectedAnalysis && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white capitalize">
                          {selectedAnalysis.semantic.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Importance:</span>
                        <span className="text-white capitalize">
                          {selectedAnalysis.semantic.importance}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">3D Depth:</span>
                        <span className="text-white">
                          {selectedAnalysis.spatial.depth.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};