
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Eye, 
  Users, 
  Share2, 
  MessageCircle, 
  Activity,
  Plus,
  Settings,
  Star,
  TrendingUp
} from 'lucide-react';
import { 
  useCollection, 
  useCollectionCards, 
  useCollectionAnalytics,
  useCollectionActivity,
  useCollectionComments,
  useFollowCollection,
  useUnfollowCollection
} from '@/hooks/collections/useCollectionQueries';
import { useCollectionRealtime } from '@/hooks/collections/useCollectionRealtime';
import { LoadingState } from '@/components/common/LoadingState';
import { CollectionCardsGrid } from './CollectionCardsGrid';
import { CollectionActivity } from './CollectionActivity';
import { CollectionComments } from './CollectionComments';
import { CollectionStats } from './CollectionStats';
import { useUser } from '@/hooks/use-user';

interface CollectionDetailProps {
  collectionId: string;
  onBack?: () => void;
}

export const CollectionDetail: React.FC<CollectionDetailProps> = ({
  collectionId,
  onBack
}) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('cards');
  const [isFollowing, setIsFollowing] = useState(false);

  // Enable real-time updates
  const { isConnected } = useCollectionRealtime(collectionId);

  // Queries
  const { data: collection, isLoading: collectionLoading } = useCollection(collectionId);
  const { data: cards } = useCollectionCards(collectionId);
  const { data: analytics } = useCollectionAnalytics(collectionId);
  const { data: activity } = useCollectionActivity(collectionId);
  const { data: comments } = useCollectionComments(collectionId);

  // Mutations
  const followMutation = useFollowCollection();
  const unfollowMutation = useUnfollowCollection();

  const isOwner = user?.id === collection?.owner_id;
  const canEdit = isOwner; // TODO: Add permission checks

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate(collectionId);
      setIsFollowing(false);
    } else {
      followMutation.mutate(collectionId);
      setIsFollowing(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: collection?.title,
        text: collection?.description,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // toast.success('Link copied to clipboard!');
    }
  };

  if (collectionLoading) {
    return <LoadingState message="Loading collection..." />;
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Collection not found</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 text-crd-lightGray hover:text-crd-white"
            >
              ← Back
            </Button>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cover Image */}
            <div className="w-full lg:w-80 h-60 bg-crd-mediumGray/20 rounded-xl overflow-hidden">
              {collection.cover_image_url ? (
                <img 
                  src={collection.cover_image_url} 
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-crd-lightGray" />
                </div>
              )}
            </div>

            {/* Collection Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-crd-white mb-2">
                    {collection.title}
                  </h1>
                  {collection.description && (
                    <p className="text-crd-lightGray mb-4">{collection.description}</p>
                  )}
                </div>

                {/* Real-time indicator */}
                {isConnected && (
                  <div className="flex items-center gap-2 text-crd-green text-sm">
                    <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
                    Live
                  </div>
                )}
              </div>

              {/* Tags */}
              {collection.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {collection.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-crd-white">
                    {analytics?.total_cards || 0}
                  </div>
                  <div className="text-sm text-crd-lightGray">Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-crd-white">
                    {Math.round(analytics?.completion_rate || 0)}%
                  </div>
                  <div className="text-sm text-crd-lightGray">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-crd-white">
                    {analytics?.total_views || 0}
                  </div>
                  <div className="text-sm text-crd-lightGray">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-crd-white">
                    {analytics?.total_followers || 0}
                  </div>
                  <div className="text-sm text-crd-lightGray">Followers</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {!isOwner && (
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    className={isFollowing 
                      ? "border-crd-green text-crd-green" 
                      : "bg-crd-green text-black hover:bg-crd-green/90"
                    }
                    disabled={followMutation.isPending || unfollowMutation.isPending}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                {canEdit && (
                  <Button
                    onClick={() => window.location.href = `/collections/${collectionId}/edit`}
                    variant="outline"
                    className="border-crd-mediumGray text-crd-lightGray hover:text-crd-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-editor-dark">
            <TabsTrigger value="cards" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Cards ({analytics?.total_cards || 0})
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Activity className="w-4 h-4 mr-2" />
              Activity ({analytics?.recent_activity || 0})
            </TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments ({comments?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <CollectionCardsGrid 
              collectionId={collectionId}
              cards={cards || []}
              canEdit={canEdit}
            />
          </TabsContent>

          <TabsContent value="stats">
            <CollectionStats 
              collectionId={collectionId}
              analytics={analytics}
            />
          </TabsContent>

          <TabsContent value="activity">
            <CollectionActivity 
              collectionId={collectionId}
              activities={activity || []}
            />
          </TabsContent>

          <TabsContent value="comments">
            <CollectionComments 
              collectionId={collectionId}
              comments={comments || []}
              canComment={!!user}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
