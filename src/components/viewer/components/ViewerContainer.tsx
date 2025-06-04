
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
  onMouseMove,
  onMouseUp,
  onMouseLeave
}) => {
  const { isDesktop } = useResponsiveLayout();

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
      className={`fixed inset-0 z-50 flex items-center justify-center ${
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

      {children}
    </div>
  );
};
