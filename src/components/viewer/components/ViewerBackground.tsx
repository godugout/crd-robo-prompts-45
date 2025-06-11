
import React from 'react';
import type { EnvironmentScene } from '../types';
import { getEnvironmentSceneConfig } from '../types';

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
  const sceneConfig = selectedScene ? getEnvironmentSceneConfig(selectedScene) : null;
  
  return (
    <>
      {/* Enhanced Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle Ambient Background Effect */}
      {ambient && sceneConfig && sceneConfig.lighting && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgb(${sceneConfig.lighting.color.r}, ${sceneConfig.lighting.color.g}, ${sceneConfig.lighting.color.b}) 0%, 
              transparent 40%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}
    </>
  );
};
