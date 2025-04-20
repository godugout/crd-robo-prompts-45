
import { supabase } from '@/lib/supabase-client';
import type { Comment } from '@/types/social';

export interface AddCommentParams {
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  content: string;
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
      } : undefined
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

export const getCommentsByContentId = async (
  contentType: 'card' | 'collection' | 'team',
  contentId: string
): Promise<Comment[]> => {
  try {
    let query = supabase
      .from('comments')
      .select('*, user:profiles(*), replies:comments(*, user:profiles(*))')
      .order('created_at', { ascending: false });
    
    if (contentType === 'card') {
      query = query.eq('card_id', contentId);
    } else if (contentType === 'collection') {
      query = query.eq('collection_id', contentId);
    } else if (contentType === 'team') {
      query = query.eq('team_id', contentId);
    }
    
    // Only get top-level comments
    query = query.is('parent_id', null);
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
    
    return (data || []).map(comment => ({
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
      replies: comment.replies ? comment.replies.map((reply: any) => ({
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
      })) : []
    }));
  } catch (error) {
    console.error('Error in getCommentsByContentId:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      
      if (contentType === 'card') {
        queryParams.append('cardId', contentId);
      } else if (contentType === 'collection') {
        queryParams.append('collectionId', contentId);
      } else if (contentType === 'team') {
        queryParams.append('teamId', contentId);
      }
      
      const response = await fetch(`/api/comments?${queryParams.toString()}`);
      
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
