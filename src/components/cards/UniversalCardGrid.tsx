
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid2X2, LayoutList, Table, Filter, SortAsc } from 'lucide-react';
import { UniversalCardDisplay, UniversalCardData, CardDisplayMode } from './UniversalCardDisplay';
import { cn } from '@/lib/utils';

interface UniversalCardGridProps {
  cards: UniversalCardData[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  defaultMode?: CardDisplayMode;
  onView?: (card: UniversalCardData) => void;
  onEdit?: (card: UniversalCardData) => void;
  onRemix?: (card: UniversalCardData) => void;
  onStage?: (card: UniversalCardData) => void;
  onFavorite?: (card: UniversalCardData) => void;
  onShare?: (card: UniversalCardData) => void;
  showModeToggle?: boolean;
  showFilters?: boolean;
  className?: string;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rarity', label: 'Rarity' }
];

export const UniversalCardGrid: React.FC<UniversalCardGridProps> = ({
  cards,
  loading = false,
  title,
  subtitle,
  defaultMode = 'grid',
  onView,
  onEdit,
  onRemix,
  onStage,
  onFavorite,
  onShare,
  showModeToggle = true,
  showFilters = true,
  className
}) => {
  const [viewMode, setViewMode] = useState<CardDisplayMode>(defaultMode);
  const [sortBy, setSortBy] = useState('newest');

  const getGridClassName = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
      case 'row':
        return 'space-y-4';
      case 'table':
        return 'bg-crd-dark border border-crd-mediumGray rounded-lg overflow-hidden';
      default:
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
    }
  };

  const renderModeToggle = () => (
    <div className="flex items-center bg-crd-mediumGray rounded-lg p-1">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('grid')}
        className={cn(
          'w-8 h-8 p-0',
          viewMode === 'grid' 
            ? 'bg-crd-blue text-white' 
            : 'text-crd-lightGray hover:text-white'
        )}
      >
        <Grid2X2 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'row' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('row')}
        className={cn(
          'w-8 h-8 p-0',
          viewMode === 'row' 
            ? 'bg-crd-blue text-white' 
            : 'text-crd-lightGray hover:text-white'
        )}
      >
        <LayoutList className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('table')}
        className={cn(
          'w-8 h-8 p-0',
          viewMode === 'table' 
            ? 'bg-crd-blue text-white' 
            : 'text-crd-lightGray hover:text-white'
        )}
      >
        <Table className="w-4 h-4" />
      </Button>
    </div>
  );

  if (loading && cards.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        {(title || subtitle) && (
          <div className="space-y-2">
            {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
            {subtitle && <p className="text-crd-lightGray">{subtitle}</p>}
          </div>
        )}
        
        <div className={getGridClassName()}>
          {Array(12).fill(0).map((_, i) => (
            <UniversalCardDisplay
              key={`skeleton-${i}`}
              card={{} as UniversalCardData}
              mode={viewMode}
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && cards.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="text-crd-mediumGray mb-4">
          <Grid2X2 className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No cards found</h3>
        <p className="text-crd-lightGray">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
          {subtitle && <p className="text-crd-lightGray">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {showFilters && (
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-crd-mediumGray border-crd-mediumGray text-white">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="border-crd-mediumGray text-crd-lightGray">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          )}

          {showModeToggle && renderModeToggle()}
        </div>
      </div>

      {/* Cards Grid */}
      <div className={getGridClassName()}>
        {viewMode === 'table' && (
          <div className="border-b border-crd-mediumGray p-4 bg-crd-mediumGray/20">
            <div className="flex items-center text-sm font-medium text-crd-lightGray">
              <span className="w-16">Image</span>
              <span className="flex-1 ml-4">Card Details</span>
              <span className="w-20">Price</span>
              <span className="w-20">Stock</span>
              <span className="w-32">Actions</span>
            </div>
          </div>
        )}
        
        {cards.map((card) => (
          <UniversalCardDisplay
            key={card.id}
            card={card}
            mode={viewMode}
            onView={onView}
            onEdit={onEdit}
            loading={loading}
          />
        ))}
      </div>

      {/* Load More */}
      {cards.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-crd-mediumGray text-crd-lightGray">
            Load More Cards
          </Button>
        </div>
      )}
    </div>
  );
};
