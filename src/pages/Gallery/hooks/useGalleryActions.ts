
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
    const selectedCard = convertedCards[selectedCardIndex];
    if (selectedCard) {
      const dataStr = JSON.stringify(selectedCard, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedCard.title.replace(/\s+/g, '_')}_card.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Card exported successfully');
    }
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
