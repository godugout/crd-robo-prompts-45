
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { getUserCollections } from '@/repositories/collection/queries';
import { createCollection, updateCollection, deleteCollection } from '@/repositories/collection/mutations';
import type { Collection } from '@/repositories/collection/types';

const Collections = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: collectionsData, isLoading, error, refetch } = useQuery({
    queryKey: ['user-collections', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await getUserCollections(user.id, { pageSize: 20 });
    },
    enabled: !!user?.id
  });

  const createMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection created successfully!');
      setShowCreateModal(false);
    },
    onError: (error) => {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection. Please try again.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update collection:', error);
      toast.error('Failed to update collection. Please try again.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete collection:', error);
      toast.error('Failed to delete collection. Please try again.');
    }
  });

  const handleCreateCollection = async (collectionData: any) => {
    if (!user?.id) {
      toast.error('You must be logged in to create collections');
      return;
    }

    createMutation.mutate({
      title: collectionData.name,
      description: collectionData.description,
      ownerId: user.id,
      visibility: collectionData.visibility || 'private'
    });
  };

  const handleEditCollection = (collection: Collection) => {
    // For now, just show a placeholder - we can implement edit modal later
    toast.info('Edit functionality coming soon!');
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      deleteMutation.mutate(collectionId);
    }
  };

  const handleViewCollection = (collection: Collection) => {
    // Navigate to collection view - implement this when we have the collection detail page
    toast.info(`Viewing "${collection.title}" - Collection view coming soon!`);
  };
  
  if (isLoading) {
    return <LoadingState message="Loading your collections..." />;
  }
  
  if (error) {
    handleApiError(error, 'Failed to load collections');
  }

  const collections = collectionsData?.collections || [];

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
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Create Collection
        </Button>
      </div>
      
      <SortFilterOptions />
      
      {collections.length === 0 ? (
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
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={{
                id: collection.id,
                title: collection.title,
                description: collection.description,
                coverImageUrl: collection.coverImageUrl,
                cardCount: collection.cardCount,
                visibility: collection.visibility,
                createdAt: collection.createdAt
              }}
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              onView={handleViewCollection}
            />
          ))}
        </div>
      )}
      
      {collections.length > 0 && (
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
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default Collections;
