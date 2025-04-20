
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCollectionById, 
  getCollectionsByUserId, 
  createCollection, 
  updateCollection, 
  updateCollectionCards, 
  deleteCollection 
} from '@/repositories/collection';
import type { 
  Collection, 
  CreateCollectionParams, 
  UpdateCollectionParams, 
  CollectionListOptions 
} from '@/repositories/collection/types';
import { toast } from '@/hooks/use-toast';

export const useCollections = (userId?: string) => {
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<CollectionListOptions>({
    page: 1,
    pageSize: 10
  });

  // Get user collections
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['collections', userId, options],
    queryFn: () => userId ? getCollectionsByUserId(userId, options) : { collections: [], total: 0 },
    enabled: !!userId
  });

  // Get single collection
  const getCollection = (id: string) => {
    return useQuery({
      queryKey: ['collection', id],
      queryFn: () => getCollectionById(id)
    });
  };

  // Create collection
  const createCollectionMutation = useMutation({
    mutationFn: (params: CreateCollectionParams) => createCollection(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', userId] });
      toast({
        title: 'Collection Created',
        description: 'Your new collection has been created'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create collection: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Update collection
  const updateCollectionMutation = useMutation({
    mutationFn: (params: UpdateCollectionParams) => updateCollection(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collections', userId] });
      queryClient.invalidateQueries({ queryKey: ['collection', data.id] });
      toast({
        title: 'Collection Updated',
        description: 'Your changes have been saved'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update collection: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Update collection cards
  const updateCollectionCardsMutation = useMutation({
    mutationFn: ({ collectionId, cardIds }: { collectionId: string; cardIds: string[] }) => 
      updateCollectionCards(collectionId, cardIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections', userId] });
      queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] });
      toast({
        title: 'Collection Updated',
        description: 'Cards have been updated'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update collection cards: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Delete collection
  const deleteCollectionMutation = useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', userId] });
      toast({
        title: 'Collection Deleted',
        description: 'Your collection has been deleted'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete collection: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  // Update options
  const updateOptions = (newOptions: Partial<CollectionListOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  return {
    collections: data?.collections || [],
    total: data?.total || 0,
    isLoading,
    error,
    options,
    refetch,
    updateOptions,
    getCollection,
    createCollection: createCollectionMutation.mutate,
    updateCollection: updateCollectionMutation.mutate,
    updateCollectionCards: updateCollectionCardsMutation.mutate,
    deleteCollection: deleteCollectionMutation.mutate,
    isCreating: createCollectionMutation.isPending,
    isUpdating: updateCollectionMutation.isPending || updateCollectionCardsMutation.isPending,
    isDeleting: deleteCollectionMutation.isPending
  };
};
