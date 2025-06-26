
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface PreviewControlsProps {
  isPlaying: boolean;
  previewMode: string;
  onToggleAnimation: () => void;
  onModeChange: (mode: string) => void;
}

export const PreviewControls: React.FC<PreviewControlsProps> = ({
  isPlaying,
  previewMode,
  onToggleAnimation,
  onModeChange
}) => {
  return (
    <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md rounded-xl p-3 z-10 border border-white/20">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAnimation}
          className="text-white hover:bg-white/10"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        
        <div className="w-px h-4 bg-white/20" />
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
