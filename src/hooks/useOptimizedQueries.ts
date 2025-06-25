
import { useMemo } from 'react';
import { useQuery, useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheTime?: number;
  staleTime?: number;
}

export const useOptimizedQueries = () => {
  // Optimized card fetching with pagination and caching
  const useCardsQuery = (
    filters?: { 
      rarity?: string; 
      creator?: string; 
      search?: string;
      limit?: number;
    },
    options?: OptimizedQueryOptions<any>
  ) => {
    const queryKey = useMemo(() => ['cards', filters], [filters]);
    
    return useQuery({
      queryKey,
      queryFn: async () => {
        let query = supabase
          .from('cards')
          .select(`
            id, title, description, image_url, thumbnail_url, 
            rarity, price, created_at,
            creator_profiles!creator_id (
              display_name, avatar_url, creator_verified
            )
          `);

        if (filters?.rarity) {
          query = query.eq('rarity', filters.rarity);
        }
        
        if (filters?.creator) {
          query = query.eq('creator_id', filters.creator);
        }
        
        if (filters?.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        query = query
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(filters?.limit || 20);

        const { data, error } = await query;
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      ...options
    });
  };

  // Infinite query for card gallery with virtualization
  const useInfiniteCardsQuery = (filters?: any) => {
    return useInfiniteQuery({
      queryKey: ['cards-infinite', filters],
      queryFn: async ({ pageParam = 0 }) => {
        const from = pageParam * 20;
        const to = from + 19;

        let query = supabase
          .from('cards')
          .select(`
            id, title, description, image_url, thumbnail_url,
            rarity, price, created_at,
            creator_profiles!creator_id (
              display_name, avatar_url
            )
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .range(from, to);

        const { data, error } = await query;
        if (error) throw error;
        return data;
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 20 ? allPages.length : undefined;
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Optimized creator profile with selective fetching
  const useCreatorProfileQuery = (creatorId: string, includeStats = false) => {
    return useQuery({
      queryKey: ['creator-profile', creatorId, includeStats],
      queryFn: async () => {
        const baseQuery = supabase
          .from('creator_profiles')
          .select(`
            id, user_id, display_name, bio, avatar_url,
            creator_verified, specialties, portfolio_links
            ${includeStats ? `, creator_earnings(count)` : ''}
          `)
          .eq('id', creatorId)
          .single();

        const { data, error } = await baseQuery;
        if (error) throw error;
        return data;
      },
      enabled: !!creatorId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  return {
    useCardsQuery,
    useInfiniteCardsQuery,
    useCreatorProfileQuery
  };
};
