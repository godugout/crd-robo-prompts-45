
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardFilters, PaginatedCards, CardFavorite } from '@/types/cards';

const PAGE_SIZE = 20;

export const useCards = (filters: CardFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ['cards', filters],
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedCards> => {
      let query = supabase
        .from('cards')
        .select(`
          *,
          card_sets:set_id(name),
          crd_profiles:creator_id(username, display_name)
        `, { count: 'exact' });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.rarity?.length) {
        query = query.in('rarity', filters.rarity);
      }

      if (filters.card_type?.length) {
        query = query.in('card_type', filters.card_type);
      }

      if (filters.creator_id) {
        query = query.eq('creator_id', filters.creator_id);
      }

      if (filters.set_id) {
        query = query.eq('set_id', filters.set_id);
      }

      if (filters.price_min !== undefined) {
        query = query.gte('current_market_value', filters.price_min);
      }

      if (filters.price_max !== undefined) {
        query = query.lte('current_market_value', filters.price_max);
      }

      if (filters.power_min !== undefined) {
        query = query.gte('power', filters.power_min);
      }

      if (filters.power_max !== undefined) {
        query = query.lte('power', filters.power_max);
      }

      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }

      if (filters.tags?.length) {
        query = query.overlaps('tags', filters.tags);
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const limit = filters.limit || PAGE_SIZE;
      const offset = pageParam * PAGE_SIZE;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const cards: Card[] = (data || []).map(item => ({
        ...item,
        creator_name: item.crd_profiles?.display_name || item.crd_profiles?.username,
        set_name: item.card_sets?.name
      }));

      return {
        cards,
        total: count || 0,
        hasMore: cards.length === limit
      };
    },
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length : undefined,
    initialPageParam: 0
  });
};

export const useCard = (id: string) => {
  return useQuery({
    queryKey: ['card', id],
    queryFn: async (): Promise<Card> => {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          card_sets:set_id(name),
          crd_profiles:creator_id(username, display_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        creator_name: data.crd_profiles?.display_name || data.crd_profiles?.username,
        set_name: data.card_sets?.name
      };
    },
    enabled: !!id
  });
};

export const useCardFavorites = (userId?: string) => {
  return useQuery({
    queryKey: ['card-favorites', userId],
    queryFn: async (): Promise<CardFavorite[]> => {
      const { data, error } = await supabase
        .from('card_favorites')
        .select('*')
        .eq('user_id', userId!);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, userId }: { cardId: string; userId: string }) => {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('card_favorites')
        .select('id')
        .eq('card_id', cardId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from('card_favorites')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add favorite
        const { error } = await supabase
          .from('card_favorites')
          .insert({ card_id: cardId, user_id: userId });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['card-favorites', userId] });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      
      toast.success(
        result.action === 'added' 
          ? 'Card added to favorites!' 
          : 'Card removed from favorites!'
      );
    },
    onError: (error) => {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    }
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardData: Omit<Card, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cards')
        .insert(cardData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Card created successfully!');
    },
    onError: (error) => {
      console.error('Failed to create card:', error);
      toast.error('Failed to create card');
    }
  });
};

export const useFeaturedCards = (limit = 6) => {
  return useQuery({
    queryKey: ['featured-cards', limit],
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          card_sets:set_id(name),
          crd_profiles:creator_id(username, display_name)
        `)
        .eq('is_featured', true)
        .eq('is_public', true)
        .order('current_market_value', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        creator_name: item.crd_profiles?.display_name || item.crd_profiles?.username,
        set_name: item.card_sets?.name
      }));
    }
  });
};
