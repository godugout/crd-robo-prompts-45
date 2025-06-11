
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DesktopStudioToggleProps {
  showCustomizePanel: boolean;
  onToggle: () => void;
}

export const DesktopStudioToggle: React.FC<DesktopStudioToggleProps> = ({
  showCustomizePanel,
  onToggle
}) => {
  if (showCustomizePanel) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <Sparkles className="w-4 h-4 text-white mr-2" />
        <span className="text-white text-sm">Open Studio</span>
      </Button>
    </div>
  );
};
