
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Maximize, Minimize } from 'lucide-react';
import { useMobileControl } from '../context/MobileControlContext';

interface ViewerControlButtonsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ViewerControlButtons: React.FC<ViewerControlButtonsProps> = ({
  isFullscreen,
  onToggleFullscreen
}) => {
  const { openPanel } = useMobileControl();

  return (
    <>
      {/* Studio Controls Button */}
      <div className="absolute top-4 right-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openPanel('studio')}
          className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
        >
          <Settings className="w-4 h-4 mr-2" />
          Studio
        </Button>
      </div>

      {/* Fullscreen Toggle */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFullscreen}
          className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  );
};
