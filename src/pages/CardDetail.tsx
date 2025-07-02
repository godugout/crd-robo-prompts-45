import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { LoadingState } from '@/components/common/LoadingState';
import { EnhancedCardDetailPage } from '@/components/cards/EnhancedCardDetailPage';
import { CardEditMode } from '@/components/card-detail/CardEditMode';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: card, isLoading, refetch } = useQuery({
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
          created_at,
          is_public,
          design_metadata,
          verification_status,
          publishing_options
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
        price: typeof data.price === 'number' ? data.price : 0,
        tags: data.tags || [],
      };
    },
    enabled: !!id
  });

  const isOwner = user?.id === card?.creator_id;

  const handleGoBack = () => {
    navigate('/gallery');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this card: ${card?.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: card?.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Card link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (card?.image_url) {
      const link = document.createElement('a');
      link.href = card.image_url;
      link.download = `${card.title || 'card'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Card download started!');
    } else {
      toast.error('No image available for download');
    }
  };

  const handleToggleVisibility = async () => {
    if (!card || !isOwner) return;

    try {
      const newVisibility = !card.is_public;
      const { error } = await supabase
        .from('cards')
        .update({ is_public: newVisibility })
        .eq('id', card.id);

      if (error) throw error;

      toast.success(`Card ${newVisibility ? 'published' : 'made private'} successfully!`);
      refetch();
    } catch (error) {
      console.error('Error updating card visibility:', error);
      toast.error('Failed to update card visibility');
    }
  };

  const handleEditComplete = () => {
    setIsEditMode(false);
    refetch();
    toast.success('Card updated successfully!');
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

  if (isEditMode && isOwner) {
    return (
      <CardEditMode
        card={card}
        onComplete={handleEditComplete}
        onCancel={() => setIsEditMode(false)}
      />
    );
  }

  return (
    <EnhancedCardDetailPage
      card={card}
      isOwner={isOwner}
      onGoBack={handleGoBack}
      onEdit={() => setIsEditMode(true)}
      onToggleVisibility={handleToggleVisibility}
      onShare={handleShare}
      onDownload={handleDownload}
    />
  );
};

export default CardDetail;
