
import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFeed } from '@/hooks/use-feed';
import { getUserFollowers, getUserFollowing } from '@/repositories/social/follows';
import { LoadingState } from '@/components/common/LoadingState';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

const Profile = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('memories');
  const { 
    profile, 
    isLoading: profileLoading 
  } = useProfile(user?.id);
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

  if (isLoading) {
    return <LoadingState message="Loading profile..." fullPage size="lg" />;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Please sign in to view your profile</h2>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const bioText = profile?.full_name || 'No bio set yet';
  const displayName = profile?.username || profile?.full_name || user.email;
  const avatarUrl = profile?.avatar_url || '';

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ProfileHeader 
        user={user}
        profile={profile}
        displayName={displayName}
        bioText={bioText}
        avatarUrl={avatarUrl}
      />
      <ProfileStats 
        memoriesCount={memories.length}
        followers={followers}
        following={following}
      />
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        memories={memories}
        memoriesLoading={memoriesLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default Profile;
