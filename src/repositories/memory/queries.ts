
import { supabase } from '@/lib/supabase-client';
import { getAppId } from '@/integrations/supabase/client';
import type { Memory, MemoryListOptions, PaginatedMemories } from '@/types/memory';
import { calculateOffset } from './core';

export const getMemoryById = async (id: string): Promise<Memory | null> => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*, media(*)')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching memory:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Get reaction counts manually since we can't use group
    const { data: reactionData } = await supabase
      .from('reactions')
      .select('type')
      .eq('card_id', id);
      
    // Count reactions by type manually
    const reactionCounts: Record<string, number> = {};
    if (reactionData) {
      reactionData.forEach(reaction => {
        reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
      });
    }
      
    // Count comments
    const { count: commentCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('card_id', id);
      
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      teamId: data.team_id,
      gameId: data.game_id,
      location: data.location,
      visibility: data.visibility,
      createdAt: data.created_at,
      tags: data.tags,
      metadata: data.metadata,
      media: data.media,
      reactionCounts: Object.entries(reactionCounts).map(([type, count]) => ({ type, count })),
      commentCount: commentCount || 0
    };
  } catch (error) {
    console.error('Error in getMemoryById:', error);
    return null;
  }
};

export const getMemoriesByUserId = async (
  userId: string,
  options: MemoryListOptions = {}
): Promise<PaginatedMemories> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      visibility,
      teamId,
      tags,
      search
    } = options;

    let query = supabase
      .from('memories')
      .select('*, media(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    // Add app_id filter if available
    const appId = await getAppId();
    if (appId) query = query.eq('app_id', appId);
    
    if (visibility && visibility !== 'all') {
      query = query.eq('visibility', visibility);
    }
    
    if (teamId) {
      query = query.eq('team_id', teamId);
    }
    
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch memories: ${error.message}`);
    
    return {
      memories: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getMemoriesByUserId:', error);
    
    return {
      memories: [],
      total: 0
    };
  }
};

export const getPublicMemories = async (
  options: MemoryListOptions = {}
): Promise<PaginatedMemories> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      teamId,
      tags,
      search
    } = options;

    let query = supabase
      .from('memories')
      .select('*, media(*)', { count: 'exact' })
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
      
    // Add app_id filter if available
    const appId = await getAppId();
    if (appId) query = query.eq('app_id', appId);
    
    if (teamId) {
      query = query.eq('team_id', teamId);
    }
    
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch public memories: ${error.message}`);
    
    return {
      memories: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getPublicMemories:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('visibility', 'public');
      queryParams.append('page', options.page?.toString() || '1');
      queryParams.append('limit', options.pageSize?.toString() || '10');
      if (options.teamId) queryParams.append('teamId', options.teamId);
      if (options.search) queryParams.append('search', options.search);
      if (options.tags && options.tags.length > 0) {
        queryParams.append('tags', options.tags.join(','));
      }
      
      const response = await fetch(`/api/cards?${queryParams.toString()}`);
      const data = await response.json();
      
      return {
        memories: data.items || [],
        total: data.total || 0
      };
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return {
        memories: [],
        total: 0
      };
    }
  }
};
