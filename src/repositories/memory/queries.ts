
import type { Memory } from '@/types/memory';
import type { MemoryListOptions, PaginatedMemories } from './types';
import { getMemoryQuery, calculateOffset } from './core';
import { getAppId } from '@/integrations/supabase/client';

export const getMemoryById = async (id: string): Promise<Memory | null> => {
  const queryBuilder = getMemoryQuery();
  
  // Now chain the conditions and execute the query
  const { data, error } = await queryBuilder
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Record not found
    throw new Error(`Failed to fetch memory: ${error.message}`);
  }

  return data as Memory | null;
};

export const getMemoriesByUserId = async (
  userId: string, 
  options: MemoryListOptions = {}
): Promise<PaginatedMemories> => {
  const {
    page = 1,
    pageSize = 10,
    visibility,
    teamId,
  } = options;

  const queryBuilder = getMemoryQuery();
  
  // Chain conditions to the query builder
  let finalQuery = queryBuilder
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (visibility) finalQuery = finalQuery.eq('visibility', visibility);
  if (teamId) finalQuery = finalQuery.eq('teamId', teamId);
  
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
    memories: (data || []) as Memory[],
    total: count || 0
  };
};

export const getPublicMemories = async (
  options: MemoryListOptions = {}
): Promise<PaginatedMemories> => {
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
    .order('createdAt', { ascending: false });

  // Add app_id filter if available  
  const appId = await getAppId();
  if (appId) finalQuery = finalQuery.eq('app_id', appId);

  if (teamId) finalQuery = finalQuery.eq('teamId', teamId);
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
    memories: (data || []) as Memory[],
    total: count || 0
  };
};
