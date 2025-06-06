import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ControlPanelState {
  studio: boolean;
  createCard: boolean;
  frames: boolean;
  showcase: boolean;
  rotateMode: boolean;
}

export interface CardInteractionState {
  zoom: number;
  rotation: { x: number; y: number };
  isFlipped: boolean;
  position: { x: number; y: number };
}

export interface MobileControlContextType {
  // Panel visibility state
  panelState: ControlPanelState;
  setPanelState: React.Dispatch<React.SetStateAction<ControlPanelState>>;
  
  // Card interaction state
  cardState: CardInteractionState;
  setCardState: React.Dispatch<React.SetStateAction<CardInteractionState>>;
  
  // Control bar visibility
  showControlBar: boolean;
  setShowControlBar: (show: boolean) => void;
  
  // Active panel management
  activePanel: keyof ControlPanelState | null;
  openPanel: (panel: keyof ControlPanelState) => void;
  closePanel: () => void;
  
  // Card interaction helpers
  flipCard: () => void;
  resetCardState: () => void;
  zoomCard: (delta: number) => void;
  rotateCard: (rotation: { x: number; y: number }) => void;
  panCard: (delta: { x: number; y: number }) => void;
  
  // Rotation mode
  toggleRotateMode: () => void;
  applyRotationStep: (degrees: number) => void;
}

const MobileControlContext = createContext<MobileControlContextType | undefined>(undefined);

export const useMobileControl = () => {
  const context = useContext(MobileControlContext);
  if (context === undefined) {
    throw new Error('useMobileControl must be used within a MobileControlProvider');
  }
  return context;
};

interface MobileControlProviderProps {
  children: ReactNode;
}

export const MobileControlProvider: React.FC<MobileControlProviderProps> = ({ children }) => {
  const [panelState, setPanelState] = useState<ControlPanelState>({
    studio: false,
    createCard: false,
    frames: false,
    showcase: false,
    rotateMode: false
  });

  const [cardState, setCardState] = useState<CardInteractionState>({
    zoom: 1,
    rotation: { x: 0, y: 0 },
    isFlipped: false,
    position: { x: 0, y: 0 }
  });

  const [showControlBar, setShowControlBar] = useState(true);

  // Get the currently active panel
  const activePanel = Object.entries(panelState).find(([_, isOpen]) => isOpen)?.[0] as keyof ControlPanelState || null;

  // Panel management
  const openPanel = useCallback((panel: keyof ControlPanelState) => {
    setPanelState(prev => ({
      studio: false,
      createCard: false,
      frames: false,
      showcase: false,
      rotateMode: prev.rotateMode, // Preserve rotate mode
      [panel]: true
    }));
  }, []);

  const closePanel = useCallback(() => {
    setPanelState(prev => ({
      ...prev,
      studio: false,
      createCard: false,
      frames: false,
      showcase: false
      // Keep rotateMode as is
    }));
  }, []);

  // Card interaction helpers
  const flipCard = useCallback(() => {
    setCardState(prev => ({
      ...prev,
      isFlipped: !prev.isFlipped
    }));
  }, []);

  const resetCardState = useCallback(() => {
    setCardState({
      zoom: 1,
      rotation: { x: 0, y: 0 },
      isFlipped: false,
      position: { x: 0, y: 0 }
    });
  }, []);

  const zoomCard = useCallback((delta: number) => {
    setCardState(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(3, prev.zoom + delta))
    }));
  }, []);

  const rotateCard = useCallback((rotation: { x: number; y: number }) => {
    setCardState(prev => ({
      ...prev,
      rotation
    }));
  }, []);

  const panCard = useCallback((delta: { x: number; y: number }) => {
    setCardState(prev => ({
      ...prev,
      position: {
        x: prev.position.x + delta.x,
        y: prev.position.y + delta.y
      }
    }));
  }, []);

  // Rotation mode management
  const toggleRotateMode = useCallback(() => {
    setPanelState(prev => ({
      ...prev,
      rotateMode: !prev.rotateMode
    }));
  }, []);

  const applyRotationStep = useCallback((degrees: number) => {
    setCardState(prev => ({
      ...prev,
      rotation: {
        x: prev.rotation.x,
        y: prev.rotation.y + degrees
      }
    }));
  }, []);

  const value: MobileControlContextType = {
    panelState,
    setPanelState,
    cardState,
    setCardState,
    showControlBar,
    setShowControlBar,
    activePanel,
    openPanel,
    closePanel,
    flipCard,
    resetCardState,
    zoomCard,
    rotateCard,
    panCard,
    toggleRotateMode,
    applyRotationStep
  };

  return (
    <MobileControlContext.Provider value={value}>
      {children}
    </MobileControlContext.Provider>
  );
};
