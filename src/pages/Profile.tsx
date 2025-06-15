import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CRDButton } from '@/components/ui/design-system';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingState } from '@/components/common/LoadingState';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { usePaginatedProfile } from '@/hooks/usePaginatedProfile';
import { ProfileService } from '@/features/auth/services/profileService';
import { Edit, Settings, Loader } from 'lucide-react';
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
    userCards,
    cardsLoading,
    hasMoreCards,
    totalCards,
    loadMoreCards,
    memories,
    memoriesLoading,
    followers,
    following
  } = usePaginatedProfile();

  if (isLoading) {
    return <LoadingState message="Loading profile..." fullPage size="lg" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <Card className="bg-crd-dark border-crd-mediumGray p-6 max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-crd-white">Please sign in to view your profile</h2>
            <Link to="/auth">
              <CRDButton variant="primary" className="w-full">
                Sign In
              </CRDButton>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = user.full_name || user.username || user.email || 'User';
  const bioText = profile?.bio_extended || '';
  const avatarUrl = profile?.avatar_url || ProfileService.getDefaultAvatarUrl();
  const isDefaultAvatar = !profile?.avatar_url || profile.avatar_url === ProfileService.getDefaultAvatarUrl();

  // Convert cards to unified format
  const unifiedCards: UnifiedCard[] = userCards.map(card => ({
    id: card.id,
    userId: card.creator_id || user.id || '',
    title: card.title,
    description: card.description,
    teamId: '', // Set empty string since team_id doesn't exist on Card type
    visibility: card.is_public ? 'public' : 'private',
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
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Profile Header */}
        <Card className="bg-crd-dark border-crd-mediumGray mb-8">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex flex-1 space-x-4 items-center">
              <Avatar className="h-20 w-20 border-2 border-crd-blue">
                <AvatarImage 
                  src={avatarUrl} 
                  alt={displayName}
                  style={isDefaultAvatar ? ProfileService.getInvertedAvatarStyle() : undefined}
                />
                <AvatarFallback className="text-2xl bg-crd-mediumGray text-crd-white">
                  {(displayName?.[0] || '').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl text-crd-white">{displayName}</CardTitle>
                <CardDescription className="text-crd-lightGray">{bioText}</CardDescription>
                {totalCards > 0 && (
                  <p className="text-sm text-crd-lightGray mt-1">
                    {totalCards} cards created
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <CRDButton variant="outline" size="sm" asChild>
                <Link to="/settings">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </CRDButton>
              <CRDButton variant="outline" size="sm" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </CRDButton>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Stats */}
        <Card className="bg-crd-dark border-crd-mediumGray mb-8">
          <ProfileStats
            memoriesCount={unifiedCards.length + memories.length}
            followers={followers}
            following={following}
          />
        </Card>

        {/* Profile Tabs with Pagination */}
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          memories={[...unifiedCards, ...memories]}
          memoriesLoading={cardsLoading || memoriesLoading}
          hasMore={hasMoreCards}
          onLoadMore={loadMoreCards}
        />

        {/* Load More Button for Cards */}
        {activeTab === 'memories' && hasMoreCards && !cardsLoading && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={loadMoreCards}
              variant="outline" 
              className="border-crd-mediumGray text-crd-lightGray hover:text-white"
              disabled={cardsLoading}
            >
              {cardsLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Load More Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
