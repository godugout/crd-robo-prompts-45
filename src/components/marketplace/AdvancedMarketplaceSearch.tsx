
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal, Star, Heart } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SearchFilters {
  search: string;
  priceMin: string;
  priceMax: string;
  condition: string[];
  rarity: string[];
  listingType: string[];
  location: string;
  seller: string;
  tags: string[];
  featured: boolean;
  hasWatchers: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedMarketplaceSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  savedSearches?: Array<{ id: string; name: string; filters: SearchFilters }>;
}

export const AdvancedMarketplaceSearch: React.FC<AdvancedMarketplaceSearchProps> = ({
  onFiltersChange,
  savedSearches = []
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    priceMin: '',
    priceMax: '',
    condition: [],
    rarity: [],
    listingType: [],
    location: '',
    seller: '',
    tags: [],
    featured: false,
    hasWatchers: false,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newTag, setNewTag] = useState('');

  const conditions = ['mint', 'near_mint', 'excellent', 'good', 'fair', 'poor'];
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  const listingTypes = ['fixed_price', 'auction', 'make_offer'];

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const addTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      updateFilters({
        tags: [...filters.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFilters({
      tags: filters.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      search: '',
      priceMin: '',
      priceMax: '',
      condition: [],
      rarity: [],
      listingType: [],
      location: '',
      seller: '',
      tags: [],
      featured: false,
      hasWatchers: false,
      sortBy: 'created_at',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  return (
    <Card className="bg-crd-dark border-crd-mediumGray">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-crd-lightGray hover:text-white"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
          <Input
            placeholder="Search cards, sellers, or keywords..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10 bg-crd-mediumGray border-crd-lightGray text-white"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.featured ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters({ featured: !filters.featured })}
            className="text-xs"
          >
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Button>
          <Button
            variant={filters.hasWatchers ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters({ hasWatchers: !filters.hasWatchers })}
            className="text-xs"
          >
            <Heart className="w-3 h-3 mr-1" />
            Popular
          </Button>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min Price"
            type="number"
            value={filters.priceMin}
            onChange={(e) => updateFilters({ priceMin: e.target.value })}
            className="bg-crd-mediumGray border-crd-lightGray text-white"
          />
          <Input
            placeholder="Max Price"
            type="number"
            value={filters.priceMax}
            onChange={(e) => updateFilters({ priceMax: e.target.value })}
            className="bg-crd-mediumGray border-crd-lightGray text-white"
          />
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Listed</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="views_count">Most Viewed</SelectItem>
              <SelectItem value="watchers_count">Most Watched</SelectItem>
              <SelectItem value="title">Name</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.sortOrder} onValueChange={(value: 'asc' | 'desc') => updateFilters({ sortOrder: value })}>
            <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">High to Low</SelectItem>
              <SelectItem value="asc">Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-crd-lightGray hover:text-white">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Advanced Filters
              </span>
              <Filter className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Condition Filter */}
            <div>
              <label className="text-sm font-medium text-crd-lightGray mb-2 block">Condition</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition) => (
                  <Button
                    key={condition}
                    variant={filters.condition.includes(condition) ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters({
                      condition: toggleArrayFilter(filters.condition, condition)
                    })}
                    className="text-xs capitalize"
                  >
                    {condition.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="text-sm font-medium text-crd-lightGray mb-2 block">Rarity</label>
              <div className="flex flex-wrap gap-2">
                {rarities.map((rarity) => (
                  <Button
                    key={rarity}
                    variant={filters.rarity.includes(rarity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters({
                      rarity: toggleArrayFilter(filters.rarity, rarity)
                    })}
                    className="text-xs capitalize"
                  >
                    {rarity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Listing Type Filter */}
            <div>
              <label className="text-sm font-medium text-crd-lightGray mb-2 block">Listing Type</label>
              <div className="flex flex-wrap gap-2">
                {listingTypes.map((type) => (
                  <Button
                    key={type}
                    variant={filters.listingType.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters({
                      listingType: toggleArrayFilter(filters.listingType, type)
                    })}
                    className="text-xs capitalize"
                  >
                    {type.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-crd-lightGray mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 bg-crd-mediumGray border-crd-lightGray text-white"
                />
                <Button onClick={addTag} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-400"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location & Seller */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
              <Input
                placeholder="Seller username"
                value={filters.seller}
                onChange={(e) => updateFilters({ seller: e.target.value })}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div>
            <label className="text-sm font-medium text-crd-lightGray mb-2 block">Saved Searches</label>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((saved) => (
                <Button
                  key={saved.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters(saved.filters);
                    onFiltersChange(saved.filters);
                  }}
                  className="text-xs"
                >
                  {saved.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
