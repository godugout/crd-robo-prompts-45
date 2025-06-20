
import React from 'react';
import { CardFilters, CardRarity, CardType, CARD_TYPE_LABELS } from '@/types/cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RarityBadge } from './RarityBadge';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardFiltersProps {
  filters: CardFilters;
  onFiltersChange: (filters: CardFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const RARITY_OPTIONS: CardRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest First' },
  { value: 'name', label: 'Name' },
  { value: 'current_market_value', label: 'Price' },
  { value: 'rarity', label: 'Rarity' }
];

export const CardFiltersComponent: React.FC<CardFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className
}) => {
  const updateFilter = (key: keyof CardFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleRarity = (rarity: CardRarity) => {
    const currentRarities = filters.rarity || [];
    const newRarities = currentRarities.includes(rarity)
      ? currentRarities.filter(r => r !== rarity)
      : [...currentRarities, rarity];
    
    updateFilter('rarity', newRarities.length > 0 ? newRarities : undefined);
  };

  const toggleCardType = (cardType: CardType) => {
    const currentTypes = filters.card_type || [];
    const newTypes = currentTypes.includes(cardType)
      ? currentTypes.filter(t => t !== cardType)
      : [...currentTypes, cardType];
    
    updateFilter('card_type', newTypes.length > 0 ? newTypes : undefined);
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.rarity?.length ||
    filters.card_type?.length ||
    filters.price_min !== undefined ||
    filters.price_max !== undefined ||
    filters.power_min !== undefined ||
    filters.power_max !== undefined ||
    filters.is_featured
  );

  return (
    <div className={cn('space-y-6 bg-crd-dark border border-crd-mediumGray rounded-lg p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-crd-lightGray hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
        <Input
          placeholder="Search cards by name, description, or abilities..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value || undefined)}
          className="pl-10 bg-crd-mediumGray border-crd-mediumGray text-white"
        />
      </div>

      {/* Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Sort By</label>
          <Select
            value={filters.sort_by || 'created_at'}
            onValueChange={(value) => updateFilter('sort_by', value as any)}
          >
            <SelectTrigger className="bg-crd-mediumGray border-crd-mediumGray text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Order</label>
          <Button
            variant="outline"
            onClick={() => updateFilter('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}
            className="w-full justify-center border-crd-mediumGray text-crd-lightGray hover:text-white"
          >
            {filters.sort_order === 'asc' ? (
              <>
                <SortAsc className="w-4 h-4 mr-2" />
                Ascending
              </>
            ) : (
              <>
                <SortDesc className="w-4 h-4 mr-2" />
                Descending
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Rarity Filter */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Rarity</label>
        <div className="flex flex-wrap gap-2">
          {RARITY_OPTIONS.map(rarity => {
            const isSelected = filters.rarity?.includes(rarity);
            return (
              <button
                key={rarity}
                onClick={() => toggleRarity(rarity)}
                className={cn(
                  'transition-all duration-200',
                  isSelected ? 'ring-2 ring-crd-green' : 'opacity-50 hover:opacity-100'
                )}
              >
                <RarityBadge rarity={rarity} size="sm" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Type Filter */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Card Type</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CARD_TYPE_LABELS).map(([type, label]) => {
            const isSelected = filters.card_type?.includes(type as CardType);
            return (
              <Badge
                key={type}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  isSelected 
                    ? 'bg-crd-green text-black' 
                    : 'border-crd-mediumGray text-crd-lightGray hover:text-white hover:border-crd-green'
                )}
                onClick={() => toggleCardType(type as CardType)}
              >
                {label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type="number"
              placeholder="Min price"
              value={filters.price_min || ''}
              onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max price"
              value={filters.price_max || ''}
              onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>
        </div>
      </div>

      {/* Power Range */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Power Range</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type="number"
              placeholder="Min power"
              value={filters.power_min || ''}
              onChange={(e) => updateFilter('power_min', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max power"
              value={filters.power_max || ''}
              onChange={(e) => updateFilter('power_max', e.target.value ? Number(e.target.value) : undefined)}
              className="bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">Featured Cards Only</label>
        <Button
          variant={filters.is_featured ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('is_featured', filters.is_featured ? undefined : true)}
          className={filters.is_featured ? 'bg-crd-green text-black' : 'border-crd-mediumGray text-crd-lightGray'}
        >
          {filters.is_featured ? 'On' : 'Off'}
        </Button>
      </div>
    </div>
  );
};
