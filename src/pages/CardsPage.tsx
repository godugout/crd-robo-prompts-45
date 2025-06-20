
import React, { useState } from 'react';
import { CardGrid } from '@/components/cards/core/CardGrid';
import { CardFiltersComponent } from '@/components/cards/core/CardFilters';
import { CardFilters } from '@/types/cards';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid2X2, LayoutList, Filter, SortAsc } from 'lucide-react';
import { cn } from '@/lib/utils';

const CardsPage: React.FC = () => {
  const [filters, setFilters] = useState<CardFilters>({
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    setFilters({
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  const handleCardView = (card: any) => {
    // Navigate to card detail page
    window.location.href = `/cards/${card.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Card Collection</h1>
          <p className="text-crd-lightGray">
            Discover, collect, and trade premium digital cards from top creators
          </p>
        </div>

        {/* Controls Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-crd-mediumGray rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'w-10 h-8 p-0',
                  viewMode === 'grid' 
                    ? 'bg-crd-green text-black' 
                    : 'text-crd-lightGray hover:text-white'
                )}
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  'w-10 h-8 p-0',
                  viewMode === 'list' 
                    ? 'bg-crd-green text-black' 
                    : 'text-crd-lightGray hover:text-white'
                )}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-crd-mediumGray text-crd-lightGray hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Quick Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-crd-lightGray" />
            <Select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                setFilters(prev => ({
                  ...prev,
                  sort_by: sortBy as any,
                  sort_order: sortOrder as any
                }));
              }}
            >
              <SelectTrigger className="w-48 bg-crd-mediumGray border-crd-mediumGray text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="current_market_value-desc">Price: High to Low</SelectItem>
                <SelectItem value="current_market_value-asc">Price: Low to High</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <CardFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <CardGrid
              filters={filters}
              variant={viewMode}
              onCardView={handleCardView}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
