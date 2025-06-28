
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { layerCategorizationService, LayerCategory } from '@/services/psdProcessor/layerCategorization';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff,
  Mountain,
  User,
  Square,
  Zap,
  SquareMenu
} from 'lucide-react';

interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
}

const categoryIcons = {
  background: Mountain,
  character: User,
  ui: Square,
  text: SquareMenu,
  effects: Zap,
};

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['character', 'background']) // Start with important categories expanded
  );
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = layerCategorizationService.categorizeAllLayers(layers);
  
  const toggleCategory = (categoryType: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryType)) {
        newSet.delete(categoryType);
      } else {
        newSet.add(categoryType);
      }
      return newSet;
    });
  };

  const toggleAllInCategory = (category: LayerCategory) => {
    const allHidden = category.layers.every(catLayer => 
      hiddenLayers.has(catLayer.layer.id)
    );
    
    category.layers.forEach(catLayer => {
      if (allHidden && hiddenLayers.has(catLayer.layer.id)) {
        onLayerToggle(catLayer.layer.id); // Show all
      } else if (!allHidden && !hiddenLayers.has(catLayer.layer.id)) {
        onLayerToggle(catLayer.layer.id); // Hide all
      }
    });
  };

  const filteredCategories = categories.filter(category => {
    if (activeFilter === 'all') return category.totalLayers > 0;
    return category.type === activeFilter && category.totalLayers > 0;
  });

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <PSDCard variant="elevated">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Layer Categories</h3>
          <div className="flex flex-wrap gap-2">
            <PSDButton
              variant="ghost"
              size="sm"
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              All ({layers.length})
            </PSDButton>
            {categories.map(category => (
              <PSDButton
                key={category.type}
                variant="category"
                category={category.type}
                size="sm"
                active={activeFilter === category.type}
                onClick={() => setActiveFilter(category.type)}
              >
                {category.name} ({category.totalLayers})
              </PSDButton>
            ))}
          </div>
        </div>
      </PSDCard>

      {/* Layer Categories */}
      <div className="space-y-3">
        {filteredCategories.map(category => {
          const Icon = categoryIcons[category.type];
          const isExpanded = expandedCategories.has(category.type);
          const visibleLayers = category.layers.filter(catLayer => 
            !hiddenLayers.has(catLayer.layer.id)
          ).length;
          
          return (
            <PSDCard key={category.type} category={category.type} variant="default">
              {/* Category Header */}
              <div 
                className="p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => toggleCategory(category.type)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <Icon className="w-5 h-5 text-slate-300" />
                    <div>
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <p className="text-xs text-slate-400">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-600">
                      {visibleLayers}/{category.totalLayers}
                    </Badge>
                    <PSDButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAllInCategory(category);
                      }}
                    >
                      {visibleLayers === category.totalLayers ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </PSDButton>
                  </div>
                </div>
              </div>

              {/* Category Layers */}
              {isExpanded && (
                <div className="p-2 space-y-1">
                  {category.layers.map(catLayer => {
                    const layer = catLayer.layer;
                    const isSelected = selectedLayerId === layer.id;
                    const isHidden = hiddenLayers.has(layer.id);
                    
                    return (
                      <div
                        key={layer.id}
                        className={`
                          flex items-center gap-3 p-2 rounded cursor-pointer transition-all
                          ${isSelected 
                            ? 'bg-crd-green/20 border border-crd-green/50' 
                            : 'hover:bg-slate-800/50'
                          }
                          ${isHidden ? 'opacity-50' : ''}
                        `}
                        onClick={() => onLayerSelect(layer.id)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLayerToggle(layer.id);
                          }}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {isHidden ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {layer.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-slate-800 text-slate-400 border-slate-600">
                              {Math.round(layer.opacity * 100)}%
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {Math.round(catLayer.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </PSDCard>
          );
        })}
      </div>
    </div>
  );
};
