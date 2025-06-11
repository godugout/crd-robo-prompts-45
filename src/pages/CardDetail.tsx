
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { LoadingState } from '@/components/common/LoadingState';
import { CardDetailHeader } from '@/components/cards/components/CardDetailHeader';
import { EnhancedCardViewer } from '@/components/viewer/EnhancedCardViewer';
import { useCardActions } from '@/hooks/useCardActions';

interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: string;
  price?: string;
  creator_name?: string;
  creator_verified?: boolean;
  creator_id?: string;
  tags?: string[];
  created_at: string;
}

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: card, isLoading } = useQuery({
    queryKey: ['card', id],
    queryFn: async () => {
      const { data, error } = await supabase
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
          created_at
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Get creator information
      let creator_name = 'Unknown Creator';
      let creator_verified = false;
      
      if (data.creator_id) {
        const { data: profileData } = await supabase
          .from('crd_profiles')
          .select('display_name, creator_verified')
          .eq('id', data.creator_id)
          .single();
        
        if (profileData) {
          creator_name = profileData.display_name || 'Unknown Creator';
          creator_verified = profileData.creator_verified || false;
        }
      }
      
      return {
        ...data,
        creator_name,
        creator_verified,
        price: data.price ? data.price.toString() : undefined,
        tags: data.tags || []
      } as CardData;
    },
    enabled: !!id
  });

  const {
    likeCount,
    viewCount,
    isLiked,
    isBookmarked,
    handleLike,
    handleBookmark,
    handleDownload,
    handleShare
  } = useCardActions(id || '');

  const handleGoBack = () => {
    navigate('/gallery');
  };

  if (isLoading) {
    return <LoadingState message="Loading card..." />;
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Card Not Found</h2>
          <p className="text-crd-lightGray mb-6">The card you're looking for doesn't exist.</p>
          <button 
            onClick={handleGoBack}
            className="bg-crd-green hover:bg-crd-green/90 text-black px-6 py-2 rounded-lg font-medium"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  // Convert card data to format expected by EnhancedCardViewer
  const cardViewerData = {
    id: card.id,
    title: card.title,
    description: card.description,
    image_url: card.image_url,
    rarity: card.rarity as any,
    tags: card.tags || [],
    visibility: 'public' as any,
    is_public: true,
    template_id: undefined,
    collection_id: undefined,
    team_id: undefined,
    creator_attribution: {
      creator_name: card.creator_name,
      creator_id: card.creator_id
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    },
    design_metadata: {}
  };

  // Create enhanced card details with real data
  const cardDetails = {
    id: card.id,
    title: card.title,
    description: card.description,
    rarity: card.rarity,
    creator_name: card.creator_name,
    creator_verified: card.creator_verified,
    price: card.price,
    created_at: card.created_at,
    tags: card.tags,
    view_count: viewCount,
    like_count: likeCount
  };

  return (
    <div className="min-h-screen bg-crd-darkest relative">
      <CardDetailHeader onGoBack={handleGoBack} />
      <div className="h-screen pt-16">
        <EnhancedCardViewer 
          card={cardViewerData}
          onDownload={handleDownload}
          onShare={handleShare}
          cardDetails={cardDetails}
          onLike={handleLike}
          onBookmark={handleBookmark}
        />
      </div>
    </div>
  );
};

export default CardDetail;
