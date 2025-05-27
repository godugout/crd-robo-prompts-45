
import React from 'react';
import { useCardUploadSession } from './hooks/useCardUploadSession';
import { useCardOperations } from './hooks/useCardOperations';
import { CardsSessionHeader } from './components/CardsSessionHeader';
import { CardsPhaseIndicator } from './components/CardsPhaseIndicator';
import { CardsUploadPhase } from './components/CardsUploadPhase';
import { CardsProcessingPhases } from './components/CardsProcessingPhases';
import { CardsReviewPhase } from './components/CardsReviewPhase';
import { CardsCollection } from './components/CardsCollection';

export const CardsPage = () => {
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
  const handleImagesUploaded = (newImages: any[]) => {
    setPhase('uploading');
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  // Handle detection start
  const handleStartDetection = (images: any[]) => {
    startDetection(images, setPhase, setDetectionResults, setSelectedCards);
  };

  // Card selection toggle
  const toggleCardSelection = (cardId: string) => {
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
  const handleCreateSelectedCards = () => {
    createSelectedCards(
      detectionResults,
      selectedCards,
      setPhase,
      setCreatedCards,
      clearSession
    );
  };

  // Get all detected cards for display
  const allDetectedCards = detectionResults.flatMap(result => result.detectedCards);

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
        <div className="bg-editor-dark rounded-xl p-8 border border-crd-mediumGray/20 mb-8">
          {/* IDLE PHASE - Upload */}
          {phase === 'idle' && (
            <CardsUploadPhase
              uploadedImages={uploadedImages}
              onImagesUploaded={handleImagesUploaded}
              onStartDetection={handleStartDetection}
            />
          )}

          {/* PROCESSING PHASES */}
          <CardsProcessingPhases
            phase={phase}
            onStartOver={clearSession}
          />

          {/* REVIEWING PHASE */}
          {phase === 'reviewing' && (
            <CardsReviewPhase
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
