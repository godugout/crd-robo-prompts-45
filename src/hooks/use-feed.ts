
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
    console.log('useFeed: fetchMemories called', { currentPage, feedType, userId });
    
    if (!userId && feedType === 'following') {
      console.log('useFeed: skipping fetch for following feed with no user');
      return;
    }
    
    setLoading(true);
    const limit = 10;
    const offset = (currentPage - 1) * limit;
    
    try {
      // For development and debugging, let's add some mock data if we have no real data
      // This helps us test the UI without needing actual database entries
      const mockMemories: Memory[] = Array(5).fill(null).map((_, i) => ({
        id: `mock-${i}-${Date.now()}`,
        title: `Mock Memory ${i + 1}`,
        description: 'This is a mock memory for testing when the database is empty',
        userId: 'mock-user', // Changed from user_id to userId
        teamId: 'mock-team', // Added required teamId property
        createdAt: new Date().toISOString(), // Changed from created_at to createdAt
        visibility: 'public',
        user: {
          id: 'mock-user',
          username: 'mockuser',
          full_name: 'Mock User',
          avatar_url: null
        },
        media: [],
        reactions: [],
        tags: ['mock', 'testing']
      }));
      
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
          console.log('useFeed: No following users found');
          
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
          console.log('useFeed: No trending memories found');
          
          setMemories(currentPage === 1 ? [] : memories);
          setHasMore(false);
          setLoading(false);
          return;
        }
        query = query.in('id', memoryIds);
      }

      query = query.range(offset, offset + limit - 1);
      const { data, error, count } = await query;

      if (error) {
        console.error('Error in useFeed:', error);
        throw error;
      }

      console.log('useFeed: fetched data', { count, dataLength: data?.length });
      
      // Use mock data if we don't have any real data
      let newMemories: Memory[] = [];
      
      if (data && data.length > 0) {
        // Convert the Supabase response to match our Memory type
        newMemories = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          userId: item.user_id, // Map from snake_case to camelCase
          teamId: item.team_id, // Map from snake_case to camelCase
          gameId: item.game_id,
          location: item.location,
          visibility: item.visibility,
          createdAt: item.created_at, // Map from snake_case to camelCase
          tags: item.tags || [],
          metadata: item.metadata,
          user: item.user,
          media: item.media || [],
          reactions: item.reactions || [],
          commentCount: item.comments?.[0]?.count || 0
        })) as Memory[];
      } else {
        // Use mock data if no real data is available
        newMemories = mockMemories;
      }
      
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
    console.log('useFeed: resetFeed called');
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
