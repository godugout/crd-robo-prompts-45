
import type { Memory } from '@/types/memory';
import type { MemoryListOptions, PaginatedMemories } from './types';
import { getMemoryQuery, calculateOffset } from './core';

export const getMemoryById = async (id: string): Promise<Memory | null> => {
  const { data, error } = await getMemoryQuery()
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

  let query = getMemoryQuery()
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (visibility) query = query.eq('visibility', visibility);
  if (teamId) query = query.eq('teamId', teamId);
  
  query = query.range(
    calculateOffset(page, pageSize),
    calculateOffset(page, pageSize) + pageSize - 1
  );

  const { data, error, count } = await query;

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

  let query = getMemoryQuery()
    .eq('visibility', 'public')
    .order('createdAt', { ascending: false });

  if (teamId) query = query.eq('teamId', teamId);
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
    memories: (data || []) as Memory[],
    total: count || 0
  };
};

