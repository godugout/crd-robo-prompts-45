
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Grid, 
  List, 
  Heart, 
  Eye, 
  Users, 
  Star,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useCollections, useCollectionsRealtime } from '@/hooks/collections/useCollectionQueries';
import { LoadingState } from '@/components/common/LoadingState';
import type { Collection, CollectionFilters } from '@/types/collections';

interface CollectionGridProps {
  showUserCollections?: boolean;
  userId?: string;
  onCollectionClick?: (collection: Collection) => void;
  className?: string;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  showUserCollections = false,
  userId,
  onCollectionClick,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<CollectionFilters>({
    sortBy: 'updated_at',
    sortOrder: 'desc',
    limit: 20
  });

  // Enable real-time updates
  useCollectionsRealtime();

  const { data: collectionsData, isLoading, error } = useCollections({
    ...filters,
    ...(showUserCollections && userId ? { owner_id: userId } : { visibility: 'public' })
  });

  const collections = collectionsData?.collections || [];
  const total = collectionsData?.total || 0;

  const handleFilterChange = (key: keyof CollectionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, offset: 0 }));
  };

  const loadMore = () => {
    setFilters(prev => ({ 
      ...prev, 
      offset: (prev.offset || 0) + (prev.limit || 20)
    }));
  };

  if (isLoading && !collections.length) {
    return <LoadingState message="Loading collections..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load collections</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
            <Input
              placeholder="Search collections..."
              className="pl-10 bg-editor-dark border-crd-mediumGray text-crd-white"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger className="w-48 bg-editor-dark border-crd-mediumGray">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Recently Updated</SelectItem>
              <SelectItem value="created_at">Recently Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="views_count">Most Viewed</SelectItem>
              <SelectItem value="likes_count">Most Liked</SelectItem>
              <SelectItem value="completion_rate">Completion Rate</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collections Display */}
      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-crd-lightGray mb-4">No collections found</p>
          {showUserCollections && (
            <Button onClick={() => window.location.href = '/collections/new'}>
              Create Your First Collection
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                viewMode={viewMode}
                onClick={() => onCollectionClick?.(collection)}
              />
            ))}
          </div>

          {/* Load More */}
          {collections.length < total && (
            <div className="text-center">
              <Button 
                onClick={loadMore}
                disabled={isLoading}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                {isLoading ? 'Loading...' : `Load More (${collections.length}/${total})`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface CollectionCardProps {
  collection: Collection;
  viewMode: 'grid' | 'list';
  onClick?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ 
  collection, 
  viewMode, 
  onClick 
}) => {
  const isGrid = viewMode === 'grid';

  return (
    <Card 
      className={`bg-editor-dark border-crd-mediumGray/20 hover:border-crd-green/50 transition-all cursor-pointer group ${
        isGrid ? 'aspect-[4/3]' : 'h-32'
      }`}
      onClick={onClick}
    >
      <CardContent className={`p-4 h-full ${isGrid ? 'flex flex-col' : 'flex items-center gap-4'}`}>
        {/* Cover Image */}
        <div className={`relative overflow-hidden rounded-lg bg-crd-mediumGray/20 ${
          isGrid ? 'flex-1 mb-4' : 'w-20 h-20 flex-shrink-0'
        }`}>
          {collection.cover_image_url ? (
            <img 
              src={collection.cover_image_url} 
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Grid className="w-8 h-8 text-crd-lightGray" />
            </div>
          )}
          
          {/* Featured Badge */}
          {collection.featured_until && new Date(collection.featured_until) > new Date() && (
            <Badge className="absolute top-2 left-2 bg-crd-green text-black">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className={`${isGrid ? '' : 'flex-1'}`}>
          <h3 className="font-semibold text-crd-white mb-1 line-clamp-2">
            {collection.title}
          </h3>
          
          {collection.description && (
            <p className="text-sm text-crd-lightGray mb-3 line-clamp-2">
              {collection.description}
            </p>
          )}

          {/* Tags */}
          {collection.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {collection.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {collection.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{collection.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-crd-lightGray">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {collection.views_count}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {collection.likes_count}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {Math.round(collection.completion_rate)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
