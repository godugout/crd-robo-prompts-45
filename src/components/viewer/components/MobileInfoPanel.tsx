
import React from 'react';
import { Sparkles } from 'lucide-react';

interface MobileInfoPanelProps {
  selectedMaterial?: { name: string };
  hasMultipleCards?: boolean;
}

export const MobileInfoPanel: React.FC<MobileInfoPanelProps> = ({
  selectedMaterial,
  hasMultipleCards = false
}) => {
  return (
    <div className="flex items-center justify-between text-white">
      <div className="flex space-x-3 text-xs">
        <span>Tap to flip</span>
        <span>•</span>
        <span>Pinch to zoom</span>
        <span>•</span>
        <span>Drag to rotate</span>
        {hasMultipleCards && (
          <>
            <span>•</span>
            <span>Swipe to navigate</span>
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Sparkles className="w-3 h-3 text-crd-green" />
        <span className="text-xs">
          {selectedMaterial?.name || 'Default'}
        </span>
      </div>
    </div>
  );
};
