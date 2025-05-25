
import { supabase } from '@/lib/supabase-client';
import { getAppId } from '@/integrations/supabase/client';
import type { MemoryListOptions, PaginatedMemories } from '../types';
import { calculateOffset } from '../core';

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
