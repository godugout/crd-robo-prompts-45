
import { supabase } from '@/lib/supabase-client';
import type { User } from '@/types/user';

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
    .select('follower:users!follows_followerId_fkey(*)')
    .eq('followedId', userId);

  if (error) throw error;
  
  // Extract the follower object and ensure it matches the User type
  return data.map(item => item.follower) as User[];
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('followed:users!follows_followedId_fkey(*)')
    .eq('followerId', userId);

  if (error) throw error;
  
  // Extract the followed object and ensure it matches the User type
  return data.map(item => item.followed) as User[];
};
