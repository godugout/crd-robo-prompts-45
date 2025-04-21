
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
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterControls } from '@/components/shared/FilterControls';
import { SortFilterOptions } from '@/components/shared/SortFilterOptions';
import { EmptyState } from '@/components/shared/EmptyState';

const Collections = () => {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  
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
    <div className="crd-container">
      <PageHeader 
        title="Discover" 
        accentText="Cards & Collectibles"
      />
      
      <FilterControls 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <SortFilterOptions />
      
      <div className="mt-10 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-crd-white">Your Collections</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            className={`crd-view-toggle ${viewMode === 'grid' ? 'crd-view-toggle-active' : 'crd-view-toggle-inactive'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={`crd-view-toggle ${viewMode === 'list' ? 'crd-view-toggle-active' : 'crd-view-toggle-inactive'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        <Card className="crd-card">
          <CardHeader>
            <CardTitle className="text-crd-white">Create New Collection</CardTitle>
            <CardDescription className="text-crd-lightGray">
              Group your cards into themed collections
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4">
            <Button className="crd-button-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </CardContent>
        </Card>
        
        {collections?.length === 0 && (
          <div className="col-span-2">
            <EmptyState 
              title="No collections yet" 
              description="Create your first collection to organize your cards"
              action={{
                label: "Create Collection",
                onClick: () => console.log("Create collection clicked"),
                icon: <Plus className="mr-2 h-4 w-4" />
              }}
            />
          </div>
        )}
      </div>
      
      {collections?.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Button className="crd-button-secondary rounded-full px-8 py-4">
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
