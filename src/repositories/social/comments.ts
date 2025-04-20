
import { supabase } from '@/lib/supabase-client';
import type { Comment } from '@/types/social';

export interface AddCommentParams {
  userId: string;
  content: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
}

export interface GetCommentsParams {
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string; // Changed from parentCommentId to parentId
  page?: number;
  limit?: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  hasMore: boolean;
}

export const addComment = async (params: AddCommentParams): Promise<Comment> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: params.userId,
        card_id: params.cardId,
        collection_id: params.collectionId,
        team_id: params.teamId,
        parent_id: params.parentId,
        content: params.content
      })
      .select('*, user:profiles(*)')
      .single();
      
    if (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      cardId: data.card_id,
      collectionId: data.collection_id,
      teamId: data.team_id,
      parentId: data.parent_id,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      user: data.user ? {
        id: data.user.id,
        username: data.user.username,
        profileImage: data.user.avatar_url
      } : undefined,
      replyCount: 0
    };
  } catch (error) {
    console.error('Error in addComment:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: params.userId,
          cardId: params.cardId,
          collectionId: params.collectionId,
          teamId: params.teamId,
          parentId: params.parentId,
          content: params.content
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

export const getComments = async (params: GetCommentsParams): Promise<CommentsResponse> => {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('comments')
      .select('*, user:profiles(*), replies:comments!parent_id(*, user:profiles(*))', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (params.cardId) {
      query = query.eq('card_id', params.cardId);
    } else if (params.collectionId) {
      query = query.eq('collection_id', params.collectionId);
    } else if (params.teamId) {
      query = query.eq('team_id', params.teamId);
    }
    
    if (params.parentId) {
      query = query.eq('parent_id', params.parentId);
    } else {
      query = query.is('parent_id', null);
    }
    
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
    
    const comments = (data || []).map(comment => ({
      id: comment.id,
      userId: comment.user_id,
      cardId: comment.card_id,
      collectionId: comment.collection_id,
      teamId: comment.team_id,
      parentId: comment.parent_id,
      content: comment.content,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      user: comment.user ? {
        id: comment.user.id,
        username: comment.user.username,
        profileImage: comment.user.avatar_url
      } : undefined,
      replyCount: (comment.replies || []).length,
      replies: (comment.replies || []).map((reply: any) => ({
        id: reply.id,
        userId: reply.user_id,
        cardId: reply.card_id,
        collectionId: reply.collection_id,
        teamId: reply.team_id,
        parentId: reply.parent_id,
        content: reply.content,
        createdAt: reply.created_at,
        updatedAt: reply.updated_at,
        user: reply.user ? {
          id: reply.user.id,
          username: reply.user.username,
          profileImage: reply.user.avatar_url
        } : undefined
      }))
    }));
    
    return {
      comments,
      total: count || 0,
      hasMore: count ? offset + limit < count : false
    };
  } catch (error) {
    console.error('Error in getComments:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      
      if (params.cardId) {
        queryParams.append('cardId', params.cardId);
      } else if (params.collectionId) {
        queryParams.append('collectionId', params.collectionId);
      } else if (params.teamId) {
        queryParams.append('teamId', params.teamId);
      }
      
      if (params.parentId) {
        queryParams.append('parentId', params.parentId);
      }
      
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      const response = await fetch(`/api/comments?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Mock API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        comments: data.items || [],
        total: data.total || 0,
        hasMore: data.hasMore || false
      };
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return {
        comments: [],
        total: 0,
        hasMore: false
      };
    }
  }
};

export const updateComment = async (commentId: string, userId: string, content: string): Promise<Comment> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .eq('user_id', userId) // Ensure user owns the comment
      .select('*, user:profiles(*)')
      .single();
    
    if (error) {
      throw new Error(`Failed to update comment: ${error.message}`);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      cardId: data.card_id,
      collectionId: data.collection_id,
      teamId: data.team_id,
      parentId: data.parent_id,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      user: data.user ? {
        id: data.user.id,
        username: data.user.username,
        profileImage: data.user.avatar_url
      } : undefined,
      replyCount: data.reply_count || 0
    };
  } catch (error) {
    console.error('Error in updateComment:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          content
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

export const deleteComment = async (commentId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId); // Ensure user owns the comment
    
    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteComment:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
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
