
import React, { useState, useEffect } from 'react';
import { useCardCatalog } from '@/hooks/useCardCatalog';
import { DetectedCard } from '@/services/cardCatalog/types';
import { toast } from 'sonner';
import { CardsPageHeader } from './components/CardsPageHeader';
import { CardsWorkflowSection } from './components/CardsWorkflowSection';
import { CardsCatalogSection } from './components/CardsCatalogSection';

export const CardsPage = () => {
  const [workflowStep, setWorkflowStep] = useState<'upload' | 'detecting' | 'review' | 'finalizing' | 'complete'>('upload');
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

  // Auto-navigate workflow steps based on processing state
  useEffect(() => {
    if (isProcessing) {
      setWorkflowStep('detecting');
    } else if (showReview && totalCards > 0) {
      setWorkflowStep('review');
      toast.success(`🎉 Found ${totalCards} cards! Review them below.`, {
        description: 'Select the cards you want to add to your collection',
        duration: 5000
      });
    } else if (!showReview && totalCards === 0) {
      setWorkflowStep('upload');
    }
  }, [isProcessing, showReview, totalCards]);

  const handleUploadComplete = (count: number) => {
    setWorkflowStep('detecting');
    toast.success(`Successfully processed ${count} images!`, {
      description: 'AI is analyzing your images for trading cards...'
    });
  };

  const handleReviewComplete = () => {
    setWorkflowStep('finalizing');
    createSelectedCards();
    
    setTimeout(() => {
      setWorkflowStep('complete');
      toast.success('Cards added to your collection!', {
        description: 'Check them out in the catalog below'
      });
      
      // Reset to upload after a brief success state
      setTimeout(() => {
        setWorkflowStep('upload');
      }, 3000);
    }, 1000);
  };

  const handleStartOver = () => {
    clearDetectedCards();
    setWorkflowStep('upload');
  };

  const handleCardBoundsEdit = (cardId: string, bounds: DetectedCard['bounds']) => {
    editCardBounds(cardId, bounds);
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="pt-20 pb-6 border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CardsPageHeader />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Half - Card Creation Workflow */}
        <div className="py-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">Create New Cards</h2>
            <p className="text-crd-lightGray">
              Upload images and let AI detect individual trading cards for your collection
            </p>
          </div>
          
          <CardsWorkflowSection
            currentStep={workflowStep}
            totalCards={totalCards}
            selectedCards={selectedCards.size}
            detectedCardsArray={detectedCardsArray}
            selectedCardsSet={selectedCards}
            isProcessing={isProcessing}
            onUploadComplete={handleUploadComplete}
            onCardToggle={toggleCardSelection}
            onCardEdit={handleCardBoundsEdit}
            onReviewComplete={handleReviewComplete}
            onStartOver={handleStartOver}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-crd-mediumGray/20 my-8"></div>

        {/* Bottom Half - Card Catalog */}
        <div className="pb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">Your Card Collection</h2>
            <p className="text-crd-lightGray">
              Browse and manage all your created CRDs
            </p>
          </div>
          
          <CardsCatalogSection />
        </div>
      </div>
    </div>
  );
};
