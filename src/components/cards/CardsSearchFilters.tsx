
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
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-light w-4 h-4 pointer-events-none" />
        <Input
          placeholder="Search cards, creators, or collections..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="crd-input pl-10 h-12 text-base bg-crd-medium-dark border-crd-medium text-crd-lightest placeholder:text-crd-light focus:ring-2 focus:ring-crd-blue focus:border-transparent"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] h-12 bg-crd-medium-dark border-crd-medium text-crd-lightest hover:bg-crd-medium transition-colors">
            <SelectValue className="text-crd-lightest" />
          </SelectTrigger>
          <SelectContent className="bg-crd-dark border-crd-medium-dark shadow-xl">
            <SelectItem value="recent" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark">
              Recently added
            </SelectItem>
            <SelectItem value="popular" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark">
              Most popular
            </SelectItem>
            <SelectItem value="price-high" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark">
              Price: High to Low
            </SelectItem>
            <SelectItem value="price-low" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark">
              Price: Low to High
            </SelectItem>
            <SelectItem value="trending" className="text-crd-lightest hover:bg-crd-medium-dark focus:bg-crd-medium-dark">
              Trending
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={onFilterClick}
          className="crd-btn-outline h-12 px-4 min-w-[100px] font-medium"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
      </div>
    </div>
  );
};
