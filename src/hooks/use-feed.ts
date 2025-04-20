
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { Memory } from '@/types/memory';

type FeedType = 'forYou' | 'following' | 'trending';

export const useFeed = (userId?: string) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMemories = useCallback(async (
    currentPage: number,
    feedType: FeedType
  ) => {
    if (!userId && feedType === 'following') return;
    
    setLoading(true);
    const limit = 10;
    const offset = (currentPage - 1) * limit;
    
    try {
      let query = supabase
        .from('memories')
        .select(`
          *,
          user:profiles(*),
          media(*),
          reactions(*),
          comments(count)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (feedType === 'following' && userId) {
        const { data: followingIds } = await supabase
          .from('follows')
          .select('followedId')
          .eq('followerId', userId);
          
        const userIds = followingIds?.map(f => f.followedId) || [];
        if (userIds.length === 0) {
          setMemories(currentPage === 1 ? [] : memories);
          setHasMore(false);
          setLoading(false);
          return;
        }
        query = query.in('user_id', userIds);
      }
      
      if (feedType === 'trending') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: trendingIds } = await supabase
          .from('reactions')
          .select('memoryId, count')
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('count', { ascending: false })
          .limit(50);
          
        const memoryIds = trendingIds?.map(t => t.memoryId) || [];
        if (memoryIds.length === 0) {
          setMemories(currentPage === 1 ? [] : memories);
          setHasMore(false);
          setLoading(false);
          return;
        }
        query = query.in('id', memoryIds);
      }

      // For "forYou", boost followed users if logged in
      if (feedType === 'forYou' && userId) {
        const { data: followingIds } = await supabase
          .from('follows')
          .select('followedId')
          .eq('followerId', userId);
          
        const userIds = followingIds?.map(f => f.followedId) || [];
        if (userIds.length > 0) {
          query = query.order('user_id', { 
            ascending: false
          });
        }
      }

      query = query.range(offset, offset + limit - 1);
      const { data, error, count } = await query;

      if (error) throw error;

      // Transform the data to match our Memory type
      const newMemories = data as unknown as Memory[];
      
      setMemories(prev => 
        currentPage === 1 ? newMemories : [...prev, ...newMemories]
      );
      setHasMore(!!count && count > currentPage * limit);
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, memories]);

  const resetFeed = useCallback(() => {
    setPage(1);
    setMemories([]);
    setHasMore(true);
  }, []);

  return {
    memories,
    loading,
    page,
    hasMore,
    setPage,
    fetchMemories,
    resetFeed
  };
};
