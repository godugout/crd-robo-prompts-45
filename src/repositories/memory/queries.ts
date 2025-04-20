
import type { Memory } from '@/types/memory';
import type { MemoryListOptions, PaginatedMemories } from './types';
import { getMemoryQuery, calculateOffset } from './core';
import { getAppId } from '@/integrations/supabase/client';
import { supabase } from '@/lib/supabase-client';

// Helper function to transform database record to Memory type
const transformToMemory = (record: any): Memory => {
  return {
    id: record.id,
    userId: record.user_id,
    title: record.title,
    description: record.description,
    teamId: record.team_id,
    gameId: record.game_id,
    location: record.location,
    visibility: record.visibility,
    createdAt: record.created_at,
    tags: record.tags || [],
    metadata: record.metadata,
    media: record.media,
    app_id: record.app_id
  };
};

export const getMemoryById = async (id: string): Promise<Memory | null> => {
  try {
    const queryBuilder = getMemoryQuery();
    
    // Now chain the conditions and execute the query
    const { data, error } = await queryBuilder
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(`Failed to fetch memory: ${error.message}`);
    }

    if (!data) return null;
    
    // Get reactions and comments count
    const memory = transformToMemory(data);
    
    try {
      // Get reactions count
      const { data: reactionsData } = await supabase
        .from('reactions')
        .select('type, count')
        .eq('card_id', id)
        .group('type');
        
      if (reactionsData) {
        memory.reactions = reactionsData.map(r => ({
          type: r.type,
          count: parseInt(r.count)
        }));
      }
      
      // Get comments count
      const { data: commentsData } = await supabase
        .from('comments')
        .select('count')
        .eq('card_id', id)
        .single();
        
      if (commentsData) {
        memory.comments = {
          count: parseInt(commentsData.count)
        };
      }
    } catch (e) {
      console.error('Error fetching reactions/comments:', e);
    }
    
    return memory;
  } catch (error) {
    console.error('Error in getMemoryById:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch(`/api/cards/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return null;
    }
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
    } = options;

    const queryBuilder = getMemoryQuery();
    
    // Chain conditions to the query builder
    let finalQuery = queryBuilder
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (visibility) finalQuery = finalQuery.eq('visibility', visibility);
    if (teamId) finalQuery = finalQuery.eq('team_id', teamId);
    
    // Now add app_id filter
    const appId = await getAppId();
    if (appId) finalQuery = finalQuery.eq('app_id', appId);
    
    finalQuery = finalQuery.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    // Execute the query
    const { data, error, count } = await finalQuery;

    if (error) throw new Error(`Failed to fetch memories: ${error.message}`);
    
    return {
      memories: data ? data.map(transformToMemory) : [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getMemoriesByUserId:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', options.page?.toString() || '1');
      queryParams.append('limit', options.pageSize?.toString() || '10');
      if (options.visibility) queryParams.append('visibility', options.visibility);
      if (options.teamId) queryParams.append('teamId', options.teamId);
      
      const response = await fetch(`/api/cards?userId=${userId}&${queryParams.toString()}`);
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

    const queryBuilder = getMemoryQuery();
    
    // Chain conditions to the query builder
    let finalQuery = queryBuilder
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    // Add app_id filter if available  
    const appId = await getAppId();
    if (appId) finalQuery = finalQuery.eq('app_id', appId);

    if (teamId) finalQuery = finalQuery.eq('team_id', teamId);
    if (tags && tags.length > 0) {
      finalQuery = finalQuery.contains('tags', tags);
    }
    if (search) {
      finalQuery = finalQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    finalQuery = finalQuery.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    // Execute the query
    const { data, error, count } = await finalQuery;

    if (error) throw new Error(`Failed to fetch public memories: ${error.message}`);
    
    return {
      memories: data ? data.map(transformToMemory) : [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getPublicMemories:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', options.page?.toString() || '1');
      queryParams.append('limit', options.pageSize?.toString() || '10');
      if (options.teamId) queryParams.append('teamId', options.teamId);
      if (options.search) queryParams.append('search', options.search);
      
      const response = await fetch(`/api/feed/for-you?${queryParams.toString()}`);
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
