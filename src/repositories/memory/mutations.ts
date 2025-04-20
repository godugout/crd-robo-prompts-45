
import { supabase } from '@/lib/supabase-client';
import type { Memory } from '@/types/memory';
import type { CreateMemoryParams, UpdateMemoryParams } from './types';
import { getMemoryById } from './queries';
import { getAppId } from '@/integrations/supabase/client';

export const createMemory = async (params: CreateMemoryParams): Promise<Memory> => {
  try {
    // Get app_id if available
    const appId = await getAppId();
    
    const { data, error } = await supabase
      .from('memories')
      .insert({
        user_id: params.userId,
        title: params.title,
        description: params.description,
        team_id: params.teamId,
        game_id: params.gameId,
        location: params.location,
        visibility: params.visibility,
        tags: params.tags || [],
        metadata: params.metadata,
        app_id: appId
      })
      .select('*, media(*)')
      .single();

    if (error) throw new Error(`Failed to create memory: ${error.message}`);
    if (!data) throw new Error('No data returned after creating memory');

    return data as Memory;
  } catch (error) {
    console.error('Error in createMemory:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: params.userId,
          title: params.title,
          description: params.description,
          teamId: params.teamId,
          gameId: params.gameId,
          location: params.location,
          visibility: params.visibility,
          tags: params.tags,
          metadata: params.metadata
        })
      });
      
      if (!response.ok) {
        throw new Error(`Mock API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      throw error;
    }
  }
};

export const updateMemory = async (params: UpdateMemoryParams): Promise<Memory> => {
  try {
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
  } catch (error) {
    console.error('Error in updateMemory:', error);
    
    // Try using the mock API as a fallback
    try {
      const updates: any = {};
      
      if (params.title !== undefined) updates.title = params.title;
      if (params.description !== undefined) updates.description = params.description;
      if (params.location !== undefined) updates.location = params.location;
      if (params.visibility !== undefined) updates.visibility = params.visibility;
      if (params.tags !== undefined) updates.tags = params.tags;
      if (params.metadata !== undefined) updates.metadata = params.metadata;
      
      const response = await fetch(`/api/cards/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`Mock API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      throw error;
    }
  }
};
