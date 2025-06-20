
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  Collection, 
  CollectionCard, 
  CollectionActivity, 
  CollectionComment,
  CollectionRating,
  CollectionFollower,
  CollectionAnalytics,
  CollectionFilters,
  CollectionTemplate
} from '@/types/collections';

// Collection queries
export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: async (): Promise<Collection> => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Collection;
    },
    enabled: !!id
  });
};

export const useCollections = (filters: CollectionFilters = {}) => {
  return useQuery({
    queryKey: ['collections', filters],
    queryFn: async (): Promise<{ collections: Collection[], total: number }> => {
      let query = supabase
        .from('collections')
        .select('*', { count: 'exact' });

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.visibility) {
        query = query.eq('visibility', filters.visibility);
      }

      if (filters.owner_id) {
        query = query.eq('owner_id', filters.owner_id);
      }

      if (filters.category) {
        query = query.eq('template_category', filters.category);
      }

      if (filters.tags?.length) {
        query = query.overlaps('tags', filters.tags);
      }

      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { collections: (data || []) as Collection[], total: count || 0 };
    }
  });
};

export const useUserCollections = (userId: string) => {
  return useQuery({
    queryKey: ['user-collections', userId],
    queryFn: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('owner_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Collection[];
    },
    enabled: !!userId
  });
};

export const usePublicCollections = (limit = 20) => {
  return useQuery({
    queryKey: ['public-collections', limit],
    queryFn: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('visibility', 'public')
        .order('last_activity_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as Collection[];
    }
  });
};

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: ['featured-collections'],
    queryFn: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('visibility', 'public')
        .not('featured_until', 'is', null)
        .gte('featured_until', new Date().toISOString())
        .order('views_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as Collection[];
    }
  });
};

// Collection cards queries
export const useCollectionCards = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-cards', collectionId],
    queryFn: async (): Promise<CollectionCard[]> => {
      const { data, error } = await supabase
        .from('collection_cards')
        .select(`
          *,
          card:cards (
            id,
            title,
            image_url,
            thumbnail_url,
            rarity,
            description
          )
        `)
        .eq('collection_id', collectionId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return (data || []) as CollectionCard[];
    },
    enabled: !!collectionId
  });
};

// Collection analytics
export const useCollectionAnalytics = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-analytics', collectionId],
    queryFn: async (): Promise<CollectionAnalytics> => {
      const { data, error } = await supabase
        .rpc('get_collection_analytics', { collection_uuid: collectionId });

      if (error) throw error;
      return data?.[0] || {
        total_cards: 0,
        unique_rarities: 0,
        completion_rate: 0,
        total_views: 0,
        total_likes: 0,
        total_followers: 0,
        recent_activity: 0
      };
    },
    enabled: !!collectionId
  });
};

// Collection activity - simplified without user join for now
export const useCollectionActivity = (collectionId: string, limit = 50) => {
  return useQuery({
    queryKey: ['collection-activity', collectionId, limit],
    queryFn: async (): Promise<CollectionActivity[]> => {
      const { data, error } = await supabase
        .from('collection_activity')
        .select('*')
        .eq('collection_id', collectionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Transform the data to match our interface
      const activities: CollectionActivity[] = (data || []).map(item => ({
        id: item.id,
        collection_id: item.collection_id,
        user_id: item.user_id,
        activity_type: item.activity_type as CollectionActivity['activity_type'],
        activity_data: typeof item.activity_data === 'string' 
          ? JSON.parse(item.activity_data) 
          : (item.activity_data || {}),
        created_at: item.created_at,
        user: {
          id: item.user_id,
          username: 'Unknown User', // Default value until we get user profiles
          avatar_url: undefined
        }
      }));

      return activities;
    },
    enabled: !!collectionId
  });
};

// Collection comments - simplified without user join for now
export const useCollectionComments = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection-comments', collectionId],
    queryFn: async (): Promise<CollectionComment[]> => {
      const { data, error } = await supabase
        .from('collection_comments')
        .select('*')
        .eq('collection_id', collectionId)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our interface
      const comments: CollectionComment[] = (data || []).map(item => ({
        id: item.id,
        collection_id: item.collection_id,
        user_id: item.user_id,
        parent_id: item.parent_id,
        content: item.content,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user: {
          id: item.user_id,
          username: 'Unknown User', // Default value until we get user profiles
          avatar_url: undefined
        },
        replies: []
      }));

      return comments;
    },
    enabled: !!collectionId
  });
};

