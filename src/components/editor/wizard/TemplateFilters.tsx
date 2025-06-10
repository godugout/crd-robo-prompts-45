
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Star, Filter } from 'lucide-react';

interface TemplateFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  searchTerm: string;
  showPremiumOnly: boolean;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (term: string) => void;
  onPremiumToggle: (show: boolean) => void;
  onClearFilters: () => void;
}

export const TemplateFilters = ({
  categories,
  selectedCategory,
  searchTerm,
  showPremiumOnly,
  onCategoryChange,
  onSearchChange,
  onPremiumToggle,
  onClearFilters
}: TemplateFiltersProps) => {
  const hasActiveFilters = selectedCategory || searchTerm || showPremiumOnly;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-editor-tool border-editor-border text-crd-white"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-crd-lightGray" />
          <span className="text-sm text-crd-lightGray">Filters:</span>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => onCategoryChange(null)}
            className={
              selectedCategory === null
                ? "bg-crd-green text-crd-dark"
                : "border-editor-border text-crd-lightGray hover:text-white"
            }
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => onCategoryChange(category)}
              className={
                selectedCategory === category
                  ? "bg-crd-green text-crd-dark"
                  : "border-editor-border text-crd-lightGray hover:text-white"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Premium Filter */}
        <Button
          size="sm"
          variant={showPremiumOnly ? "default" : "outline"}
          onClick={() => onPremiumToggle(!showPremiumOnly)}
          className={
            showPremiumOnly
              ? "bg-yellow-500 text-crd-dark"
              : "border-editor-border text-crd-lightGray hover:text-white"
          }
        >
          <Star className="w-3 h-3 mr-1" />
          Premium Only
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearFilters}
            className="text-crd-lightGray hover:text-white"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green">
              Category: {selectedCategory}
              <button
                onClick={() => onCategoryChange(null)}
                className="ml-1 hover:bg-crd-green/30 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {searchTerm && (
            <Badge className="bg-crd-blue/20 text-crd-blue border-crd-blue">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:bg-crd-blue/30 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {showPremiumOnly && (
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500">
              Premium Only
              <button
                onClick={() => onPremiumToggle(false)}
                className="ml-1 hover:bg-yellow-500/30 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
