
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, Image, Grid, List, Plus, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingState } from '@/components/common/LoadingState';
import { handleApiError } from '@/utils/toast-handlers';
import { useUser } from '@/hooks/use-user';

const Collections = () => {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections', user?.id],
    queryFn: async () => {
      // Mock implementation - in a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    },
    enabled: !!user?.id
  });
  
  if (isLoading) {
    return <LoadingState message="Loading your collections..." />;
  }
  
  if (error) {
    handleApiError(error, 'Failed to load collections');
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-[#121212]">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-8">Discover <span className="text-[#EA6E48]">Cards & Collectibles</span></h1>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-[#1A1A1A] text-white border-[#353945] rounded-md">
              Recently added
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m6 9 6 6 6-6"/></svg>
            </Button>

            <div className="flex rounded-md overflow-hidden ml-4">
              <Button variant="default" className="bg-[#3772FF] text-white rounded-l-md rounded-r-none">All Items</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Sports</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Comics</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Games</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Music</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-r-md rounded-l-none">Art</Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                className={`bg-[#1A1A1A] border-[#353945] ${viewMode === 'grid' ? 'text-[#3772FF]' : 'text-[#777E90]'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className={`bg-[#1A1A1A] border-[#353945] ${viewMode === 'list' ? 'text-[#3772FF]' : 'text-[#777E90]'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button className="bg-[#3772FF] text-white rounded-md flex items-center gap-2">
              <Filter size={16} />
              Filter
              <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        <Card className={`bg-[#23262F] border-[#353945] ${viewMode === 'grid' ? 'h-64' : ''}`}>
          <CardHeader>
            <CardTitle className="text-[#FCFCFD]">Create New Collection</CardTitle>
            <CardDescription className="text-[#777E90]">
              Group your cards into themed collections
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4">
            <Button className="bg-[#3772FF] text-white hover:bg-[#2A5CD5]">
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </CardContent>
        </Card>
        
        {collections?.length === 0 && (
          <Card className={`${viewMode === 'grid' ? 'h-64' : ''} flex items-center justify-center bg-[#23262F] border-[#353945]`}>
            <div className="text-center p-6">
              <Image className="h-12 w-12 mx-auto text-[#353945] mb-4" />
              <p className="text-[#777E90]">No collections yet</p>
              <p className="text-sm text-[#505050] mt-2">Create your first collection to organize your cards</p>
            </div>
          </Card>
        )}
      </div>
      
      {collections?.length === 0 && (
        <div className="mt-10 flex justify-center">
          <Button className="bg-transparent text-white border border-[#353945] rounded-full px-8 py-4">
            Load more
            <svg className="ml-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11H14.5V9.5H10.5V5Z" fill="white"/>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Collections;
