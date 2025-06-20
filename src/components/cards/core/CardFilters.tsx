
import React from 'react';
import { CardFilters, CardRarity } from '@/types/cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface CardFiltersComponentProps {
  filters: CardFilters;
  onFiltersChange: (filters: CardFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const RARITY_OPTIONS: CardRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const CardFiltersComponent: React.FC<CardFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ''
}) => {
  const updateFilter = <K extends keyof CardFilters>(key: K, value: CardFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleRarity = (rarity: CardRarity) => {
    const currentRarities = filters.rarity || [];
    const newRarities = currentRarities.includes(rarity)
      ? currentRarities.filter(r => r !== rarity)
      : [...currentRarities, rarity];
    updateFilter('rarity', newRarities.length > 0 ? newRarities : undefined);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
  );

  return (
    <Card className={`bg-crd-dark border-crd-mediumGray ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-crd-lightGray hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-crd-lightGray">Search</Label>
          <Input
            placeholder="Search cards..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            className="bg-crd-mediumGray border-crd-mediumGray text-white"
          />
        </div>

        <Separator className="bg-crd-mediumGray" />

        {/* Rarity */}
        <div className="space-y-3">
          <Label className="text-crd-lightGray">Rarity</Label>
          <div className="grid grid-cols-2 gap-2">
            {RARITY_OPTIONS.map((rarity) => (
              <div key={rarity} className="flex items-center space-x-2">
                <Checkbox
                  id={`rarity-${rarity}`}
                  checked={filters.rarity?.includes(rarity) || false}
                  onCheckedChange={() => toggleRarity(rarity)}
                  className="border-crd-mediumGray"
                />
                <Label
                  htmlFor={`rarity-${rarity}`}
                  className="text-sm text-crd-lightGray capitalize cursor-pointer"
                >
                  {rarity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-crd-mediumGray" />

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-crd-lightGray">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Min"
                type="number"
                value={filters.price_min || ''}
                onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
                className="bg-crd-mediumGray border-crd-mediumGray text-white"
              />
            </div>
            <div>
              <Input
                placeholder="Max"
                type="number"
                value={filters.price_max || ''}
                onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
                className="bg-crd-mediumGray border-crd-mediumGray text-white"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-crd-mediumGray" />

        {/* Featured Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={filters.is_featured || false}
            onCheckedChange={(checked) => updateFilter('is_featured', checked ? true : undefined)}
            className="border-crd-mediumGray"
          />
          <Label htmlFor="featured" className="text-sm text-crd-lightGray cursor-pointer">
            Featured cards only
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
