
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  CheckSquare,
  Square,
  Trash2
} from 'lucide-react';
import { SortOption } from '@/hooks/useCardCatalog/types';

interface SmartCardGridControlsProps {
  filteredCardsCount: number;
  selectedCardsCount: number;
  viewMode: 'grid' | 'list';
  sortBy: SortOption;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sort: SortOption) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  isAllSelected: boolean;
}

export const SmartCardGridControls: React.FC<SmartCardGridControlsProps> = ({
  filteredCardsCount,
  selectedCardsCount,
  viewMode,
  sortBy,
  onViewModeChange,
  onSortChange,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  isAllSelected
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">
            {filteredCardsCount} cards detected
          </span>
          {selectedCardsCount > 0 && (
            <Badge variant="secondary" className="bg-crd-green text-black">
              {selectedCardsCount} selected
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Selection Controls */}
        {selectedCardsCount > 0 && (
          <>
            <Button
              onClick={onClearSelection}
              variant="outline"
              size="sm"
              className="border-editor-border text-white"
            >
              Clear Selection
            </Button>
            <Button
              onClick={onDeleteSelected}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </>
        )}

        <Button
          onClick={isAllSelected ? onClearSelection : onSelectAll}
          variant="outline"
          size="sm"
          className="border-editor-border text-white"
        >
          {isAllSelected ? (
            <CheckSquare className="w-4 h-4 mr-2" />
          ) : (
            <Square className="w-4 h-4 mr-2" />
          )}
          Select All
        </Button>

        {/* Sort Controls */}
        <Button
          onClick={() => onSortChange({
            field: sortBy.field,
            direction: sortBy.direction === 'asc' ? 'desc' : 'asc'
          })}
          variant="outline"
          size="sm"
          className="border-editor-border text-white"
        >
          {sortBy.direction === 'asc' ? (
            <SortAsc className="w-4 h-4 mr-2" />
          ) : (
            <SortDesc className="w-4 h-4 mr-2" />
          )}
          Sort by {sortBy.field}
        </Button>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-editor-border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="border-0 rounded-r-none"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="border-0 rounded-l-none"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
