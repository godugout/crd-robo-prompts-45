
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Collection {
  title: string;
  description?: string;
  coverImageUrl?: string;
}

interface CollectionsGridProps {
  collections: Collection[];
  loading: boolean;
}

export const CollectionsGrid: React.FC<CollectionsGridProps> = ({
  collections,
  loading
}) => {
  if (loading) {
    return (
      <>
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </>
    );
  }

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <>
      {collections.map((collection, index) => (
        <Card key={index} className="bg-[#23262F] border-[#353945] overflow-hidden">
          <div 
            className="h-32 bg-cover bg-center"
            style={{ 
              backgroundImage: collection.coverImageUrl 
                ? `url(${collection.coverImageUrl})` 
                : 'url(https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80)'
            }}
          ></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[#FCFCFD] text-sm">{collection.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-[#777E90] text-xs line-clamp-2">{collection.description || 'A beautiful collection of cards'}</p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" size="sm" className="w-full border-[#353945] text-white hover:bg-[#353945] text-xs">View</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
