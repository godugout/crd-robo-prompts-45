
import React from 'react';
import { useCardUploadSession } from './hooks/useCardUploadSession';
import { useCardOperations } from './hooks/useCardOperations';
import { CardsSessionHeader } from './components/CardsSessionHeader';
import { CardsPhaseIndicator } from './components/CardsPhaseIndicator';
import { CardsUploadPhase } from './components/CardsUploadPhase';
import { CardsProcessingPhases } from './components/CardsProcessingPhases';
import { CleanCardsReviewPhase } from './components/CleanCardsReviewPhase';
import { CardsCollection } from './components/CardsCollection';
import { BulkCardsUploader } from './components/BulkCardsUploader';
import type { UploadedImage } from './types';
import type { CardDetectionResult } from '@/services/cardDetection';

export const CardsPage: React.FC = () => {
  const {
    phase,
    setPhase,
    uploadedImages,
    setUploadedImages,
    detectionResults,
    setDetectionResults,
    selectedCards,
    setSelectedCards,
    createdCards,
    setCreatedCards,
    sessionId,
    clearSession
  } = useCardUploadSession();

  const { startDetection, createSelectedCards } = useCardOperations();

  // Handle image upload
  const handleImagesUploaded = (newImages: UploadedImage[]): void => {
    setPhase('uploading');
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  // Handle detection start
  const handleStartDetection = (images: UploadedImage[]): void => {
    startDetection(images, setPhase, setDetectionResults, setSelectedCards);
  };

  // Handle bulk processing results
  const handleBulkResultsReady = (results: CardDetectionResult[]): void => {
    console.log('Bulk processing completed with results:', results);
    
    setDetectionResults(results);
    
    // Auto-select all detected cards
    const allCardIds = results.flatMap(result => 
      result.detectedCards.map(card => card.id)
    );
    setSelectedCards(new Set(allCardIds));
    
    setPhase('reviewing');
  };

  // Card selection toggle
  const toggleCardSelection = (cardId: string): void => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Handle card creation
  const handleCreateSelectedCards = (): void => {
    createSelectedCards(
      detectionResults,
      selectedCards,
      setPhase,
      setCreatedCards,
      clearSession
    );
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <CardsSessionHeader
        phase={phase}
        uploadedImages={uploadedImages}
        sessionId={sessionId}
        onClearSession={clearSession}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <CardsPhaseIndicator phase={phase} />

        {/* Main Content */}
        <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 mb-8">
          {/* IDLE PHASE - Upload with Bulk Option */}
          {phase === 'idle' && (
            <div className="p-8 space-y-8">
              {/* Bulk Uploader */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4">
                  Bulk Upload (Recommended for 10+ images)
                </h3>
                <BulkCardsUploader onResultsReady={handleBulkResultsReady} />
              </div>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-crd-mediumGray/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-editor-dark text-crd-lightGray">OR</span>
                </div>
              </div>
              
              {/* Simple Upload */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4">
                  Simple Upload (For a few images)
                </h3>
                <CardsUploadPhase
                  uploadedImages={uploadedImages}
                  onImagesUploaded={handleImagesUploaded}
                  onStartDetection={handleStartDetection}
                />
              </div>
            </div>
          )}

          {/* PROCESSING PHASES */}
          <CardsProcessingPhases
            phase={phase}
            onStartOver={clearSession}
          />

          {/* REVIEWING PHASE - New Clean Interface */}
          {phase === 'reviewing' && (
            <CleanCardsReviewPhase
              detectionResults={detectionResults}
              selectedCards={selectedCards}
              onToggleCardSelection={toggleCardSelection}
              onCreateSelectedCards={handleCreateSelectedCards}
              onStartOver={clearSession}
            />
          )}
        </div>

        {/* Card Collection */}
        <CardsCollection createdCards={createdCards} />
      </div>
    </div>
  );
};
