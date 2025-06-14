
import React from 'react';
import { FramePreview } from './FramePreview';
import type { MinimalistFrame } from '../data/minimalistFrames';

interface HeroFrameDisplayProps {
  frame: MinimalistFrame;
  uploadedImage?: string;
  isDragActive: boolean;
  isTransitioning: boolean;
}

export const HeroFrameDisplay: React.FC<HeroFrameDisplayProps> = ({
  frame,
  uploadedImage,
  isDragActive,
  isTransitioning
}) => {
  return (
    <div className="relative z-20 flex items-center justify-center min-h-[60vh] px-8 py-12">
      <div className={`hero-frame-container transform transition-all duration-500 ease-out ${
        isTransitioning ? 'scale-95 opacity-80' : 'scale-125 opacity-100'
      }`}
      style={{ 
        willChange: 'transform, opacity',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <div className="relative">
          <FramePreview 
            frame={frame}
            imageUrl={uploadedImage}
            size="large"
            isDragActive={isDragActive}
          />
          {/* Hero glow effect */}
          <div className="absolute inset-0 bg-crd-green/10 rounded-lg animate-pulse opacity-70 pointer-events-none shadow-2xl" />
          <div className="absolute inset-0 shadow-2xl shadow-crd-green/20 rounded-lg pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
