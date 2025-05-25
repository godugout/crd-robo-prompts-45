
import { useDialogState } from './useDialogState';
import { useImageProcessing } from './useImageProcessing';
import { useCardExtraction } from './useCardExtraction';

export const useCardDetectionState = () => {
  const dialogState = useDialogState();
  const imageProcessing = useImageProcessing();
  const cardExtraction = useCardExtraction();

  return {
    dialogState,
    imageProcessing,
    cardExtraction,
    // Flatten commonly used state for backward compatibility
    isProcessing: dialogState.isProcessing,
    currentStep: dialogState.currentStep,
    isEditMode: dialogState.isEditMode,
    dragState: dialogState.dragState,
    originalImage: imageProcessing.originalImage,
    detectedRegions: imageProcessing.detectedRegions,
    selectedRegions: imageProcessing.selectedRegions,
    extractedCards: cardExtraction.extractedCards,
    // Expose setters for external components
    setIsProcessing: dialogState.setIsProcessing,
    setCurrentStep: dialogState.setCurrentStep,
    setIsEditMode: dialogState.setIsEditMode,
    setDragState: dialogState.setDragState,
    setDetectedRegions: imageProcessing.setDetectedRegions,
    setSelectedRegions: imageProcessing.setSelectedRegions,
    goBack: dialogState.goBack,
    resetDialog: dialogState.resetDialog
  };
};
