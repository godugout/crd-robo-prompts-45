
import React, { createContext, useContext, useState, ReactNode } from 'react';

type OverlayType = 'card-detection' | 'card-review' | 'enhanced-card-detection';

interface OverlayContextType {
  isOpen: boolean;
  overlayType: OverlayType | null;
  overlayData: any;
  openOverlay: (type: OverlayType, data?: any) => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

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
  const [isOpen, setIsOpen] = useState(false);
  const [overlayType, setOverlayType] = useState<OverlayType | null>(null);
  const [overlayData, setOverlayData] = useState<any>(null);

  const openOverlay = (type: OverlayType, data?: any) => {
    setOverlayType(type);
    setOverlayData(data);
    setIsOpen(true);
    // No longer need to control body overflow since we're using a dialog
  };

  const closeOverlay = () => {
    setIsOpen(false);
    setOverlayType(null);
    setOverlayData(null);
    // No longer need to reset body overflow
  };

  return (
    <OverlayContext.Provider value={{
      isOpen,
      overlayType,
      overlayData,
      openOverlay,
      closeOverlay
    }}>
      {children}
    </OverlayContext.Provider>
  );
};
