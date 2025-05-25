
export { OverlayProvider, useOverlay } from './OverlayProvider';
export { OverlayManager } from './OverlayManager';
export { FullPageOverlay } from './FullPageOverlay';
export { CardDetectionOverlay } from './CardDetectionOverlay';
export { CardDetectionDialog } from './CardDetectionDialog';
export { EnhancedCardDetectionDialog } from './EnhancedCardDetectionDialog';

// Export refactored components
export { CardDetectionUploadStep } from './components/CardDetectionUploadStep';
export { CardDetectionReviewStep } from './components/CardDetectionReviewStep';
export { CardDetectionReviewControls } from './components/CardDetectionReviewControls';
export { CardDetectionGrid } from './components/CardDetectionGrid';
export { EnhancedCanvasRegionEditor } from './components/EnhancedCanvasRegionEditor';
export { EnhancedExtractedCardsView } from './components/EnhancedExtractedCardsView';
export { EnhancedDialogHeader } from './components/EnhancedDialogHeader';
export { EnhancedDialogStepContent } from './components/EnhancedDialogStepContent';

// Export hooks
export { useCardDetectionDialog } from './hooks/useCardDetectionDialog';
export { useEnhancedCardDetection } from './hooks/useEnhancedCardDetection';
export { useCanvasInteractions } from './hooks/useCanvasInteractions';
export { useDialogState } from './hooks/useDialogState';
export { useImageProcessing } from './hooks/useImageProcessing';
export { useCardExtraction } from './hooks/useCardExtraction';
export { useCardDetectionState } from './hooks/useCardDetectionState';
export { useCardDetectionActions } from './hooks/useCardDetectionActions';

// Export types
export type { EnhancedDialogStep, ManualRegion, DragState } from './hooks/types';
