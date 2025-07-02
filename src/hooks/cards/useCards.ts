
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardFilters, PaginatedCards } from '@/types/cards';

const PAGE_SIZE = 20;

export const useCards = (filters: CardFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ['cards', filters],
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedCards> => {
      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.rarity?.length) {
        query = query.in('rarity', filters.rarity);
      }

      if (filters.creator_id) {
        query = query.eq('creator_id', filters.creator_id);
      }

      if (filters.price_min !== undefined) {
        query = query.gte('price', filters.price_min);
      }

      if (filters.price_max !== undefined) {
        query = query.lte('price', filters.price_max);
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
        creator_name: 'Unknown Creator',
        set_name: 'Unknown Set',
        print_metadata: item.print_metadata || {},
        creator_attribution: item.creator_attribution || {},
        publishing_options: item.publishing_options || {},
        design_metadata: item.design_metadata || {}
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
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        creator_name: 'Unknown Creator',
        set_name: 'Unknown Set',
        print_metadata: data.print_metadata || {},
        creator_attribution: data.creator_attribution || {},
        publishing_options: data.publishing_options || {},
        design_metadata: data.design_metadata || {}
      };
    },
    enabled: !!id
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, userId }: { cardId: string; userId: string }) => {
      // For now, just show a toast since we don't have the favorites table yet
      toast.success('Favorite functionality will be implemented soon!');
      return { action: 'added' };
    },
    onSuccess: (result, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
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
    mutationFn: async (cardData: Partial<Card>) => {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          title: cardData.title || '',
          description: cardData.description,
          image_url: cardData.image_url,
          rarity: cardData.rarity || 'common',
          tags: cardData.tags || [],
          creator_id: cardData.creator_id || '',
          edition_size: cardData.edition_size || 1,
          is_public: cardData.is_public || false
        })
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
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        creator_name: 'Unknown Creator',
        set_name: 'Unknown Set',
        print_metadata: item.print_metadata || {},
        creator_attribution: item.creator_attribution || {},
        publishing_options: item.publishing_options || {},
        design_metadata: item.design_metadata || {}
      }));
    }
  });
};
