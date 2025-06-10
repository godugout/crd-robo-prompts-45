
import React, { useState, useCallback } from 'react';
import { useUser } from '@/hooks/use-user';
import { useProfile } from '@/hooks/useProfile';
import { useUserCards } from '@/hooks/useUserCards';
import { useUserMemories } from '@/hooks/useUserMemories';
import { getUserFollowers, getUserFollowing } from '@/repositories/social/follows';

export const usePaginatedProfile = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('memories');
  const [cardsPage, setCardsPage] = useState(1);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  
  const { profile, isLoading: profileLoading } = useProfile(user?.id);
  
  // Paginated cards with caching
  const { 
    userCards, 
    loading: cardsLoading, 
    hasMore: hasMoreCards, 
    total: totalCards,
    loadMore: getLoadMoreCards 
  } = useUserCards(user?.id, { page: cardsPage, pageSize: 12 });
  
  // Keep memories simple for now (usually fewer items)
  const { memories, loading: memoriesLoading } = useUserMemories(user?.id);

  const loadMoreCards = useCallback(() => {
    const nextPageInfo = getLoadMoreCards();
    if (nextPageInfo) {
      setCardsPage(nextPageInfo.page);
    }
  }, [getLoadMoreCards]);

  // Load follower counts (only once)
  const loadSocialCounts = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const [followerData, followingData] = await Promise.all([
        getUserFollowers(user.id),
        getUserFollowing(user.id)
      ]);
      
      setFollowers(followerData.length);
      setFollowing(followingData.length);
    } catch (error) {
      console.error('Error fetching follower/following data:', error);
    }
  }, [user?.id]);

  // Load social counts when user is available
  React.useEffect(() => {
    loadSocialCounts();
  }, [loadSocialCounts]);

  const isLoading = userLoading || profileLoading;

  return {
    user,
    profile,
    isLoading,
    activeTab,
    setActiveTab,
    // Cards data
    userCards,
    cardsLoading,
    hasMoreCards,
    totalCards,
    loadMoreCards,
    // Memories data  
    memories,
    memoriesLoading,
    // Social data
    followers,
    following
  };
};
