
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileControlProvider } from '../context/MobileControlContext';

interface MobileCardLayoutProps {
  children: React.ReactNode;
  bottomControls: React.ReactNode;
  floatingControls?: React.ReactNode;
  infoPanel?: React.ReactNode;
  showInfoPanel?: boolean;
  studioPanel?: React.ReactNode;
  createCardPanel?: React.ReactNode;
  framesPanel?: React.ReactNode;
  showcasePanel?: React.ReactNode;
}

export const MobileCardLayout: React.FC<MobileCardLayoutProps> = ({
  children,
  bottomControls,
  floatingControls,
  infoPanel,
  showInfoPanel = false,
  studioPanel,
  createCardPanel,
  framesPanel,
  showcasePanel
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className="flex h-full">
        {children}
        {floatingControls}
        {infoPanel}
      </div>
    );
  }

  return (
    <MobileControlProvider>
      <div className="flex flex-col h-full w-full relative overflow-hidden">
        {/* Card Safe Area - Optimized for two-level controls */}
        <div className="flex-1 relative" style={{ height: 'calc(100vh - 80px)' }}>
          {/* Card Container with Enhanced Gestures */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {children}
          </div>
          
          {/* Floating Controls (Navigation, etc.) */}
          {floatingControls && (
            <div className="absolute top-4 right-4 z-30">
              {floatingControls}
            </div>
          )}
        </div>

        {/* Info Panel - Collapsible */}
        {showInfoPanel && infoPanel && (
          <div className="bg-black/90 backdrop-blur border-t border-white/10 px-4 py-2 z-20">
            {infoPanel}
          </div>
        )}

        {/* Level 2 Panels - Enhanced with Animations */}
        {studioPanel}
        {createCardPanel}
        {framesPanel}
        {showcasePanel}

        {/* Level 1 Control Bar - Fixed Bottom */}
        <div className="flex-shrink-0 z-40">
          {bottomControls}
        </div>
      </div>
    </MobileControlProvider>
  );
};
