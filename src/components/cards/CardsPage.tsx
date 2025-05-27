
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
    editCardBounds,
    processQueue
  } = useCardCatalog();
  
  const totalCards = detectedCards.size;
  const detectedCardsArray = Array.from(detectedCards.values()) as DetectedCard[];

  // Auto-navigate workflow steps based on processing state
  useEffect(() => {
    console.log('Workflow state check:', { isProcessing, showReview, totalCards, currentStep: workflowStep });
    
    if (isProcessing && workflowStep !== 'detecting') {
      console.log('Setting step to detecting');
      setWorkflowStep('detecting');
    } else if (!isProcessing && showReview && totalCards > 0 && workflowStep === 'detecting') {
      console.log('Setting step to review');
      setWorkflowStep('review');
      toast.success(`Found ${totalCards} cards!`, {
        description: 'Select the cards you want to add to your collection'
      });
    } else if (!isProcessing && !showReview && totalCards === 0 && workflowStep !== 'upload') {
      console.log('Setting step to upload');
      setWorkflowStep('upload');
    }
  }, [isProcessing, showReview, totalCards, workflowStep]);

  const handleUploadComplete = (count: number) => {
    console.log('Upload complete, starting detection for', count, 'files');
    setWorkflowStep('detecting');
    toast.success(`Processing ${count} images...`);
    // Trigger processing after a short delay to ensure UI updates
    setTimeout(() => {
      processQueue();
    }, 100);
  };

  const handleReviewComplete = () => {
    setWorkflowStep('finalizing');
    createSelectedCards();
    
    setTimeout(() => {
      setWorkflowStep('complete');
      toast.success('Cards added to collection!');
      
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Creation Workflow */}
        <div className="py-8">
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

        {/* Card Collection */}
        <div className="pb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Collection</h2>
            <p className="text-crd-lightGray">Browse and manage your CRDs</p>
          </div>
          <CardsCatalogSection />
        </div>
      </div>
    </div>
  );
};
