
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerThumbnailView } from './LayerThumbnailView';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { 
  ArrowUpDown,
  SortAsc,
  SortDesc
} from 'lucide-react';

type SortOption = 'name' | 'type' | 'opacity' | 'size' | 'semantic' | 'position';
type SortDirection = 'asc' | 'desc';

interface ElementsModeViewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const ElementsModeView: React.FC<ElementsModeViewProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortOptions = [
    { value: 'name' as SortOption, label: 'Name' },
    { value: 'type' as SortOption, label: 'Type' },
    { value: 'semantic' as SortOption, label: 'Semantic' },
    { value: 'opacity' as SortOption, label: 'Opacity' },
    { value: 'size' as SortOption, label: 'Size' },
    { value: 'position' as SortOption, label: 'Position' }
  ];

  const sortedLayers = [...layers].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'semantic':
        aValue = a.semanticType || 'unknown';
        bValue = b.semanticType || 'unknown';
        break;
      case 'opacity':
        aValue = a.opacity;
        bValue = b.opacity;
        break;
      case 'size':
        aValue = (a.bounds.right - a.bounds.left) * (a.bounds.bottom - a.bounds.top);
        bValue = (b.bounds.right - b.bounds.left) * (b.bounds.bottom - b.bounds.top);
        break;
      case 'position':
        aValue = a.bounds.top * 10000 + a.bounds.left; // Sort by Y then X
        bValue = b.bounds.top * 10000 + b.bounds.left;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Sorting Controls */}
      <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Sort by:</span>
          <div className="flex items-center gap-1 text-slate-400">
            {sortDirection === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
            <span className="text-xs capitalize">{sortDirection}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {sortOptions.map((option) => (
            <PSDButton
              key={option.value}
              variant={sortBy === option.value ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleSort(option.value)}
              className="text-xs"
            >
              <ArrowUpDown className="w-3 h-3 mr-1" />
              {option.label}
            </PSDButton>
          ))}
        </div>
      </div>

      {/* Layer List */}
      <LayerThumbnailView
        layers={sortedLayers}
        selectedLayerId={selectedLayerId}
        hiddenLayers={hiddenLayers}
        onLayerSelect={onLayerSelect}
        onLayerToggle={onLayerToggle}
      />
    </div>
  );
};
