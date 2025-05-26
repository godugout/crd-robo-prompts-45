
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingState } from '@/components/common/LoadingState';
import { handleApiError } from '@/utils/toast-handlers';
import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterControls } from '@/components/shared/FilterControls';
import { SortFilterOptions } from '@/components/shared/SortFilterOptions';
import { EmptyState } from '@/components/shared/EmptyState';
import { CreateCollectionModal } from '@/components/collections/CreateCollectionModal';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { toast } from 'sonner';

const Collections = () => {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: collections, isLoading, error, refetch } = useQuery({
    queryKey: ['collections', user?.id],
    queryFn: async () => {
      // Mock implementation - in a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          title: 'My Sports Cards',
          description: 'A collection of my favorite sports trading cards',
          coverTemplate: 'retro',
          cardCount: 12,
          visibility: 'private',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Vintage Collection',
          description: 'Classic cards from the golden era',
          coverTemplate: 'vintage',
          cardCount: 8,
          visibility: 'public',
          createdAt: new Date().toISOString()
        }
      ];
    },
    enabled: !!user?.id
  });

  const handleCreateCollection = async (collectionData: any) => {
    // Mock implementation - in a real app, this would save to database
    console.log('Creating collection:', collectionData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    refetch();
  };

  const handleEditCollection = (collection: any) => {
    console.log('Edit collection:', collection);
    toast.info('Edit functionality coming soon!');
  };

  const handleDeleteCollection = (collectionId: string) => {
    console.log('Delete collection:', collectionId);
    toast.info('Delete functionality coming soon!');
  };

  const handleViewCollection = (collection: any) => {
    console.log('View collection:', collection);
    toast.info('Collection view coming soon!');
  };
  
  if (isLoading) {
    return <LoadingState message="Loading your collections..." />;
  }
  
  if (error) {
    handleApiError(error, 'Failed to load collections');
  }

  return (
    <div className="crd-container">
      <PageHeader 
        title="My Collections" 
        accentText="Organize Your Cards"
      />
      
      <div className="mb-8 flex justify-between items-center">
        <FilterControls 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Collection
        </Button>
      </div>
      
      <SortFilterOptions />
      
      {collections?.length === 0 ? (
        <EmptyState 
          title="No collections yet" 
          description="Create your first collection to organize your cards into themed groups"
          action={{
            label: "Create Collection",
            onClick: () => setShowCreateModal(true),
            icon: <Plus className="mr-2 h-4 w-4" />
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections?.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              onView={handleViewCollection}
            />
          ))}
        </div>
      )}
      
      {collections && collections.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Button className="crd-button-secondary rounded-full px-8 py-4">
            Load more
            <svg className="ml-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11H14.5V9.5H10.5V5Z" fill="white"/>
            </svg>
          </Button>
        </div>
      )}

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCollection}
      />
    </div>
  );
};

export default Collections;
