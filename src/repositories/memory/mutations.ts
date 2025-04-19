
import { supabase } from '@/lib/supabase-client';
import type { Memory } from '@/types/memory';
import type { CreateMemoryParams, UpdateMemoryParams } from './types';
import { getMemoryQuery } from './core';

export const createMemory = async (params: CreateMemoryParams): Promise<Memory> => {
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
};

export const updateMemory = async (params: UpdateMemoryParams): Promise<Memory> => {
  const updates: Partial<Memory> = {};
  
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
};
