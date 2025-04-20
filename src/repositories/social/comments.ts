
import { supabase } from '@/lib/supabase-client';
import type { CommentResponse, Comment } from '@/types/social';

export const addComment = async (
  userId: string,
  content: string,
  target: { memoryId?: string; collectionId?: string; parentCommentId?: string }
): Promise<Comment> => {
  const { memoryId, collectionId, parentCommentId } = target;
  
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        userId,
        content,
        memoryId,
        collectionId,
        parentCommentId
      }
    ])
    .select('*, user:users(*), reactions(*)')
    .single();

  if (error) throw error;
  return data;
};

export const updateComment = async (
  commentId: string,
  userId: string,
  content: string
): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .match({ id: commentId, userId })
    .select('*, user:users(*), reactions(*)')
    .single();

  if (error) throw error;
  return data;
};

export const deleteComment = async (commentId: string, userId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .match({ id: commentId, userId });

  if (error) throw error;
};

export const getComments = async (
  params: {
    memoryId?: string;
    collectionId?: string;
    parentCommentId?: string;
    page?: number;
    limit?: number;
  }
): Promise<CommentResponse> => {
  const { memoryId, collectionId, parentCommentId, page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;

  // Get comments with user data and reactions
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*, user:users(*), reactions(*)')
    .match({ memoryId, collectionId, parentCommentId })
    .range(offset, offset + limit - 1)
    .order('createdAt', { ascending: false });

  if (commentsError) throw commentsError;

  // Count total comments for pagination
  const { count, error: countError } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .match({ memoryId, collectionId, parentCommentId });

  if (countError) throw countError;

  // Count replies for each comment
  const commentsWithReplyCounts = await Promise.all(
    comments.map(async (comment) => {
      const { count: replyCount, error: replyError } = await supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .eq('parentCommentId', comment.id);
      
      if (replyError) throw replyError;
      
      return {
        ...comment,
        replyCount: replyCount || 0
      };
    })
  );

  return {
    comments: commentsWithReplyCounts,
    total: count || 0,
    hasMore: (count || 0) > page * limit
  };
};
