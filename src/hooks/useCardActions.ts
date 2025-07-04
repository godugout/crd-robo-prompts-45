
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UniversalCardData } from '@/components/cards/UniversalCardDisplay';

export const useCardActions = () => {
  const navigate = useNavigate();

  const handleView = (card: UniversalCardData) => {
    navigate(`/card/${card.id}`);
  };

  const handleRemix = (card: UniversalCardData) => {
    navigate(`/cards/enhanced?template=${card.id}`);
    toast.success(`Starting remix of "${card.title}"`);
  };

  const handleStage = (card: UniversalCardData) => {
    navigate(`/studio?card=${card.id}`);
    toast.success(`Opening "${card.title}" in Studio`);
  };

  const handleFavorite = async (card: UniversalCardData) => {
    try {
      // TODO: Implement actual favorite functionality
      toast.success(`Added "${card.title}" to favorites`);
    } catch (error) {
      toast.error('Failed to add to favorites');
    }
  };

  const handleShare = async (card: UniversalCardData) => {
    try {
      const url = `${window.location.origin}/card/${card.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: card.title,
          text: card.description,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Card link copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share card');
    }
  };

  return {
    handleView,
    handleRemix,
    handleStage,
    handleFavorite,
    handleShare
  };
};
