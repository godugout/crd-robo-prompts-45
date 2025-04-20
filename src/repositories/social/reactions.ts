
import { supabase } from '@/lib/supabase-client';
import type { ReactionResponse, Reaction } from '@/types/social';

export const addReaction = async (
  userId: string,
  type: Reaction['type'],
  target: { memoryId?: string; collectionId?: string; commentId?: string }
): Promise<Reaction> => {
  const { memoryId, collectionId, commentId } = target;
  
  const { data, error } = await supabase
    .from('reactions')
    .insert([
      {
        userId,
        type,
        memoryId,
        collectionId,
        commentId
      }
    ])
    .select('*, user:users(*)')
    .single();

  if (error) throw error;
  return data;
};

export const removeReaction = async (
  userId: string,
  type: string,
  target: { memoryId?: string; collectionId?: string; commentId?: string }
) => {
  const { memoryId, collectionId, commentId } = target;
  const { error } = await supabase
    .from('reactions')
    .delete()
    .match({ userId, type, memoryId, collectionId, commentId });

  if (error) throw error;
};

export const getReactions = async (
  target: { memoryId?: string; collectionId?: string; commentId?: string }
): Promise<ReactionResponse> => {
  const { memoryId, collectionId, commentId } = target;

  // Fetch reactions with user data
  const { data: reactions, error: reactionsError } = await supabase
    .from('reactions')
    .select('*, user:users(*)')
    .match({ memoryId, collectionId, commentId });

  if (reactionsError) throw reactionsError;

  // Count reactions by type
  const { data: countsData, error: countsError } = await supabase
    .rpc('count_reactions_by_type', { 
      memory_id: memoryId, 
      collection_id: collectionId, 
      comment_id: commentId 
    });

  if (countsError) throw countsError;

  // Transform the counts into the expected format
  const counts = countsData.map(item => ({
    type: item.type,
    count: item.count
  }));

  return {
    reactions,
    counts
  };
};
