
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CardsSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onFilterClick: () => void;
}

export const CardsSearchFilters: React.FC<CardsSearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onFilterClick
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1 crd-search">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-crd-light w-5 h-5 pointer-events-none z-10" />
        <Input
          placeholder="Search cards, creators, or collections..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="crd-search-input h-12 text-base font-medium"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] h-12 bg-crd-medium-dark/80 border-crd-medium text-crd-lightest hover:bg-crd-medium transition-colors font-medium backdrop-blur-sm">
            <SelectValue className="text-crd-lightest font-medium" />
          </SelectTrigger>
          <SelectContent className="bg-crd-dark border-crd-medium-dark shadow-2xl backdrop-blur-md">
            <SelectItem value="recent" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark font-medium">
              Recently added
            </SelectItem>
            <SelectItem value="popular" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark font-medium">
              Most popular
            </SelectItem>
            <SelectItem value="price-high" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark font-medium">
              Price: High to Low
            </SelectItem>
            <SelectItem value="price-low" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark font-medium">
              Price: Low to High
            </SelectItem>
            <SelectItem value="trending" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark font-medium">
              Trending
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={onFilterClick}
          className="crd-btn-outline h-12 px-6 min-w-[120px]"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline font-semibold">Filter</span>
          <span className="sm:hidden font-semibold">Filter</span>
        </Button>
      </div>
    </div>
  );
};
