
import React, { useState, useEffect } from 'react';
import { useCardCatalog } from '@/hooks/useCardCatalog';
import { DetectedCard } from '@/services/cardCatalog/types';
import { toast } from 'sonner';
import { CardsPageHeader } from './components/CardsPageHeader';
import { CardsStatsOverview } from './components/CardsStatsOverview';
import { CardsReviewAlert } from './components/CardsReviewAlert';
import { CardsMainContent } from './components/CardsMainContent';

export const CardsPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const { 
    detectedCards, 
    selectedCards, 
    processingStatus, 
    showReview,
    isProcessing,
    toggleCardSelection,
    createSelectedCards,
    clearDetectedCards,
    editCardBounds
  } = useCardCatalog();
  
  const totalCards = detectedCards.size;
  const detectedCardsArray = Array.from(detectedCards.values()) as DetectedCard[];
  const averageConfidence = totalCards > 0 
    ? detectedCardsArray.reduce((sum, card) => sum + (card.confidence || 0), 0) / totalCards 
    : 0;

  // Auto-navigate to review when cards are detected
  useEffect(() => {
    if (showReview && totalCards > 0 && !isProcessing) {
      setActiveTab('review');
      toast.success(`🎉 Found ${totalCards} cards! Review them below.`, {
        description: 'Select the cards you want to add to your collection',
        duration: 5000
      });
    }
  }, [showReview, totalCards, isProcessing]);

  const handleCardEdit = (card: DetectedCard) => {
    toast.info('Card viewer coming soon!');
  };

  const handleCardCreate = (card: DetectedCard) => {
    toast.success('Creating card from detection...');
  };

  const handleUploadComplete = (count: number) => {
    toast.success(`Successfully processed ${count} images!`, {
      description: 'Cards are being analyzed, please wait...'
    });
  };

  const handleReviewComplete = () => {
    createSelectedCards();
    setActiveTab('catalog');
    toast.success('Cards added to your collection!', {
      description: 'Check them out in the catalog tab'
    });
  };

  const handleAddCards = () => {
    setActiveTab('upload');
  };

  const handleReviewClick = () => {
    setActiveTab('review');
  };

  const handleCardBoundsEdit = (cardId: string, bounds: DetectedCard['bounds']) => {
    editCardBounds(cardId, bounds);
  };

  return (
    <div className="min-h-screen bg-crd-darkest pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CardsPageHeader onAddCards={handleAddCards} />

        <CardsStatsOverview
          totalCards={totalCards}
          selectedCards={selectedCards.size}
          averageConfidence={averageConfidence}
          processedCards={processingStatus.completed}
        />

        {showReview && totalCards > 0 && (
          <CardsReviewAlert
            totalCards={totalCards}
            onReviewClick={handleReviewClick}
          />
        )}

        <CardsMainContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showReview={showReview}
          totalCards={totalCards}
          detectedCardsArray={detectedCardsArray}
          selectedCards={selectedCards}
          onCardToggle={toggleCardSelection}
          onCardEdit={handleCardBoundsEdit}
          onCreateSelected={handleReviewComplete}
          onClearAll={clearDetectedCards}
          onUploadComplete={handleUploadComplete}
          onCardCreate={handleCardCreate}
        />
      </div>
    </div>
  );
};
