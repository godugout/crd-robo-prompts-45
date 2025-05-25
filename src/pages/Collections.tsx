
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
import { Loader, Image, Grid, List, Plus, Filter, Palette } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingState } from '@/components/common/LoadingState';
import { handleApiError } from '@/utils/toast-handlers';
import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterControls } from '@/components/shared/FilterControls';
import { SortFilterOptions } from '@/components/shared/SortFilterOptions';
import { EmptyState } from '@/components/shared/EmptyState';
import { Link } from 'react-router-dom';

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
      
      {/* Hero CTA Section for Card Creation */}
      <div className="mb-12 bg-gradient-to-r from-crd-blue/20 to-crd-orange/20 rounded-2xl p-8 border border-crd-mediumGray">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-4">
            <Palette className="h-16 w-16 text-crd-orange mx-auto mb-4" />
          </div>
          <h2 className="text-3xl font-bold text-crd-white mb-3">
            Create Your First Custom Card
          </h2>
          <p className="text-crd-lightGray text-lg mb-6">
            Transform your ideas into stunning digital collectibles with our powerful card editor. 
            Choose from templates, add your art, and mint unique cards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/editor">
              <Button className="bg-crd-orange hover:bg-crd-orange/90 text-white px-8 py-3 text-lg font-semibold">
                <Palette className="mr-2 h-5 w-5" />
                Start Creating
              </Button>
            </Link>
            <Link to="/cards">
              <Button variant="outline" className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray/20 px-8 py-3">
                Browse Examples
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
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
