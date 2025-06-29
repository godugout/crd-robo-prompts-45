
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { LayerThumbnailView } from './LayerThumbnailView';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { 
  ArrowUpDown,
  ChevronDown
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

const sortOptions = [
  { value: 'position' as SortOption, label: 'Visual Order' },
  { value: 'name' as SortOption, label: 'Name' },
  { value: 'type' as SortOption, label: 'Type' },
  { value: 'semantic' as SortOption, label: 'Category' },
  { value: 'opacity' as SortOption, label: 'Opacity' },
  { value: 'size' as SortOption, label: 'Size' }
];

export const ElementsModeView: React.FC<ElementsModeViewProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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
        aValue = a.inferredDepth || a.bounds.top;
        bValue = b.inferredDepth || b.bounds.top;
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

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
    setShowSortDropdown(false);
  };

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Visual Order';

  return (
    <div className="space-y-4">
      {/* Compact Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="w-full bg-[#1a1f2e] border border-slate-700 rounded-lg p-3 flex items-center justify-between text-white hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-sm">Sort by: {currentSortLabel}</span>
            <span className="text-xs text-slate-400 capitalize">({sortDirection})</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showSortDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1f2e] border border-slate-700 rounded-lg shadow-lg z-10">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`
                  w-full text-left px-3 py-2 text-sm hover:bg-slate-700 transition-colors
                  ${sortBy === option.value ? 'text-crd-green bg-slate-800' : 'text-white'}
                  first:rounded-t-lg last:rounded-b-lg
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
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
