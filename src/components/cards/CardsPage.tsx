
import React, { useState } from 'react';
import { DetectedCardsReview } from '@/components/catalog/DetectedCardsReview';
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

  const handleCardEdit = (card: DetectedCard) => {
    // TODO: Open card editor/viewer modal
    toast.info('Card viewer coming soon!');
  };

  const handleCardCreate = (card: DetectedCard) => {
    // TODO: Navigate to card creator with pre-filled data
    toast.success('Creating card from detection...');
    // This would typically navigate to the card editor with the detected card data
  };

  const handleUploadComplete = (count: number) => {
    toast.success(`Successfully processed ${count} images!`);
  };

  const handleReviewComplete = () => {
    createSelectedCards();
    setActiveTab('catalog');
  };

  const handleAddCards = () => {
    setActiveTab('upload');
  };

  const handleReviewClick = () => {
    setActiveTab('review');
  };

  return (
    <div className="min-h-screen bg-crd-darkest pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <CardsPageHeader onAddCards={handleAddCards} />

        {/* Stats Overview */}
        <CardsStatsOverview
          totalCards={totalCards}
          selectedCards={selectedCards.size}
          averageConfidence={averageConfidence}
          processedCards={processingStatus.completed}
        />

        {/* Review Alert */}
        {showReview && (
          <CardsReviewAlert
            totalCards={totalCards}
            onReviewClick={handleReviewClick}
          />
        )}

        {/* Detection Review */}
        {showReview && activeTab === 'upload' && (
          <div className="mb-8">
            <DetectedCardsReview
              detectedCards={detectedCardsArray}
              selectedCards={selectedCards}
              onCardToggle={toggleCardSelection}
              onCardEdit={editCardBounds}
              onCreateSelected={handleReviewComplete}
              onClearAll={clearDetectedCards}
            />
          </div>
        )}

        {/* Main Content Tabs */}
        <CardsMainContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showReview={showReview}
          totalCards={totalCards}
          detectedCardsArray={detectedCardsArray}
          selectedCards={selectedCards}
          onCardToggle={toggleCardSelection}
          onCardEdit={editCardBounds}
          onCreateSelected={handleReviewComplete}
          onClearAll={clearDetectedCards}
          onUploadComplete={handleUploadComplete}
          onCardCreate={handleCardCreate}
        />
      </div>
    </div>
  );
};
