
import React from 'react';
import { Sparkles } from 'lucide-react';
import type { EnvironmentScene } from '../types';

interface InfoPanelProps {
  showStats: boolean;
  isFlipped: boolean;
  showCustomizePanel: boolean;
  hasMultipleCards: boolean;
  selectedScene: EnvironmentScene;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  showStats,
  isFlipped,
  showCustomizePanel,
  hasMultipleCards,
  selectedScene
}) => {
  if (!showStats || isFlipped || showCustomizePanel) return null;

  return (
    <div 
      className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-10" 
      style={{ marginRight: hasMultipleCards ? '180px' : '20px' }}
    >
      <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between text-white">
          <div className="flex space-x-4 text-sm">
            <span>Click card to flip</span>
            <span>•</span>
            <span>Drag to rotate manually</span>
            <span>•</span>
            <span>Scroll to zoom</span>
            <span>•</span>
            <span>Move mouse for effects</span>
            {hasMultipleCards && (
              <>
                <span>•</span>
                <span>Use ← → keys to navigate</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">
              Enhanced Studio | Scene: {selectedScene.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
