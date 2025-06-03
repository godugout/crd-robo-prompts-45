import { useState } from 'react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

export const useGalleryActions = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);

  const handleCardClick = (card: any, featuredCards: any[]) => {
    const cardIndex = featuredCards.findIndex(c => c.id === card.id);
    setSelectedCardIndex(cardIndex >= 0 ? cardIndex : 0);
    setShowImmersiveViewer(true);
  };

  const handleCardChange = (newIndex: number) => {
    setSelectedCardIndex(newIndex);
  };

  const handleCloseViewer = () => {
    setShowImmersiveViewer(false);
  };

  const handleShareCard = (convertedCards: CardData[]) => {
    const selectedCard = convertedCards[selectedCardIndex];
    if (selectedCard) {
      const shareUrl = `${window.location.origin}/card/${selectedCard.id}`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => toast.success('Card link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'));
      } else {
        toast.error('Sharing not supported in this browser');
      }
    }
  };

  const handleDownloadCard = (convertedCards: CardData[]) => {
    console.log('Download triggered - handled by export dialog');
  };

  return {
    selectedCardIndex,
    showImmersiveViewer,
    handleCardClick,
    handleCardChange,
    handleCloseViewer,
    handleShareCard,
    handleDownloadCard
  };
};
