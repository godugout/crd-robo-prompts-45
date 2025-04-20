
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useProfile } from '@/hooks/useProfile';
import { useFeed } from '@/hooks/use-feed';
import { getUserFollowers, getUserFollowing } from '@/repositories/social/follows';

export const useProfilePage = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('memories');
  const { profile, isLoading: profileLoading } = useProfile(user?.id);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);

  const {
    memories,
    loading: memoriesLoading,
    hasMore,
    page,
    setPage,
    fetchMemories
  } = useFeed(user?.id);

  useEffect(() => {
    const getFollowerAndFollowingCounts = async () => {
      if (!user?.id) return;
      
      try {
        const followerData = await getUserFollowers(user.id);
        const followingData = await getUserFollowing(user.id);
        
        setFollowers(followerData.length);
        setFollowing(followingData.length);
      } catch (error) {
        console.error('Error fetching follower/following data:', error);
      }
    };
    
    getFollowerAndFollowingCounts();
  }, [user?.id]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMemories(nextPage, 'forYou');
  };

  const isLoading = userLoading || profileLoading;

  return {
    user,
    profile,
    isLoading,
    activeTab,
    setActiveTab,
    memories,
    memoriesLoading,
    hasMore,
    handleLoadMore,
    followers,
    following
  };
};
