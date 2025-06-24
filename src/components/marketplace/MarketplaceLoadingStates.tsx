
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ListingCardSkeleton: React.FC = () => (
  <Card className="bg-crd-dark border-crd-mediumGray">
    <div className="aspect-[3/4] bg-crd-mediumGray animate-pulse rounded-t-lg" />
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4 bg-crd-mediumGray" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16 bg-crd-mediumGray" />
        <Skeleton className="h-3 w-12 bg-crd-mediumGray" />
      </div>
      <Skeleton className="h-6 w-20 bg-crd-mediumGray" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20 bg-crd-mediumGray" />
        <Skeleton className="h-3 w-16 bg-crd-mediumGray" />
      </div>
    </CardContent>
  </Card>
);

export const MarketplaceGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ListingCardSkeleton key={i} />
    ))}
  </div>
);

export const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 bg-crd-mediumGray" />
              <Skeleton className="h-8 w-16 bg-crd-mediumGray" />
              <Skeleton className="h-3 w-20 bg-crd-mediumGray" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="bg-crd-dark border-crd-mediumGray">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 bg-crd-mediumGray mb-4" />
        <Skeleton className="h-64 w-full bg-crd-mediumGray" />
      </CardContent>
    </Card>
  </div>
);

export const AuctionBiddingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 bg-crd-mediumGray" />
      <Skeleton className="h-8 w-32 bg-crd-mediumGray" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center p-3 bg-crd-mediumGray rounded">
          <Skeleton className="h-4 w-20 bg-crd-lightGray" />
          <Skeleton className="h-4 w-16 bg-crd-lightGray" />
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-10 flex-1 bg-crd-mediumGray" />
      <Skeleton className="h-10 w-20 bg-crd-mediumGray" />
    </div>
  </div>
);
