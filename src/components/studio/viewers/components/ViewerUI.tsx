
import React from 'react';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';

export const ViewerUI: React.FC = () => {
  const { state } = useAdvancedStudio();
  
  return (
    <>
      {/* Performance indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded px-3 py-1 text-sm text-white">
          Quality: {state.renderQuality.toUpperCase()}
        </div>
      </div>
      
      {/* Animation status */}
      {state.animation.isPlaying && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-crd-green/20 backdrop-blur-sm rounded px-3 py-1 text-sm text-crd-green border border-crd-green/50 animate-pulse">
            Animation Playing - {state.animation.preset}
          </div>
        </div>
      )}
      
      {/* Effect layers indicator */}
      {state.effectLayers.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-crd-green/20 backdrop-blur-sm rounded px-3 py-1 text-sm text-crd-green border border-crd-green/50">
            {state.effectLayers.filter(l => l.enabled).length} Effects Active
          </div>
        </div>
      )}
    </>
  );
};
