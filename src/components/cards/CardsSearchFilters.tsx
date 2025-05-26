
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
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
        <Input
          placeholder="Search cards, creators, or collections..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px] bg-crd-dark border-crd-mediumGray text-crd-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-crd-dark border-crd-mediumGray">
            <SelectItem value="recent">Recently added</SelectItem>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="text-crd-lightGray border-crd-mediumGray"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};
