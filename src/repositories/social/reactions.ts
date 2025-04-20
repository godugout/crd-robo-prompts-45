
import { supabase } from '@/lib/supabase-client';
import type { Reaction, ReactionCount } from '@/types/social';

export interface AddReactionParams {
  userId: string;
  type: string;
  memoryId?: string;
  collectionId?: string;
  commentId?: string;
}

export interface GetReactionsParams {
  memoryId?: string;
  collectionId?: string;
  commentId?: string;
}

export interface ReactionsResponse {
  reactions: Reaction[];
  counts: ReactionCount[];
}

export const addReaction = async (userId: string, type: string, params: Omit<AddReactionParams, 'userId' | 'type'>): Promise<Reaction> => {
  try {
    // Check if the reaction already exists
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
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
        user_id: userId,
        card_id: params.memoryId,
        collection_id: params.collectionId,
        comment_id: params.commentId,
        type: type
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
          userId,
          memoryId: params.memoryId,
          collectionId: params.collectionId,
          commentId: params.commentId,
          type
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

export const removeReaction = async (userId: string, type: string, params: Omit<AddReactionParams, 'userId' | 'type'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('user_id', userId)
      .eq('type', type)
      .eq('card_id', params.memoryId || null)
      .eq('collection_id', params.collectionId || null)
      .eq('comment_id', params.commentId || null);
    
    if (error) {
      throw new Error(`Failed to remove reaction: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in removeReaction:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch('/api/reactions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          memoryId: params.memoryId,
          collectionId: params.collectionId,
          commentId: params.commentId,
          type
        })
      });
      
      if (!response.ok) {
        throw new Error(`Mock API error: ${response.status}`);
      }
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      throw error;
    }
  }
};

export const getReactions = async (params: GetReactionsParams): Promise<ReactionsResponse> => {
  try {
    let query = supabase.from('reactions').select('*, user:profiles(*)');
    
    if (params.memoryId) {
      query = query.eq('card_id', params.memoryId);
    } else if (params.collectionId) {
      query = query.eq('collection_id', params.collectionId);
    } else if (params.commentId) {
      query = query.eq('comment_id', params.commentId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to get reactions: ${error.message}`);
    }
    
    // Get counts by type
    const counts: Record<string, number> = {};
    data.forEach(reaction => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    });
    
    const countsList: ReactionCount[] = Object.entries(counts).map(([type, count]) => ({
      type,
      count
    }));
    
    return {
      reactions: (data || []).map(reaction => ({
        id: reaction.id,
        userId: reaction.user_id,
        memoryId: reaction.card_id,
        collectionId: reaction.collection_id,
        commentId: reaction.comment_id,
        type: reaction.type,
        createdAt: reaction.created_at,
        user: reaction.user ? {
          id: reaction.user.id,
          username: reaction.user.username,
          profileImage: reaction.user.avatar_url
        } : undefined
      })),
      counts: countsList
    };
  } catch (error) {
    console.error('Error in getReactions:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      
      if (params.memoryId) {
        queryParams.append('memoryId', params.memoryId);
      } else if (params.collectionId) {
        queryParams.append('collectionId', params.collectionId);
      } else if (params.commentId) {
        queryParams.append('commentId', params.commentId);
      }
      
      const response = await fetch(`/api/reactions?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Mock API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        reactions: data.items || [],
        counts: data.counts || []
      };
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return {
        reactions: [],
        counts: []
      };
    }
  }
};
