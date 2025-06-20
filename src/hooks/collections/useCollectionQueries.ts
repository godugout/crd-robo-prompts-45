
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  Collection, 
  CollectionCard, 
  CollectionActivity, 
  CollectionComment,
  CollectionAnalytics,
  CollectionFilters
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

      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      if (filters.limit) {
        query = query.limit(filters.limit);
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
      
      const activities: CollectionActivity[] = (data || []).map(item => ({
        id: item.id,
        collection_id: item.collection_id,
        user_id: item.user_id,
        activity_type: item.activity_type as CollectionActivity['activity_type'],
        activity_data: item.activity_data || {},
        created_at: item.created_at,
        user: {
          id: item.user_id,
          username: 'Unknown User',
          avatar_url: undefined
        }
      }));

      return activities;
    },
    enabled: !!collectionId
  });
};

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
          username: 'Unknown User',
          avatar_url: undefined
        },
        replies: []
      }));

      return comments;
    },
    enabled: !!collectionId
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
    onSuccess: () => {
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
        const { data, error } = await supabase
          .from('collection_cards')
          .update({ quantity: existingCard.quantity + quantity })
          .eq('id', existingCard.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
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
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          await supabase
            .from('collection_activity')
            .insert({
              collection_id: collectionId,
              user_id: user.data.user.id,
              activity_type: 'card_added',
              activity_data: { card_id: cardId, quantity }
            });
        }

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
