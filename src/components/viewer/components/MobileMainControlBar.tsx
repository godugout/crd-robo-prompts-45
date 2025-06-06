
import React from 'react';
import { Sparkles, RotateCcw, Plus, Frame, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMainControlBarProps {
  onStudioOpen: () => void;
  onFlipRotate: () => void;
  onLongPressRotate: () => void;
  onCreateCard: () => void;
  onFrames: () => void;
  onShowcase: () => void;
  isRotateMode: boolean;
  isStudioOpen: boolean;
}

export const MobileMainControlBar: React.FC<MobileMainControlBarProps> = ({
  onStudioOpen,
  onFlipRotate,
  onLongPressRotate,
  onCreateCard,
  onFrames,
  onShowcase,
  isRotateMode,
  isStudioOpen
}) => {
  return (
    <div className="h-20 bg-black bg-opacity-95 backdrop-blur border-t border-white/10 flex items-center justify-around px-4">
      {/* Studio Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onStudioOpen}
        className={`flex flex-col items-center justify-center h-16 w-16 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl ${
          isStudioOpen ? 'ring-2 ring-crd-green' : ''
        }`}
      >
        <Sparkles className="w-5 h-5 mb-1" />
        <span className="text-xs">Studio</span>
      </Button>

      {/* Flip/Rotate Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFlipRotate}
        onTouchStart={(e) => {
          // Long press detection for rotate mode
          const timer = setTimeout(() => {
            onLongPressRotate();
            if ('vibrate' in navigator) {
              navigator.vibrate(100);
            }
          }, 800);
          
          const cleanup = () => {
            clearTimeout(timer);
            e.currentTarget.removeEventListener('touchend', cleanup);
            e.currentTarget.removeEventListener('touchcancel', cleanup);
          };
          
          e.currentTarget.addEventListener('touchend', cleanup);
          e.currentTarget.addEventListener('touchcancel', cleanup);
        }}
        className={`flex flex-col items-center justify-center h-16 w-16 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl ${
          isRotateMode ? 'ring-2 ring-orange-500' : ''
        }`}
      >
        <RotateCcw className="w-5 h-5 mb-1" />
        <span className="text-xs">{isRotateMode ? 'Rotate' : 'Flip'}</span>
      </Button>

      {/* Create Card Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCreateCard}
        className="flex flex-col items-center justify-center h-16 w-16 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl"
      >
        <Plus className="w-5 h-5 mb-1" />
        <span className="text-xs">Create</span>
      </Button>

      {/* Frames Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFrames}
        className="flex flex-col items-center justify-center h-16 w-16 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl"
      >
        <Frame className="w-5 h-5 mb-1" />
        <span className="text-xs">Frames</span>
      </Button>

      {/* Showcase Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onShowcase}
        className="flex flex-col items-center justify-center h-16 w-16 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl"
      >
        <Crown className="w-5 h-5 mb-1" />
        <span className="text-xs">Showcase</span>
      </Button>
    </div>
  );
};
