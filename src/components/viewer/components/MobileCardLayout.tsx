
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileCardLayoutProps {
  children: React.ReactNode;
  bottomControls: React.ReactNode;
  floatingControls?: React.ReactNode;
  infoPanel?: React.ReactNode;
  showInfoPanel?: boolean;
}

export const MobileCardLayout: React.FC<MobileCardLayoutProps> = ({
  children,
  bottomControls,
  floatingControls,
  infoPanel,
  showInfoPanel = false
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
      {/* Card Safe Area - Top 70% */}
      <div className="flex-1 relative overflow-hidden" style={{ height: '70vh' }}>
        {/* Card Container */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {children}
        </div>
        
        {/* Floating Controls (Studio button, etc.) */}
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

      {/* Bottom Control Bar - Fixed Height */}
      <div className="h-24 bg-black bg-opacity-95 backdrop-blur border-t border-white/10 flex-shrink-0">
        {bottomControls}
      </div>
    </div>
  );
};
