
import { supabase } from '@/lib/supabase-client';
import { getAppId } from '@/integrations/supabase/client';
import type { MemoryListOptions, PaginatedMemories } from '../types';
import { calculateOffset } from '../core';

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
