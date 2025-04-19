
import { supabase } from '@/lib/supabase-client';
import { deleteMedia } from '@/lib/mediaManager';
import type { Database } from '@/types/supabase';
import type { Memory } from '@/types/memory';

export interface CreateMemoryParams {
  userId: string;
  title: string;
  description?: string;
  teamId: string;
  gameId?: string;
  location?: { latitude: number; longitude: number };
  visibility: 'public' | 'private' | 'shared';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateMemoryParams {
  id: string;
  title?: string;
  description?: string;
  location?: { latitude: number; longitude: number } | null;
  visibility?: 'public' | 'private' | 'shared';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface MemoryListOptions {
  page?: number;
  pageSize?: number;
  visibility?: 'public' | 'private' | 'shared';
  teamId?: string;
  tags?: string[];
  search?: string;
}

export interface PaginatedMemories {
  memories: Memory[];
  total: number;
}

export class MemoryRepository {
  private static calculateOffset(page = 1, pageSize = 10): number {
    return (page - 1) * pageSize;
  }

  static async createMemory(params: CreateMemoryParams): Promise<Memory> {
    const { data, error } = await supabase
      .from('memories')
      .insert({
        userId: params.userId,
        title: params.title,
        description: params.description,
        teamId: params.teamId,
        gameId: params.gameId,
        location: params.location,
        visibility: params.visibility,
        tags: params.tags || [],
        metadata: params.metadata
      })
      .select('*, media(*)')
      .single();

    if (error) throw new Error(`Failed to create memory: ${error.message}`);
    if (!data) throw new Error('No data returned after creating memory');

    return data as Memory;
  }

  static async getMemoryById(id: string): Promise<Memory | null> {
    const { data, error } = await supabase
      .from('memories')
      .select('*, media(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(`Failed to fetch memory: ${error.message}`);
    }

    return data as Memory | null;
  }

  static async updateMemory(params: UpdateMemoryParams): Promise<Memory> {
    const updates: Partial<Memory> = {};
    
    // Only include defined fields in the update
    if (params.title !== undefined) updates.title = params.title;
    if (params.description !== undefined) updates.description = params.description;
    if (params.location !== undefined) updates.location = params.location;
    if (params.visibility !== undefined) updates.visibility = params.visibility;
    if (params.tags !== undefined) updates.tags = params.tags;
    if (params.metadata !== undefined) updates.metadata = params.metadata;

    const { data, error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', params.id)
      .select('*, media(*)')
      .single();

    if (error) throw new Error(`Failed to update memory: ${error.message}`);
    if (!data) throw new Error(`Memory not found: ${params.id}`);

    return data as Memory;
  }

  static async deleteMemory(id: string): Promise<void> {
    // First, fetch the memory to get associated media
    const memory = await this.getMemoryById(id);
    if (!memory) throw new Error(`Memory not found: ${id}`);

    // Delete all associated media files and records
    const deleteMediaPromises = memory.media?.map(media => 
      deleteMedia(media.id, memory.userId)
    ) || [];

    await Promise.all(deleteMediaPromises);

    // Finally delete the memory (this will cascade delete media records)
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete memory: ${error.message}`);
  }

  static async getMemoriesByUserId(
    userId: string, 
    options: MemoryListOptions = {}
  ): Promise<PaginatedMemories> {
    const {
      page = 1,
      pageSize = 10,
      visibility,
      teamId,
    } = options;

    let query = supabase
      .from('memories')
      .select('*, media(*)', { count: 'exact' })
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (visibility) query = query.eq('visibility', visibility);
    if (teamId) query = query.eq('teamId', teamId);
    
    query = query
      .range(
        this.calculateOffset(page, pageSize),
        this.calculateOffset(page, pageSize) + pageSize - 1
      );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch memories: ${error.message}`);
    
    return {
      memories: (data || []) as Memory[],
      total: count || 0
    };
  }

  static async getPublicMemories(
    options: MemoryListOptions = {}
  ): Promise<PaginatedMemories> {
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
      .order('createdAt', { ascending: false });

    if (teamId) query = query.eq('teamId', teamId);
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query
      .range(
        this.calculateOffset(page, pageSize),
        this.calculateOffset(page, pageSize) + pageSize - 1
      );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch public memories: ${error.message}`);
    
    return {
      memories: (data || []) as Memory[],
      total: count || 0
    };
  }
}
