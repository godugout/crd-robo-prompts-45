
import React from 'react';
import type { EnvironmentScene } from '../types';

interface ViewerBackgroundProps {
  selectedScene?: EnvironmentScene;
  mousePosition: { x: number; y: number };
  ambient: boolean;
}

export const ViewerBackground: React.FC<ViewerBackgroundProps> = ({
  selectedScene,
  mousePosition,
  ambient
}) => {
  return (
    <>
      {/* Enhanced Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle Ambient Background Effect */}
      {ambient && selectedScene && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              ${selectedScene.lighting.color} 0%, transparent 40%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}
    </>
  );
};
