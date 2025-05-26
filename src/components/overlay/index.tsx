
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CardDetectionDialog } from './CardDetectionDialog';
import { EnhancedCardDetectionDialog } from './EnhancedCardDetectionDialog';
import { CardDetectionOverlay } from './CardDetectionOverlay';
import type { ExtractedCard } from '@/services/cardExtractor';

type OverlayType = 'card-detection' | 'enhanced-card-detection' | 'card-detection-overlay';

interface OverlayContextType {
  openOverlay: (type: OverlayType, props?: any) => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | null>(null);

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};

interface OverlayProviderProps {
  children: ReactNode;
}

export const OverlayProvider = ({ children }: OverlayProviderProps) => {
  const [activeOverlay, setActiveOverlay] = useState<{
    type: OverlayType;
    props: any;
  } | null>(null);

  const openOverlay = (type: OverlayType, props: any = {}) => {
    setActiveOverlay({ type, props });
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  return (
    <OverlayContext.Provider value={{ openOverlay, closeOverlay }}>
      {children}
      
      {/* Render active overlay */}
      {activeOverlay?.type === 'card-detection' && (
        <CardDetectionDialog
          isOpen={true}
          onClose={closeOverlay}
          onCardsExtracted={activeOverlay.props.onCardsExtracted}
        />
      )}
      
      {activeOverlay?.type === 'enhanced-card-detection' && (
        <EnhancedCardDetectionDialog
          isOpen={true}
          onClose={closeOverlay}
          onCardsExtracted={activeOverlay.props.onCardsExtracted}
        />
      )}
      
      {activeOverlay?.type === 'card-detection-overlay' && (
        <CardDetectionOverlay
          isOpen={true}
          onClose={closeOverlay}
          onCardsExtracted={activeOverlay.props.onCardsExtracted}
        />
      )}
    </OverlayContext.Provider>
  );
};
