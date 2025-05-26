
import React, { useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useEnhancedCardDetection } from './hooks/useEnhancedCardDetection';
import { EnhancedDialogHeader } from './components/EnhancedDialogHeader';
import { EnhancedDialogStepContent } from './components/EnhancedDialogStepContent';
import type { ExtractedCard } from '@/services/cardExtractor';

interface EnhancedCardDetectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

export const EnhancedCardDetectionDialog = ({ 
  isOpen, 
  onClose, 
  onCardsExtracted 
}: EnhancedCardDetectionDialogProps) => {
  const {
    isProcessing,
    currentStep,
    originalImage,
    detectedCards,
    selectedCardId,
    isEditMode,
    extractedCards,
    activeMode,
    handleImageDrop,
    handleExtractCards,
    handleUseCards,
    deleteSelectedCards,
    goBack,
    resetDialog,
    setSelectedCardId,
    setIsEditMode,
    setActiveMode,
    handleCardUpdate,
    handleAdjustmentChange
  } = useEnhancedCardDetection(onCardsExtracted);

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleUseCardsAndClose = () => {
    handleUseCards();
    handleClose();
  };

  const handleConfirmAdjustment = useCallback(() => {
    setActiveMode(null);
  }, [setActiveMode]);

  const handleCancelAdjustment = useCallback(() => {
    // Reset to original position/size
    if (selectedCardId) {
      const originalCard = detectedCards.find(c => c.id === selectedCardId);
      if (originalCard) {
        handleCardUpdate(selectedCardId, {
          adjustment: {
            x: 0,
            y: 0,
            width: 100,
            height: 140,
            rotation: 0,
            scale: 1
          }
        });
      }
    }
    setActiveMode(null);
  }, [selectedCardId, detectedCards, handleCardUpdate, setActiveMode]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-gray-900 border-gray-700">
        <EnhancedDialogHeader
          currentStep={currentStep}
          detectedRegionsCount={detectedCards.length}
          selectedRegionsCount={selectedCardId ? 1 : 0}
          extractedCardsCount={extractedCards.length}
          isEditMode={isEditMode}
          isProcessing={isProcessing}
          onGoBack={goBack}
          onToggleEditMode={() => setIsEditMode(!isEditMode)}
          onDeleteSelected={deleteSelectedCards}
          onExtractCards={handleExtractCards}
          onUseCards={handleUseCardsAndClose}
        />

        <div className="flex-1 overflow-hidden">
          <EnhancedDialogStepContent
            currentStep={currentStep}
            isProcessing={isProcessing}
            originalImage={originalImage}
            detectedCards={detectedCards}
            selectedCardId={selectedCardId}
            activeMode={activeMode}
            extractedCards={extractedCards}
            onImageDrop={handleImageDrop}
            onCardSelect={setSelectedCardId}
            onCardUpdate={handleCardUpdate}
            onAdjustmentChange={handleAdjustmentChange}
            onConfirmAdjustment={handleConfirmAdjustment}
            onCancelAdjustment={handleCancelAdjustment}
            setActiveMode={setActiveMode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
