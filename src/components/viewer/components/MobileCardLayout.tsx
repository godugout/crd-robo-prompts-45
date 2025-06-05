
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
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      {/* Card Safe Area - Flexible height based on info panel */}
      <div 
        className={`flex-1 relative overflow-hidden transition-all duration-300 ${
          showInfoPanel ? 'h-[55vh]' : 'h-[75vh]'
        }`}
        style={{ minHeight: '50vh' }}
      >
        {/* Card Container */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          {children}
        </div>
        
        {/* Floating Controls (Studio button, etc.) */}
        {floatingControls && (
          <div className="absolute top-3 right-3 z-20">
            {floatingControls}
          </div>
        )}
      </div>

      {/* Info Panel - Collapsible with smooth transition */}
      {showInfoPanel && infoPanel && (
        <div className="bg-black bg-opacity-95 backdrop-blur border-t border-white/10 px-4 py-3 max-h-[25vh] overflow-y-auto">
          {infoPanel}
        </div>
      )}

      {/* Bottom Control Bar - Fixed Height with adaptive content */}
      <div className="h-20 bg-black bg-opacity-95 backdrop-blur border-t border-white/10 flex-shrink-0">
        {bottomControls}
      </div>
    </div>
  );
};
