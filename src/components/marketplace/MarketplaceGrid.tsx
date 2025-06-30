
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MapPin, Wifi, WifiOff } from 'lucide-react';
import { useMarketplace } from '@/hooks/marketplace/useMarketplace';
import { MarketplaceGridSkeleton } from '@/components/marketplace/MarketplaceLoadingStates';
import { MobileAuctionInterface } from '@/components/marketplace/MobileAuctionInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import type { MarketplaceListing } from '@/types/marketplace';
import { toast } from 'sonner';

interface MarketplaceGridProps {
  filters?: any;
  onListingSelect?: (listing: MarketplaceListing) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  filters,
  onListingSelect
}) => {
  const { listings, loading, error, refetch } = useMarketplace();
  const [watchedListings, setWatchedListings] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const isMobile = useIsMobile();

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (retryCount > 0) {
        toast.success('Connection restored! Refreshing listings...');
        refetch();
        setRetryCount(0);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Lost connection. Some features may not work.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refetch, retryCount]);

  useEffect(() => {
    if (filters) {
      refetch(filters);
    }
  }, [filters, refetch]);

  const handleWatchListing = async (listingId: string) => {
    if (!isOnline) {
      toast.error('Cannot watch listings while offline');
      return;
    }

    try {
      setWatchedListings(prev => {
        const newSet = new Set(prev);
        if (newSet.has(listingId)) {
          newSet.delete(listingId);
          toast.success('Removed from watchlist');
        } else {
          newSet.add(listingId);
          toast.success('Added to watchlist');
        }
        return newSet;
      });
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  if (loading) {
    return <MarketplaceGridSkeleton />;
  }

  if (error) {
    return (
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-400">
            <WifiOff className="w-6 h-6" />
            <span className="text-lg font-semibold">Failed to load listings</span>
          </div>
          <p className="text-crd-lightGray">
            {!isOnline ? 'Check your internet connection' : 'Something went wrong while loading the marketplace'}
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              {retryCount > 0 ? `Retry (${retryCount})` : 'Retry'}
            </Button>
            {retryCount > 2 && (
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Network Status Indicator */}
      {!isOnline && (
        <Card className="bg-yellow-900 border-yellow-600 mb-4">
          <CardContent className="p-4 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-100">You're offline. Listings may be outdated.</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <Card 
            key={listing.id} 
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 bg-crd-dark border-crd-mediumGray hover:border-crd-green"
            onClick={() => onListingSelect?.(listing)}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
              {listing.card?.image_url && (
                <img
                  src={listing.card.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
              {listing.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                  Featured
                </Badge>
              )}
              {listing.listing_type === 'auction' && (
                <Badge className="absolute top-2 right-12 bg-red-500">
                  Live Auction
                </Badge>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWatchListing(listing.id);
                }}
              >
                <Heart 
                  className={`w-4 h-4 ${
                    watchedListings.has(listing.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-white'
                  }`} 
                />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg truncate text-white">{listing.title}</h3>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs border-crd-lightGray text-crd-lightGray">
                    {listing.condition}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {listing.card?.rarity}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-crd-green">
                    ${listing.price.toFixed(2)}
                  </span>
                  {listing.shipping_cost && (
                    <span className="text-sm text-crd-lightGray">
                      +${listing.shipping_cost.toFixed(2)} shipping
                    </span>
                  )}
                </div>
                
                {listing.location && (
                  <div className="flex items-center text-sm text-crd-lightGray">
                    <MapPin className="w-3 h-3 mr-1" />
                    {listing.location}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-crd-lightGray">
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
                  <div className="text-sm text-orange-400 font-medium">
                    Ends: {new Date(listing.auction_end_time).toLocaleDateString()}
                  </div>
                )}

                {/* Mobile Auction Quick Actions */}
                {isMobile && listing.listing_type === 'auction' && (
                  <div className="pt-2 border-t border-crd-mediumGray">
                    <MobileAuctionInterface
                      listingId={listing.id}
                      currentPrice={listing.current_bid || listing.starting_bid || listing.price}
                      endTime={listing.auction_end_time || ''}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {listings.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <p className="text-crd-lightGray text-lg">No listings found</p>
            <p className="text-crd-lightGray">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </>
  );
};