// Collection templates
export const useCollectionTemplates = (category?: string) => {
  return useQuery({
    queryKey: ['collection-templates', category],
    queryFn: async (): Promise<CollectionTemplate[]> => {
      let query = supabase
        .from('collection_templates')
        .select('*')
        .order('usage_count', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const templates: CollectionTemplate[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        template_data: typeof item.template_data === 'string' 
          ? JSON.parse(item.template_data) 
          : (item.template_data || {}),
        preview_image_url: item.preview_image_url,
        created_by: item.created_by,
        is_official: item.is_official,
        usage_count: item.usage_count,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return templates;
    }
  });
};

// Mutations
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collection: Omit<Collection, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'likes_count' | 'shares_count' | 'completion_rate' | 'last_activity_at'>) => {
      const { data, error } = await supabase
        .from('collections')
        .insert(collection)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection created successfully!');
    },
    onError: (error) => {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection');
    }
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Collection> & { id: string }) => {
      const { data, error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collection', data.id] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update collection:', error);
      toast.error('Failed to update collection');
    }
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['user-collections'] });
      toast.success('Collection deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete collection:', error);
      toast.error('Failed to delete collection');
    }
  });
};

export const useAddCardToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId, cardId, quantity = 1, notes }: {
      collectionId: string;
      cardId: string;
      quantity?: number;
      notes?: string;
    }) => {
      const { data: existingCard } = await supabase
        .from('collection_cards')
        .select('*')
        .eq('collection_id', collectionId)
        .eq('card_id', cardId)
        .single();

      if (existingCard) {
        // Update quantity if card already exists
        const { data, error } = await supabase
          .from('collection_cards')
          .update({ quantity: existingCard.quantity + quantity })
          .eq('id', existingCard.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Add new card
        const { data, error } = await supabase
          .from('collection_cards')
          .insert({
            collection_id: collectionId,
            card_id: cardId,
            quantity,
            notes,
            added_by: (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();

        if (error) throw error;

        // Log activity
        await supabase
          .from('collection_activity')
          .insert({
            collection_id: collectionId,
            user_id: (await supabase.auth.getUser()).data.user?.id!,
            activity_type: 'card_added',
            activity_data: { card_id: cardId, quantity }
          });

        return data;
      }
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: ['collection-cards', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collection-analytics', collectionId] });
      toast.success('Card added to collection!');
    },
    onError: (error) => {
      console.error('Failed to add card to collection:', error);
      toast.error('Failed to add card to collection');
    }
  });
};

export const useRemoveCardFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId, cardId }: {
      collectionId: string;
      cardId: string;
    }) => {
      const { error } = await supabase
        .from('collection_cards')
        .delete()
        .eq('collection_id', collectionId)
        .eq('card_id', cardId);

      if (error) throw error;

      // Log activity
      await supabase
        .from('collection_activity')
        .insert({
          collection_id: collectionId,
          user_id: (await supabase.auth.getUser()).data.user?.id!,
          activity_type: 'card_removed',
          activity_data: { card_id: cardId }
        });
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: ['collection-cards', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collection-analytics', collectionId] });
      toast.success('Card removed from collection!');
    },
    onError: (error) => {
      console.error('Failed to remove card from collection:', error);
      toast.error('Failed to remove card from collection');
    }
  });
};

export const useFollowCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      const { data, error } = await supabase
        .from('collection_followers')
        .insert({
          collection_id: collectionId,
          follower_id: (await supabase.auth.getUser()).data.user?.id!
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, collectionId) => {
      queryClient.invalidateQueries({ queryKey: ['collection-followers', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collection-analytics', collectionId] });
      toast.success('Following collection!');
    },
    onError: (error) => {
      console.error('Failed to follow collection:', error);
      toast.error('Failed to follow collection');
    }
  });
};

export const useUnfollowCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      const { error } = await supabase
        .from('collection_followers')
        .delete()
        .eq('collection_id', collectionId)
        .eq('follower_id', (await supabase.auth.getUser()).data.user?.id!);

      if (error) throw error;
    },
    onSuccess: (_, collectionId) => {
      queryClient.invalidateQueries({ queryKey: ['collection-followers', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collection-analytics', collectionId] });
      toast.success('Unfollowed collection!');
    },
    onError: (error) => {
      console.error('Failed to unfollow collection:', error);
      toast.error('Failed to unfollow collection');
    }
  });
};

// Export the realtime hook
export { useCollectionsRealtime } from './useCollectionRealtime';
