
import { supabase } from '@/lib/supabase-client';
import type { ReactionResponse, Reaction, CommentResponse, Comment } from '@/types/social';
import type { User } from '@/types/user';

// Reaction functions
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

  const [reactionsResponse, countsResponse] = await Promise.all([
    supabase
      .from('reactions')
      .select('*, user:users(*)')
      .match({ memoryId, collectionId, commentId }),
    supabase
      .from('reactions')
      .select('type, count(*)')
      .match({ memoryId, collectionId, commentId })
      .group('type')
  ]);

  if (reactionsResponse.error) throw reactionsResponse.error;
  if (countsResponse.error) throw countsResponse.error;

  return {
    reactions: reactionsResponse.data,
    counts: countsResponse.data
  };
};

// Comment functions
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

  const [commentsResponse, totalResponse] = await Promise.all([
    supabase
      .from('comments')
      .select('*, user:users(*), reactions(*)')
      .match({ memoryId, collectionId, parentCommentId })
      .range(offset, offset + limit - 1)
      .order('createdAt', { ascending: false }),
    supabase
      .from('comments')
      .select('id', { count: 'exact' })
      .match({ memoryId, collectionId, parentCommentId })
  ]);

  if (commentsResponse.error) throw commentsResponse.error;
  if (totalResponse.error) throw totalResponse.error;

  return {
    comments: commentsResponse.data,
    total: totalResponse.count || 0,
    hasMore: (totalResponse.count || 0) > page * limit
  };
};

// Follow functions
export const followUser = async (followerId: string, followedId: string): Promise<void> => {
  const { error } = await supabase
    .from('follows')
    .insert([{ followerId, followedId }]);

  if (error) throw error;
};

export const unfollowUser = async (followerId: string, followedId: string): Promise<void> => {
  const { error } = await supabase
    .from('follows')
    .delete()
    .match({ followerId, followedId });

  if (error) throw error;
};

export const isFollowingUser = async (followerId: string, followedId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .match({ followerId, followedId })
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

export const getUserFollowers = async (userId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('follower:users!followerId(*)')
    .eq('followedId', userId);

  if (error) throw error;
  return data.map(row => row.follower);
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('followed:users!followedId(*)')
    .eq('followerId', userId);

  if (error) throw error;
  return data.map(row => row.followed);
};

