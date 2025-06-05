
import React from 'react';
import { MobileHeader } from './MobileHeader';
import { MobileControlSystem } from './MobileControlSystem';
import { MobileInfoPanel } from './MobileInfoPanel';

interface MobileCardViewerProps {
  children: React.ReactNode;
  
  // Header props
  onOpenStudio: () => void;
  onClose?: () => void;
  isStudioOpen?: boolean;
  
  // Control props
  showEffects: boolean;
  onToggleEffects: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleInfo: () => void;
  showInfo: boolean;
  
  // Navigation props
  hasMultipleCards?: boolean;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  currentCardIndex?: number;
  totalCards?: number;
  onPreviousCard?: () => void;
  onNextCard?: () => void;
  
  // Info panel props
  selectedMaterial?: { name: string };
  
  // Background environment
  environmentStyle?: React.CSSProperties;
  ambientOverlay?: React.ReactNode;
}

export const MobileCardViewer: React.FC<MobileCardViewerProps> = ({
  children,
  onOpenStudio,
  onClose,
  isStudioOpen = false,
  showEffects,
  onToggleEffects,
  onReset,
  onZoomIn,
  onZoomOut,
  onToggleInfo,
  showInfo,
  hasMultipleCards = false,
  canGoPrev = false,
  canGoNext = false,
  currentCardIndex = 0,
  totalCards = 1,
  onPreviousCard,
  onNextCard,
  selectedMaterial,
  environmentStyle,
  ambientOverlay
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      style={environmentStyle}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/60" />
      {ambientOverlay}
      
      {/* Mobile Header */}
      <MobileHeader
        onOpenStudio={onOpenStudio}
        onClose={onClose}
        isStudioOpen={isStudioOpen}
      />
      
      {/* Card Display Area */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          paddingTop: '60px', // Header height
          paddingBottom: showInfo ? '180px' : hasMultipleCards ? '140px' : '100px', // Controls height
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {children}
      </div>
      
      {/* Info Panel - Collapsible */}
      {showInfo && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4"
             style={{ 
               marginBottom: hasMultipleCards ? '140px' : '100px',
               maxHeight: '120px',
               overflowY: 'auto'
             }}>
          <MobileInfoPanel
            selectedMaterial={selectedMaterial}
            hasMultipleCards={hasMultipleCards}
          />
        </div>
      )}
      
      {/* Mobile Control System */}
      <MobileControlSystem
        showEffects={showEffects}
        onToggleEffects={onToggleEffects}
        onOpenStudio={onOpenStudio}
        onReset={onReset}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onToggleInfo={onToggleInfo}
        showInfo={showInfo}
        hasMultipleCards={hasMultipleCards}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
        onPreviousCard={onPreviousCard}
        onNextCard={onNextCard}
      />
    </div>
  );
};
