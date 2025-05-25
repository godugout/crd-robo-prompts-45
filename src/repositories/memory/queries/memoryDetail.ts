
import { supabase } from '@/lib/supabase-client';
import type { Memory } from '@/types/memory';

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
      commentCount: commentCount || 0,
      reactions: Object.entries(reactionCounts).map(([type, count]) => ({ type, count }))
    };
  } catch (error) {
    console.error('Error in getMemoryById:', error);
    return null;
  }
};
