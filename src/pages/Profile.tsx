
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { useProfilePage } from '@/hooks/useProfilePage';

const Profile = () => {
  const {
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
  } = useProfilePage();

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
