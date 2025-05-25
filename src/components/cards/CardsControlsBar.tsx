
import React from 'react';
import { CardsSearchFilters } from './CardsSearchFilters';
import { CardsViewModeToggle } from './CardsViewModeToggle';

type ViewMode = 'feed' | 'grid' | 'masonry';
type SortOption = 'recent' | 'popular' | 'price-high' | 'price-low' | 'trending';

interface CardsControlsBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFilters: boolean;
  onFilterToggle: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const CardsControlsBar: React.FC<CardsControlsBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showFilters,
  onFilterToggle,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
      <div className="flex-1">
        <CardsSearchFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          onFilterClick={onFilterToggle}
        />
      </div>
      <CardsViewModeToggle value={viewMode} onChange={onViewModeChange} />
    </div>
  );
};
