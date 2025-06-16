
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Creator {
  name: string;
  bio?: string;
  avatarUrl?: string;
}

interface CreatorsGridProps {
  creators: Creator[];
  loading: boolean;
}

export const CreatorsGrid: React.FC<CreatorsGridProps> = ({
  creators,
  loading
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-crd-darkGray border border-crd-mediumGray rounded-xl p-6">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4 bg-crd-mediumGray" />
            <Skeleton className="h-6 w-32 mx-auto mb-2 bg-crd-mediumGray" />
            <Skeleton className="h-4 w-24 mx-auto mb-4 bg-crd-mediumGray" />
            <Skeleton className="h-10 w-20 mx-auto bg-crd-mediumGray" />
          </div>
        ))}
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-crd-darkGray rounded-xl mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-crd-lightGray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-crd-white mb-2">No Featured Artists</h3>
        <p className="text-crd-lightGray">Check back soon for amazing creators</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {creators.map((creator, index) => (
        <Card key={index} className="bg-crd-darkGray border border-crd-mediumGray rounded-xl hover:border-crd-green/50 transition-all duration-200 hover:shadow-lg hover:shadow-crd-green/10">
          <CardHeader className="flex flex-col items-center pb-4">
            <div className="w-16 h-16 rounded-full bg-crd-mediumGray mb-4 overflow-hidden">
              {creator.avatarUrl ? (
                <img 
                  src={creator.avatarUrl} 
                  alt={creator.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-crd-lightGray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <CardTitle className="text-center text-crd-white text-lg font-semibold">{creator.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-4">
            <p className="text-crd-lightGray text-sm">{creator.bio || 'Digital Artist'}</p>
          </CardContent>
          <CardFooter className="justify-center pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black transition-all duration-200 font-medium"
            >
              Follow
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
