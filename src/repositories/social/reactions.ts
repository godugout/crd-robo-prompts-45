
import { supabase } from '@/lib/supabase-client';
import type { Reaction, ReactionCount } from '@/types/social';

export interface ReactionParams {
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

export const addReaction = async (params: ReactionParams): Promise<Reaction> => {
  try {
    const { data, error } = await supabase
      .from('reactions')
      .insert({
        user_id: params.userId,
        card_id: params.memoryId, // Using card_id instead of memory_id
        collection_id: params.collectionId,
        comment_id: params.commentId,
        type: params.type
      })
      .select('*, user:profiles(*)')
      .single();
      
    if (error) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      memoryId: data.card_id, // Map from card_id to memoryId
      collectionId: data.collection_id,
      commentId: data.comment_id,
      type: data.type,
      createdAt: data.created_at,
      user: data.user ? {
        id: data.user.id,
        username: data.user.username,
        profileImage: data.user.avatar_url
      } : undefined
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

export const removeReaction = async (params: ReactionParams): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('user_id', params.userId)
      .eq('type', params.type);
      
    if (params.memoryId) {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user?.id) {
          // Update only if we have a valid user
          supabase
            .from('reactions')
            .delete()
            .eq('card_id', params.memoryId)
            .eq('user_id', data.session.user.id)
            .eq('type', params.type);
        }
      });
    }
      
    if (params.collectionId) {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user?.id) {
          supabase
            .from('reactions')
            .delete()
            .eq('collection_id', params.collectionId)
            .eq('user_id', data.session.user.id)
            .eq('type', params.type);
        }
      });
    }
      
    if (params.commentId) {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user?.id) {
          supabase
            .from('reactions')
            .delete()
            .eq('comment_id', params.commentId)
            .eq('user_id', data.session.user.id)
            .eq('type', params.type);
        }
      });
    }
      
    if (error) {
      throw new Error(`Failed to remove reaction: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in removeReaction:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', params.userId);
      queryParams.append('type', params.type);
      
      if (params.memoryId) queryParams.append('memoryId', params.memoryId);
      if (params.collectionId) queryParams.append('collectionId', params.collectionId);
      if (params.commentId) queryParams.append('commentId', params.commentId);
      
      const response = await fetch(`/api/reactions?${queryParams.toString()}`, {
        method: 'DELETE'
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
    let query = supabase
      .from('reactions')
      .select('*, user:profiles(*)', { count: 'exact' });
    
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
    
    // Count reactions by type manually
    const typeCounts: Record<string, number> = {};
    data?.forEach(reaction => {
      if (typeCounts[reaction.type]) {
        typeCounts[reaction.type]++;
      } else {
        typeCounts[reaction.type] = 1;
      }
    });
    
    const counts: ReactionCount[] = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));
    
    const reactions = (data || []).map(reaction => ({
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
    }));
    
    return {
      reactions,
      counts
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
