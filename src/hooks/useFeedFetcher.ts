
import { supabase } from '@/lib/supabase-client';
import type { Memory } from '@/types/memory';
import type { FeedType } from './use-feed-types';

export const fetchMemoriesFromFeed = async (
  userId: string | undefined,
  currentPage: number,
  feedType: FeedType,
  existingMemories: Memory[],
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>,
  setHasMore: (v: boolean) => void,
  setError: (error: Error | null) => void,
  setLoading: (b: boolean) => void,
) => {
  console.log('useFeed: fetchMemories called', { currentPage, feedType, userId });

  if (!userId && feedType === 'following') {
    console.log('useFeed: skipping fetch for following feed with no user');
    return;
  }

  setLoading(true);
  setError(null);
  const limit = 10;
  const offset = (currentPage - 1) * limit;
  
  try {
    // Create mock memories for testing
    const mockMemories: Memory[] = Array(5).fill(null).map((_, i) => ({
      id: `mock-${i}-${Date.now()}`,
      title: `Mock Memory ${i + 1}`,
      description: 'This is a mock memory for testing when the database is empty',
      userId: 'mock-user', 
      teamId: 'mock-team',
      gameId: undefined,
      location: null,
      visibility: 'public',
      createdAt: new Date().toISOString(),
      tags: ['mock', 'testing'],
      metadata: undefined,
      user: {
        id: 'mock-user',
        username: 'mockuser',
        email: 'mock@example.com',
        profileImage: null,
        bio: null,
        createdAt: new Date().toISOString(),
        preferences: null
      },
      media: [],
      reactions: [],
      commentCount: 0
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
        
        setMemories(currentPage === 1 ? [] : existingMemories);
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
        
        setMemories(currentPage === 1 ? [] : existingMemories);
        setHasMore(false);
        setLoading(false);
        return;
      }
      query = query.in('id', memoryIds);
    }

    if (feedType === 'featured') {
      query = query.eq('visibility', 'public')
                  .order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;

    if (error) {
      console.error('Error in useFeed:', error);
      setError(new Error(error.message));
      throw error;
    }

    let newMemories: Memory[] = [];
    
    if (data && data.length > 0) {
      // Convert Supabase response to our Memory type
      newMemories = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        userId: item.user_id, 
        teamId: item.team_id,
        gameId: item.game_id,
        location: item.location,
        visibility: item.visibility,
        createdAt: item.created_at,
        tags: item.tags || [],
        metadata: item.metadata,
        user: item.user ? {
          id: item.user.id,
          username: item.user.username || 'anonymous',
          email: item.user.email || 'unknown@example.com',
          profileImage: item.user.avatar_url,
          bio: item.user.bio || null,
          createdAt: item.user.created_at || new Date().toISOString(),
          preferences: item.user.preferences || null
        } : undefined,
        media: item.media || [],
        reactions: item.reactions || [],
        commentCount: item.comments?.[0]?.count || 0
      })) as Memory[];
    } else {
      newMemories = mockMemories;
    }
    
    if (currentPage === 1) {
      setMemories(newMemories);
    } else {
      setMemories(prev => [...prev, ...newMemories]);
    }
    setHasMore(!!count && count > currentPage * limit);
  } catch (error) {
    console.error('Error fetching memories:', error);
    setError(error instanceof Error ? error : new Error('Unknown error fetching memories'));
  } finally {
    setLoading(false);
  }
};
