
import React, { useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useEnhancedCardDetection } from './hooks/useEnhancedCardDetection';
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
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
    detectedRegions,
    selectedRegions,
    isEditMode,
    extractedCards,
    dragState,
    handleImageDrop,
    handleExtractCards,
    handleUseCards,
    deleteSelectedRegions,
    goBack,
    resetDialog,
    setDetectedRegions,
    setSelectedRegions,
    setIsEditMode,
    setDragState
  } = useEnhancedCardDetection(onCardsExtracted);

  const {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  } = useCanvasInteractions({
    isEditMode,
    originalImage,
    detectedRegions,
    dragState,
    setSelectedRegions,
    setDetectedRegions,
    setDragState
  });

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleUseCardsAndClose = () => {
    handleUseCards();
    handleClose();
  };

  const handleRegionToggle = useCallback((regionId: string) => {
    const newSelected = new Set(selectedRegions);
    if (newSelected.has(regionId)) {
      newSelected.delete(regionId);
    } else {
      newSelected.add(regionId);
    }
    setSelectedRegions(newSelected);
  }, [selectedRegions, setSelectedRegions]);

  const handleSelectAll = useCallback(() => {
    setSelectedRegions(new Set(detectedRegions.map(r => r.id)));
  }, [detectedRegions, setSelectedRegions]);

  const handleClearSelection = useCallback(() => {
    setSelectedRegions(new Set());
  }, [setSelectedRegions]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-gray-900 border-gray-700">
        <EnhancedDialogHeader
          currentStep={currentStep}
          detectedRegionsCount={detectedRegions.length}
          selectedRegionsCount={selectedRegions.size}
          extractedCardsCount={extractedCards.length}
          isEditMode={isEditMode}
          isProcessing={isProcessing}
          onGoBack={goBack}
          onToggleEditMode={() => setIsEditMode(!isEditMode)}
          onDeleteSelected={deleteSelectedRegions}
          onExtractCards={handleExtractCards}
          onUseCards={handleUseCardsAndClose}
        />

        <div className="flex-1 overflow-hidden">
          <EnhancedDialogStepContent
            currentStep={currentStep}
            isProcessing={isProcessing}
            originalImage={originalImage}
            detectedRegions={detectedRegions}
            selectedRegions={selectedRegions}
            isEditMode={isEditMode}
            dragState={dragState}
            extractedCards={extractedCards}
            onImageDrop={handleImageDrop}
            onRegionToggle={handleRegionToggle}
            onCanvasMouseDown={handleCanvasMouseDown}
            onCanvasMouseMove={handleCanvasMouseMove}
            onCanvasMouseUp={handleCanvasMouseUp}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            setSelectedRegions={setSelectedRegions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
