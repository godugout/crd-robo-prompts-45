
import React, { useState } from 'react';
import { useCollection, useCollectionCards, useCollectionAnalytics, useCollectionActivity } from '@/hooks/collections/useCollectionQueries';
import { useCollectionRealtime } from '@/hooks/collections/useCollectionRealtime';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/common/LoadingState';
import { CardDisplay } from '@/components/cards/core/CardDisplay';
import { CollectionStats } from './CollectionStats';
import { CollectionActivityView } from './CollectionActivity';
import { CollectionCommentsView } from './CollectionComments';
import { Eye, Heart, Share2, Settings, Edit, Users } from 'lucide-react';
import type { CardRarity } from '@/types/cards';

interface CollectionDetailViewProps {
  collectionId: string;
  onBack?: () => void;
}

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({
  collectionId,
  onBack
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cards');
  
  const { data: collection, isLoading: collectionLoading } = useCollection(collectionId);
  const { data: cards, isLoading: cardsLoading } = useCollectionCards(collectionId);
  const { data: analytics } = useCollectionAnalytics(collectionId);
  const { data: activities } = useCollectionActivity(collectionId);
  
  // Enable real-time updates for this collection
  useCollectionRealtime(collectionId);

  const isOwner = user?.id === collection?.owner_id;
  const isLoading = collectionLoading || cardsLoading;

  if (isLoading) {
    return <LoadingState message="Loading collection..." />;
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❓</div>
        <h3 className="text-xl font-bold text-white mb-2">Collection not found</h3>
        <p className="text-crd-lightGray mb-4">
          This collection may be private or has been deleted.
        </p>
        {onBack && (
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        {/* Cover Image */}
        {collection.cover_image_url && (
          <div className="h-48 md:h-64 bg-crd-mediumGray rounded-lg overflow-hidden mb-6">
            <img
              src={collection.cover_image_url}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl text-white">{collection.title}</CardTitle>
                  <Badge
                    variant={collection.visibility === 'public' ? 'default' : 'secondary'}
                    className={
                      collection.visibility === 'public'
                        ? 'bg-crd-green text-black'
                        : 'bg-crd-mediumGray text-crd-lightGray'
                    }
                  >
                    {collection.visibility}
                  </Badge>
                </div>
                
                {collection.description && (
                  <p className="text-crd-lightGray mb-4">{collection.description}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-crd-lightGray">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{collection.views_count} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{collection.likes_count} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{analytics?.total_followers || 0} followers</span>
                  </div>
                  <div>
                    <span>{analytics?.total_cards || 0} cards</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                
                {!isOwner && (
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Follow
                  </Button>
                )}
                
                {isOwner && (
                  <>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-crd-mediumGray">
          <TabsTrigger value="cards" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            Cards ({analytics?.total_cards || 0})
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            Activity
          </TabsTrigger>
          {collection.allow_comments && (
            <TabsTrigger value="comments" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Comments
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="cards" className="mt-6">
          {cards && cards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {cards.map((collectionCard) => {
                // Create a full Card object from the collection card data
                const fullCard = {
                  id: collectionCard.card?.id || '',
                  title: collectionCard.card?.title || 'Unknown Card',
                  image_url: collectionCard.card?.image_url,
                  thumbnail_url: collectionCard.card?.thumbnail_url,
                  rarity: (collectionCard.card?.rarity as CardRarity) || 'common', // Fixed type casting
                  description: collectionCard.card?.description,
                  tags: [],
                  creator_id: '',
                  created_at: '',
                  updated_at: '',
                  edition_size: 1,
                  price: 0,
                  verification_status: 'verified' as const,
                  collection_id: null,
                  team_id: null,
                  user_id: null,
                  print_metadata: {},
                  template_id: null,
                  creator_attribution: {},
                  publishing_options: {
                    marketplace_listing: false,
                    crd_catalog_inclusion: true,
                    print_available: false
                  },
                  print_available: false,
                  crd_catalog_inclusion: true,
                  marketplace_listing: false,
                  shop_id: null,
                  design_metadata: {},
                  is_public: false,
                  visibility: 'private' as const
                };

                return (
                  <CardDisplay
                    key={collectionCard.id}
                    card={fullCard}
                    variant="grid"
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎴</div>
              <h3 className="text-xl font-bold text-white mb-2">No cards yet</h3>
              <p className="text-crd-lightGray">
                {isOwner ? 'Start adding cards to your collection!' : 'This collection is empty.'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <CollectionStats collectionId={collectionId} analytics={analytics} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <CollectionActivityView collectionId={collectionId} activities={activities || []} />
        </TabsContent>

        {collection.allow_comments && (
          <TabsContent value="comments" className="mt-6">
            <CollectionCommentsView collectionId={collectionId} comments={[]} canComment={true} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
