
import React from 'react';
import { Sparkles } from 'lucide-react';

interface ViewerInfoPanelProps {
  showStats: boolean;
  isFlipped: boolean;
  showCustomizePanel: boolean;
  hasMultipleCards: boolean;
  selectedMaterial?: { name: string };
}

export const ViewerInfoPanel: React.FC<ViewerInfoPanelProps> = ({
  showStats,
  isFlipped,
  showCustomizePanel,
  hasMultipleCards,
  selectedMaterial
}) => {
  if (!showStats || isFlipped || showCustomizePanel) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 max-w-2xl">
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
              Enhanced Studio | Material: {selectedMaterial?.name || 'Default'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
