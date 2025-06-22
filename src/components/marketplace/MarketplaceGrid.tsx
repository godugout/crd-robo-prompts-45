
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MapPin } from 'lucide-react';
import { useMarketplace } from '@/hooks/marketplace/useMarketplace';
import type { MarketplaceListing } from '@/types/marketplace';

interface MarketplaceGridProps {
  filters?: any;
  onListingSelect?: (listing: MarketplaceListing) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  filters,
  onListingSelect
}) => {
  const { listings, loading, refetch } = useMarketplace();
  const [watchedListings, setWatchedListings] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (filters) {
      refetch(filters);
    }
  }, [filters, refetch]);

  const handleWatchListing = async (listingId: string) => {
    // Implementation for watching/unwatching listings
    setWatchedListings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listingId)) {
        newSet.delete(listingId);
      } else {
        newSet.add(listingId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <Card 
          key={listing.id} 
          className="group cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onListingSelect?.(listing)}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
            {listing.card?.image_url && (
              <img
                src={listing.card.image_url}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            {listing.featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500">
                Featured
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                handleWatchListing(listing.id);
              }}
            >
              <Heart 
                className={`w-4 h-4 ${
                  watchedListings.has(listing.id) 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600'
                }`} 
              />
            </Button>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {listing.condition}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {listing.card?.rarity}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ${listing.price.toFixed(2)}
                </span>
                {listing.shipping_cost && (
                  <span className="text-sm text-gray-500">
                    +${listing.shipping_cost.toFixed(2)} shipping
                  </span>
                )}
              </div>
              
              {listing.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {listing.location}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {listing.views_count} views
                </div>
                <div className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {listing.watchers_count} watching
                </div>
              </div>
              
              {listing.listing_type === 'auction' && listing.auction_end_time && (
                <div className="text-sm text-orange-600 font-medium">
                  Ends: {new Date(listing.auction_end_time).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {listings.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">No listings found</p>
          <p className="text-gray-400">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};
