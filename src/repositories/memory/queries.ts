
import type { Memory } from '@/types/memory';
import type { MemoryListOptions, PaginatedMemories } from './types';
import { getMemoryQuery, calculateOffset } from './core';

export const getMemoryById = async (id: string): Promise<Memory | null> => {
  const query = await getMemoryQuery();
  
  const { data, error } = await query
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

  const query = await getMemoryQuery();
  
  let queryBuilder = query
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (visibility) queryBuilder = queryBuilder.eq('visibility', visibility);
  if (teamId) queryBuilder = queryBuilder.eq('teamId', teamId);
  
  queryBuilder = queryBuilder.range(
    calculateOffset(page, pageSize),
    calculateOffset(page, pageSize) + pageSize - 1
  );

  const { data, error, count } = await queryBuilder;

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

  const query = await getMemoryQuery();
  
  let queryBuilder = query
    .eq('visibility', 'public')
    .order('createdAt', { ascending: false });

  if (teamId) queryBuilder = queryBuilder.eq('teamId', teamId);
  if (tags && tags.length > 0) {
    queryBuilder = queryBuilder.contains('tags', tags);
  }
  if (search) {
    queryBuilder = queryBuilder.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  queryBuilder = queryBuilder.range(
    calculateOffset(page, pageSize),
    calculateOffset(page, pageSize) + pageSize - 1
  );

  const { data, error, count } = await queryBuilder;

  if (error) throw new Error(`Failed to fetch public memories: ${error.message}`);
  
  return {
    memories: (data || []) as Memory[],
    total: count || 0
  };
};
