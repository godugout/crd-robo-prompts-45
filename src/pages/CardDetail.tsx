
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { LoadingState } from '@/components/common/LoadingState';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { toast } from 'sonner';

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
        price: typeof data.price === 'number' ? data.price : 0,
        tags: data.tags || [],
      };
    },
    enabled: !!id
  });

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

  return (
    <ImmersiveCardViewer
      card={card}
      isOpen={true}
      onClose={handleGoBack}
      onShare={handleShare}
      onDownload={handleDownload}
      allowRotation={true}
      showStats={true}
      ambient={true}
    />
  );
};

export default CardDetail;
