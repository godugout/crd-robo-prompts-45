
import { supabase } from '@/lib/supabase-client';
import type { Reaction } from '@/types/social';

export interface AddReactionParams {
  userId: string;
  memoryId?: string;
  collectionId?: string;
  commentId?: string;
  type: string;
}

export const addReaction = async (params: AddReactionParams): Promise<Reaction> => {
  try {
    // Check if the reaction already exists
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('*')
      .eq('user_id', params.userId)
      .eq('type', params.type)
      .eq('card_id', params.memoryId || null)
      .eq('collection_id', params.collectionId || null)
      .eq('comment_id', params.commentId || null)
      .maybeSingle();
      
    if (existingReaction) {
      // Remove the existing reaction
      await supabase
        .from('reactions')
        .delete()
        .eq('id', existingReaction.id);
        
      return {
        id: existingReaction.id,
        userId: existingReaction.user_id,
        memoryId: existingReaction.card_id,
        collectionId: existingReaction.collection_id,
        commentId: existingReaction.comment_id,
        type: existingReaction.type,
        createdAt: existingReaction.created_at,
        removed: true
      };
    }
    
    // Create a new reaction
    const { data, error } = await supabase
      .from('reactions')
      .insert({
        user_id: params.userId,
        card_id: params.memoryId,
        collection_id: params.collectionId,
        comment_id: params.commentId,
        type: params.type
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      memoryId: data.card_id,
      collectionId: data.collection_id,
      commentId: data.comment_id,
      type: data.type,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error in addReaction:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: params.userId,
          memoryId: params.memoryId,
          collectionId: params.collectionId,
          commentId: params.commentId,
          type: params.type
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

export const getReactionsByContentId = async (
  contentType: 'memory' | 'collection' | 'comment',
  contentId: string
): Promise<Reaction[]> => {
  try {
    let query = supabase.from('reactions').select('*');
    
    if (contentType === 'memory') {
      query = query.eq('card_id', contentId);
    } else if (contentType === 'collection') {
      query = query.eq('collection_id', contentId);
    } else if (contentType === 'comment') {
      query = query.eq('comment_id', contentId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to get reactions: ${error.message}`);
    }
    
    return (data || []).map(reaction => ({
      id: reaction.id,
      userId: reaction.user_id,
      memoryId: reaction.card_id,
      collectionId: reaction.collection_id,
      commentId: reaction.comment_id,
      type: reaction.type,
      createdAt: reaction.created_at
    }));
  } catch (error) {
    console.error('Error in getReactionsByContentId:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      
      if (contentType === 'memory') {
        queryParams.append('memoryId', contentId);
      } else if (contentType === 'collection') {
        queryParams.append('collectionId', contentId);
      } else if (contentType === 'comment') {
        queryParams.append('commentId', contentId);
      }
      
      const response = await fetch(`/api/reactions?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Mock API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return [];
    }
  }
};
