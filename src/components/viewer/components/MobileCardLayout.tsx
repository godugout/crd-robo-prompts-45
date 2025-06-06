
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className="flex flex-col h-full w-full relative">
      {/* Card Safe Area - Adjusted for two-level controls */}
      <div className="flex-1 relative overflow-hidden" style={{ height: '65vh' }}>
        {/* Card Container */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {children}
        </div>
        
        {/* Floating Controls (Traditional studio button, etc.) */}
        {floatingControls && (
          <div className="absolute top-4 right-4 z-20">
            {floatingControls}
          </div>
        )}
      </div>

      {/* Info Panel - Collapsible */}
      {showInfoPanel && infoPanel && (
        <div className="bg-black bg-opacity-90 backdrop-blur border-t border-white/10 px-4 py-2">
          {infoPanel}
        </div>
      )}

      {/* Level 2 Panels */}
      {studioPanel}
      {createCardPanel}
      {framesPanel}
      {showcasePanel}

      {/* Main Control Bar - Fixed Height (Level 1) */}
      <div className="flex-shrink-0">
        {bottomControls}
      </div>
    </div>
  );
};
