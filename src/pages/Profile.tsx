import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingState } from '@/components/common/LoadingState';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { useProfilePage } from '@/hooks/useProfilePage';
import { useCards } from '@/hooks/useCards';
import { useUserMemories } from '@/hooks/useUserMemories';
import type { Memory } from '@/types/memory';

// Create a unified card interface that matches both Memory and Card types
interface UnifiedCard extends Memory {
  // Add card-specific properties as optional
  rarity?: string;
  design_metadata?: Record<string, any>;
  creator_id?: string;
  image_url?: string;
  thumbnail_url?: string;
  is_public?: boolean;
}

const Profile = () => {
  const {
    user,
    profile,
    isLoading,
    activeTab,
    setActiveTab,
    followers,
    following
  } = useProfilePage();

  const { userCards, loading: cardsLoading } = useCards();
  const { memories, loading: memoriesLoading } = useUserMemories(user?.id);

  if (isLoading) {
    return <LoadingState message="Loading profile..." fullPage size="lg" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Please sign in to view your profile</h2>
            <Link to="/auth">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = user.full_name || user.username || user.email || 'User';
  const bioText = profile?.bio_extended || '';
  const avatarUrl = profile?.avatar_url || '';

  // Convert cards to unified format
  const unifiedCards: UnifiedCard[] = userCards.map(card => ({
    id: card.id,
    userId: card.creator_id,
    title: card.title,
    description: card.description,
    teamId: '', // Set empty string since team_id doesn't exist on Card type
    visibility: 'public' as const,
    createdAt: card.created_at,
    tags: card.tags || [],
    metadata: card.design_metadata || {},
    // Card-specific properties
    rarity: card.rarity,
    design_metadata: card.design_metadata,
    creator_id: card.creator_id,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    is_public: card.is_public
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-6xl">
        <ProfileHeader
          user={user}
          profile={profile}
          displayName={displayName}
          bioText={bioText}
          avatarUrl={avatarUrl}
        />

        <Card className="mb-8">
          <ProfileStats
            memoriesCount={unifiedCards.length + memories.length}
            followers={followers}
            following={following}
          />
        </Card>

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          memories={[...unifiedCards, ...memories]}
          memoriesLoading={cardsLoading || memoriesLoading}
          hasMore={false}
          onLoadMore={() => {}}
        />
      </div>
    </div>
  );
};

export default Profile;
