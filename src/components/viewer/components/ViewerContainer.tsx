import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ViewerContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isFullscreen: boolean;
  ambient: boolean;
  mousePosition: { x: number; y: number };
  selectedScene: { lighting: { color: string } };
  children: React.ReactNode;
  isDrawerOpen?: boolean;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const ViewerContainer: React.FC<ViewerContainerProps> = ({
  containerRef,
  isFullscreen,
  ambient,
  mousePosition,
  selectedScene,
  children,
  isDrawerOpen = false,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}) => {
  const { isDesktop } = useResponsiveLayout();

  console.log('ViewerContainer render:', {
    isFullscreen,
    isDrawerOpen,
    isDesktop,
    mousePosition,
    hasSelectedScene: !!selectedScene
  });

  // Calculate card positioning based on drawer state and device type
  const getCardPositioning = () => {
    if (!isDrawerOpen) {
      return 'items-center justify-center';
    }
    
    if (isDesktop) {
      // On desktop, move card up when drawer is open to give more space
      return 'items-start justify-center pt-16';
    }
    
    // On mobile, keep centered
    return 'items-center justify-center';
  };

  const positioning = getCardPositioning();
  console.log('Card positioning:', positioning);

  // Safe gradient with fallback
  const backgroundGradient = `linear-gradient(135deg, 
    rgba(0,0,0,0.95) 0%, 
    rgba(20,20,30,0.95) 25%, 
    rgba(10,10,20,0.95) 50%, 
    rgba(30,20,40,0.95) 75%, 
    rgba(0,0,0,0.95) 100%)`;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex ${positioning} ${
        isFullscreen ? 'p-0' : 'p-8'
      }`}
      style={{
        background: backgroundGradient
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Enhanced Dark Overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Simplified Ambient Background Effect */}
      {ambient && selectedScene?.lighting?.color && (
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at ${(mousePosition?.x || 0.5) * 100}% ${(mousePosition?.y || 0.5) * 100}%, 
              ${selectedScene.lighting.color} 0%, transparent 30%)`
          }}
        />
      )}

      {/* Debug overlay - shows trigger status */}
      <div className="absolute top-2 left-2 text-white text-xs bg-black/70 p-2 rounded z-[100] border border-crd-green/30">
        <div>Viewer: {isFullscreen ? 'Fullscreen' : 'Normal'}</div>
        <div>Drawer: {isDrawerOpen ? 'Open' : 'Closed'}</div>
        <div>Device: {isDesktop ? 'Desktop' : 'Mobile'}</div>
        <div className="text-crd-green">🔝 TOP TRIGGER: Should be visible at top-right z-[10000]</div>
        <div className="text-yellow-400">Testing mode - moved from bottom</div>
      </div>

      {children}
    </div>
  );
};
