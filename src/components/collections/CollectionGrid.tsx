
import React, { useState } from 'react';
import { usePublicCollections, useUserCollections } from '@/hooks/collections/useCollectionQueries';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Users, Calendar } from 'lucide-react';
import { LoadingState } from '@/components/common/LoadingState';

interface CollectionGridProps {
  variant?: 'public' | 'user';
  userId?: string;
  onCollectionSelect?: (collectionId: string) => void;
  className?: string;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  variant = 'public',
  userId,
  onCollectionSelect,
  className = ''
}) => {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const { data: publicCollections, isLoading: publicLoading } = usePublicCollections(20);
  const { data: userCollections, isLoading: userLoading } = useUserCollections(
    variant === 'user' ? (userId || user?.id || '') : ''
  );

  const collections = variant === 'public' ? publicCollections : userCollections;
  const isLoading = variant === 'public' ? publicLoading : userLoading;

  if (isLoading) {
    return <LoadingState message="Loading collections..." />;
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-bold text-white mb-2">No collections found</h3>
        <p className="text-crd-lightGray">
          {variant === 'user' ? 'Create your first collection!' : 'Check back later for new collections.'}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'recent', 'popular', 'complete'].map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
            className={
              selectedFilter === filter
                ? 'bg-crd-green text-black'
                : 'border-crd-mediumGray text-crd-lightGray hover:text-white'
            }
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Masonry Grid Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="break-inside-avoid bg-crd-dark border-crd-mediumGray hover:border-crd-green/50 transition-colors cursor-pointer"
            onClick={() => onCollectionSelect?.(collection.id)}
          >
            {/* Cover Image */}
            {collection.cover_image_url && (
              <div className="aspect-video bg-crd-mediumGray rounded-t-lg overflow-hidden">
                <img
                  src={collection.cover_image_url}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <CardContent className="p-4">
              {/* Title & Description */}
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {collection.title}
              </h3>
              
              {collection.description && (
                <p className="text-sm text-crd-lightGray mb-3 line-clamp-3">
                  {collection.description}
                </p>
              )}

              {/* Stats Row */}
              <div className="flex items-center justify-between mb-3 text-xs text-crd-lightGray">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{collection.views_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{collection.likes_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>0</span> {/* Followers count will be added */}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-crd-lightGray mb-1">
                  <span>Completion</span>
                  <span>{Math.round(collection.completion_rate || 0)}%</span>
                </div>
                <div className="w-full bg-crd-mediumGray rounded-full h-2">
                  <div
                    className="bg-crd-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${collection.completion_rate || 0}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              {collection.tags && collection.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {collection.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-crd-blue/20 text-crd-blue border-crd-blue/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {collection.tags.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-crd-mediumGray text-crd-lightGray"
                    >
                      +{collection.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Visibility Badge */}
              <div className="flex items-center justify-between">
                <Badge
                  variant={collection.visibility === 'public' ? 'default' : 'secondary'}
                  className={
                    collection.visibility === 'public'
                      ? 'bg-crd-green text-black'
                      : 'bg-crd-mediumGray text-crd-lightGray'
                  }
                >
                  {collection.visibility}
                </Badge>
                
                {collection.is_template && (
                  <Badge variant="outline" className="border-crd-orange text-crd-orange">
                    Template
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
