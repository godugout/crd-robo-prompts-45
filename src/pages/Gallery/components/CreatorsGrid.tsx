
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
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <p className="text-[#777E90] col-span-4 text-center py-8">No featured artists found</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {creators.map((creator, index) => (
        <Card key={index} className="bg-[#23262F] border-[#353945]">
          <CardHeader className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#353945] mb-2">
              {creator.avatarUrl && (
                <img 
                  src={creator.avatarUrl} 
                  alt={creator.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              )}
            </div>
            <CardTitle className="text-center text-[#FCFCFD]">{creator.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-2">
            <p className="text-[#777E90] text-sm">{creator.bio || 'Artist'}</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" size="sm" className="border-[#353945] text-white hover:bg-[#353945]">Follow</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
