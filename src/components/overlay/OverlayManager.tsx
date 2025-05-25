
import React from 'react';
import { useOverlay } from './OverlayProvider';
import { EnhancedCardDetectionDialog } from './EnhancedCardDetectionDialog';

export const OverlayManager = () => {
  const { isOpen, overlayType, overlayData, closeOverlay } = useOverlay();

  if (overlayType === 'card-detection') {
    return (
      <EnhancedCardDetectionDialog
        isOpen={isOpen}
        onClose={closeOverlay}
        onCardsExtracted={overlayData?.onCardsExtracted}
      />
    );
  }

  // Add other overlay types here as needed
  return null;
};
