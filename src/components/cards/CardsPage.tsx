
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

  // Enhanced workflow state management
  useEffect(() => {
    console.log('🔄 CardsPage workflow state update:', { 
      isProcessing, 
      showReview, 
      totalCards, 
      currentStep: workflowStep,
      detectedCardsArrayLength: detectedCardsArray.length,
      detectedCardsMapSize: detectedCards.size,
      selectedCardsSize: selectedCards.size,
      detectedCardsKeys: Array.from(detectedCards.keys()).slice(0, 3)
    });
    
    // Handle detection in progress
    if (isProcessing && workflowStep !== 'detecting') {
      console.log('🔄 → Transitioning to detecting step');
      setWorkflowStep('detecting');
    } 
    // Handle successful detection with cards to review
    else if (!isProcessing && totalCards > 0 && showReview && workflowStep !== 'review') {
      console.log('🎉 → Transitioning to review step - cards available for review');
      setWorkflowStep('review');
      toast.success(`Found ${totalCards} cards!`, {
        description: 'Select the cards you want to add to your collection'
      });
    } 
    // Handle no cards detected or cleared state
    else if (!isProcessing && (totalCards === 0 || !showReview) && workflowStep !== 'upload') {
      console.log('📤 → Transitioning to upload step - no cards or review cleared');
      setWorkflowStep('upload');
    }
  }, [isProcessing, showReview, totalCards, workflowStep, detectedCardsArray.length, detectedCards.size]);

  const handleUploadComplete = (count: number) => {
    console.log('📤 Upload complete, starting detection for', count, 'files');
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

        {/* Enhanced Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-gray-800 rounded text-white text-sm space-y-2">
            <div className="font-bold text-yellow-400">🐛 Debug Information:</div>
            <div>Current Step: <span className="text-blue-400 font-mono">{workflowStep}</span></div>
            <div>Total Cards: <span className="text-green-400 font-mono">{totalCards}</span></div>
            <div>Cards Map Size: <span className="text-green-400 font-mono">{detectedCards.size}</span></div>
            <div>Cards Array Length: <span className="text-green-400 font-mono">{detectedCardsArray.length}</span></div>
            <div>Selected Cards: <span className="text-purple-400 font-mono">{selectedCards.size}</span></div>
            <div>Is Processing: <span className="text-orange-400 font-mono">{isProcessing.toString()}</span></div>
            <div>Show Review: <span className="text-pink-400 font-mono">{showReview.toString()}</span></div>
            <div className="text-xs text-gray-400">
              Cards IDs: <span className="font-mono">{Array.from(detectedCards.keys()).slice(0, 3).join(', ')}{detectedCards.size > 3 ? '...' : ''}</span>
            </div>
            <div className="text-xs text-gray-400">
              Processing Status: <span className="font-mono">Total: {processingStatus.total}, Completed: {processingStatus.completed}, Failed: {processingStatus.failed}</span>
            </div>
          </div>
        )}

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
