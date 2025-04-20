
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
  
  // Correctly extract the nested user objects from the Supabase response
  if (!data || data.length === 0) return [];
  
  // Map through the data and extract the follower objects
  const followers = data.map(item => {
    // Ensure follower exists and has the expected structure
    if (item && item.follower && typeof item.follower === 'object' && !Array.isArray(item.follower)) {
      // Convert to User type with proper type checking
      const user = item.follower as Record<string, any>;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
        preferences: user.preferences
      } as User;
    }
    return null;
  }).filter((user): user is User => user !== null);
  
  return followers;
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('followed:users!follows_followedId_fkey(*)')
    .eq('followerId', userId);

  if (error) throw error;
  
  // Correctly extract the nested user objects from the Supabase response
  if (!data || data.length === 0) return [];
  
  // Map through the data and extract the followed objects
  const following = data.map(item => {
    // Ensure followed exists and has the expected structure
    if (item && item.followed && typeof item.followed === 'object' && !Array.isArray(item.followed)) {
      // Convert to User type with proper type checking
      const user = item.followed as Record<string, any>;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
        preferences: user.preferences
      } as User;
    }
    return null;
  }).filter((user): user is User => user !== null);
  
  return following;
};
