
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
import { Loader, Image, Grid, List, Plus } from 'lucide-react';
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
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Collections</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            className={viewMode === 'grid' ? 'bg-gray-100' : ''}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={viewMode === 'list' ? 'bg-gray-100' : ''}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        <Card className={viewMode === 'grid' ? 'h-64' : ''}>
          <CardHeader>
            <CardTitle>Create New Collection</CardTitle>
            <CardDescription>
              Group your cards into themed collections
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </CardContent>
        </Card>
        
        {collections?.length === 0 && (
          <Card className={`${viewMode === 'grid' ? 'h-64' : ''} flex items-center justify-center`}>
            <div className="text-center p-6">
              <Image className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No collections yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first collection to organize your cards</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Collections;
