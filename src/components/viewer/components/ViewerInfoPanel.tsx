
import React from 'react';
import { Sparkles } from 'lucide-react';
import type { UserTier } from '../types/tierSystem';

interface ViewerInfoPanelProps {
  showStats: boolean;
  isFlipped: boolean;
  showCustomizePanel: boolean;
  showEnhancedPanel: boolean;
  panelWidth: number;
  hasMultipleCards: boolean;
  userTier: UserTier;
  selectedMaterialName?: string;
}

export const ViewerInfoPanel: React.FC<ViewerInfoPanelProps> = ({
  showStats,
  isFlipped,
  showCustomizePanel,
  showEnhancedPanel,
  panelWidth,
  hasMultipleCards,
  userTier,
  selectedMaterialName
}) => {
  if (!showStats || isFlipped || showCustomizePanel || showEnhancedPanel) {
    return null;
  }

  return (
    <div 
      className="absolute bottom-20 left-4 z-10 max-w-2xl"
      style={{ 
        right: `${panelWidth + 32}px`,
        marginRight: '100px' 
      }}
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
              {userTier === 'rookie' ? '🌟 Rookie' : userTier === 'pro' ? '⚡ Pro' : '👑 Baller'} | {selectedMaterialName || 'Default'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
