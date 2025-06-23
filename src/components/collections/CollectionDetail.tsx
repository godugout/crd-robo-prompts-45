
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { LoadingState } from '@/components/common/LoadingState';
import { CardGrid } from '@/components/cards/CardGrid';
import { toast } from 'sonner';
import type { Card, CardRarity } from '@/types/cards';

interface Collection {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  owner_id: string;
  card_count?: number;
}

interface CollectionDetailProps {
  collectionId: string;
  onBack: () => void;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({ collectionId, onBack }) => {
  const navigate = useNavigate();

  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single();
      
      if (error) throw error;
      return data as Collection;
    },
    enabled: !!collectionId
  });

  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['collection-cards', collectionId],
    queryFn: async (): Promise<Card[]> => {
      // Get cards that are in this collection
      const { data: collectionCards, error: collectionError } = await supabase
        .from('collection_cards')
        .select('card_id')
        .eq('collection_id', collectionId);
      
      if (collectionError) throw collectionError;
      
      if (!collectionCards || collectionCards.length === 0) {
        return [];
      }

      const cardIds = collectionCards.map(cc => cc.card_id);
      
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select(`
          id,
          title,
          description,
          image_url,
          thumbnail_url,
          rarity,
          price,
          tags,
          creator_id,
          is_public,
          edition_size,
          created_at,
          updated_at,
          verification_status,
          print_metadata,
          creator_attribution,
          publishing_options,
          design_metadata
        `)
        .in('id', cardIds);
      
      if (cardsError) throw cardsError;
      
      // Get creator information for each card
      const cardsWithCreators = await Promise.all(
        (cardsData || []).map(async (card) => {
          let creator_name = 'Unknown Creator';
          let creator_verified = false;
          
          if (card.creator_id) {
            const { data: profileData } = await supabase
              .from('crd_profiles')
              .select('display_name, creator_verified')
              .eq('id', card.creator_id)
              .single();
            
            if (profileData) {
              creator_name = profileData.display_name || 'Unknown Creator';
              creator_verified = profileData.creator_verified || false;
            }
          }
          
          return {
            ...card,
            creator_name,
            creator_verified,
            price: card.price || 0,
            tags: card.tags || [],
            visibility: card.is_public ? 'public' : 'private',
            edition_size: card.edition_size || 1,
            created_at: card.created_at || new Date().toISOString(),
            updated_at: card.updated_at || new Date().toISOString(),
            verification_status: (card.verification_status as 'pending' | 'verified' | 'rejected') || 'pending',
            creator_attribution: (card.creator_attribution && typeof card.creator_attribution === 'object') ? card.creator_attribution as any : {},
            print_metadata: (card.print_metadata && typeof card.print_metadata === 'object') ? card.print_metadata as Record<string, any> : {},
            publishing_options: (card.publishing_options && typeof card.publishing_options === 'object') ? card.publishing_options as any : {
              marketplace_listing: false,
              crd_catalog_inclusion: true,
              print_available: false
            },
            design_metadata: (card.design_metadata && typeof card.design_metadata === 'object') ? card.design_metadata as Record<string, any> : {},
            collection_id: null,
            team_id: null,
            user_id: null,
            template_id: null,
            print_available: false,
            crd_catalog_inclusion: true,
            marketplace_listing: false,
            shop_id: null,
            is_public: card.is_public || false
          } as Card;
        })
      );
      
      return cardsWithCreators;
    },
    enabled: !!collectionId
  });

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this collection: ${collection?.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: collection?.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Collection link copied to clipboard!');
    }
  };

  if (collectionLoading) {
    return <LoadingState message="Loading collection..." />;
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Collection Not Found</h2>
          <p className="text-crd-lightGray mb-6">The collection you're looking for doesn't exist.</p>
          <Button onClick={onBack} className="bg-crd-green hover:bg-crd-green/90 text-black">
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  // Convert Card[] to the format expected by CardGrid
  const cardGridData = cards.map(card => ({
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    thumbnail_url: card.thumbnail_url,
    rarity: card.rarity,
    price: card.price?.toString(),
    creator_name: card.creator_name,
    creator_verified: (card as any).creator_verified,
    creator_id: card.creator_id,
    tags: card.tags
  }));

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-crd-lightGray hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
            <div className="h-6 w-px bg-crd-mediumGray" />
            <div>
              <h1 className="text-3xl font-bold text-white">{collection.title}</h1>
              {collection.description && (
                <p className="text-crd-lightGray mt-1">{collection.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-crd-mediumGray text-crd-lightGray hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-crd-green mb-1">
                {cards.length}
              </div>
              <div className="text-sm text-crd-lightGray">Cards</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-crd-green mb-1">
                {new Set(cards.map(card => card.rarity)).size}
              </div>
              <div className="text-sm text-crd-lightGray">Rarities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-crd-green mb-1">
                {new Date(collection.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-crd-lightGray">Created</div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {cards.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              Cards in this Collection
            </h2>
            <CardGrid 
              cards={cardGridData} 
              loading={cardsLoading}
              viewMode="grid"
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-4">No Cards Yet</h3>
            <p className="text-crd-lightGray mb-6">
              This collection doesn't have any cards yet.
            </p>
            <Button
              onClick={() => navigate('/cards/create')}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              Create Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
