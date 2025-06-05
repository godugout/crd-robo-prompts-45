
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserTier } from '../types/tierSystem';

interface ViewerHeaderProps {
  showCustomizePanel: boolean;
  showEnhancedPanel: boolean;
  userTier: UserTier;
  onOpenPanel: () => void;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  showCustomizePanel,
  showEnhancedPanel,
  userTier,
  onOpenPanel
}) => {
  if (showCustomizePanel || showEnhancedPanel) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenPanel}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <Sparkles className="w-4 h-4 text-white mr-2" />
        <span className="text-white text-sm">
          {userTier === 'rookie' ? 'Open Styles' : 'Open Studio'}
        </span>
      </Button>
    </div>
  );
};
