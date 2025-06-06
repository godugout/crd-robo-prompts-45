
import React, { useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Plus, Frame, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobileControl } from '../context/MobileControlContext';
import { cn } from '@/lib/utils';

interface EnhancedMobileMainControlBarProps {
  onCreateCardVariation: (variationType: string) => void;
  onApplyFrame: (frameId: string) => void;
  onSelectShowcaseLayout: (layoutId: string) => void;
  className?: string;
}

export const EnhancedMobileMainControlBar: React.FC<EnhancedMobileMainControlBarProps> = ({
  onCreateCardVariation,
  onApplyFrame,
  onSelectShowcaseLayout,
  className
}) => {
  const {
    panelState,
    activePanel,
    openPanel,
    closePanel,
    flipCard,
    toggleRotateMode,
    applyRotationStep,
    showControlBar
  } = useMobileControl();

  const controlBarRef = useRef<HTMLDivElement>(null);

  // Haptic feedback helper
  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Handle button interactions with haptic feedback
  const handleStudioOpen = () => {
    triggerHaptic(50);
    openPanel('studio');
  };

  const handleFlipRotate = () => {
    if (panelState.rotateMode) {
      triggerHaptic(30);
      applyRotationStep(45);
    } else {
      triggerHaptic(50);
      flipCard();
    }
  };

  const handleLongPressRotate = () => {
    triggerHaptic(100);
    toggleRotateMode();
  };

  const handleCreateCard = () => {
    triggerHaptic(50);
    openPanel('createCard');
  };

  const handleFrames = () => {
    triggerHaptic(50);
    openPanel('frames');
  };

  const handleShowcase = () => {
    triggerHaptic(50);
    openPanel('showcase');
  };

  // Touch event handlers for long press detection
  const handleTouchStart = (callback: () => void) => {
    const timer = setTimeout(() => {
      handleLongPressRotate();
    }, 500);

    const cleanup = () => {
      clearTimeout(timer);
    };

    return { cleanup, callback };
  };

  return (
    <div 
      ref={controlBarRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        "bg-black/95 backdrop-blur-lg border-t border-white/10",
        "pb-safe-area-inset-bottom", // Safe area handling
        showControlBar ? "translate-y-0" : "translate-y-full",
        className
      )}
      style={{
        height: '80px', // 60px content + 20px padding
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="flex items-center justify-around px-4 h-full">
        {/* Studio Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStudioOpen}
          className={cn(
            "flex flex-col items-center justify-center h-14 w-14",
            "bg-white/20 hover:bg-white/30 text-white rounded-xl",
            "transition-all duration-200 transform",
            "active:scale-95",
            panelState.studio && "ring-2 ring-crd-green bg-crd-green/20"
          )}
        >
          <Sparkles className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Studio</span>
        </Button>

        {/* Flip/Rotate Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFlipRotate}
          onTouchStart={(e) => {
            const timer = setTimeout(() => {
              handleLongPressRotate();
            }, 500);
            
            const cleanup = () => {
              clearTimeout(timer);
              e.currentTarget.removeEventListener('touchend', cleanup);
              e.currentTarget.removeEventListener('touchcancel', cleanup);
            };
            
            e.currentTarget.addEventListener('touchend', cleanup);
            e.currentTarget.addEventListener('touchcancel', cleanup);
          }}
          className={cn(
            "flex flex-col items-center justify-center h-14 w-14",
            "bg-white/20 hover:bg-white/30 text-white rounded-xl",
            "transition-all duration-200 transform",
            "active:scale-95",
            panelState.rotateMode && "ring-2 ring-orange-500 bg-orange-500/20"
          )}
        >
          <RotateCcw className={cn(
            "w-5 h-5 mb-1 transition-transform duration-200",
            panelState.rotateMode && "animate-spin"
          )} />
          <span className="text-xs font-medium">
            {panelState.rotateMode ? 'Rotate' : 'Flip'}
          </span>
        </Button>

        {/* Create Card Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateCard}
          className={cn(
            "flex flex-col items-center justify-center h-14 w-14",
            "bg-white/20 hover:bg-white/30 text-white rounded-xl",
            "transition-all duration-200 transform",
            "active:scale-95",
            panelState.createCard && "ring-2 ring-blue-500 bg-blue-500/20"
          )}
        >
          <Plus className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Create</span>
        </Button>

        {/* Frames Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFrames}
          className={cn(
            "flex flex-col items-center justify-center h-14 w-14",
            "bg-white/20 hover:bg-white/30 text-white rounded-xl",
            "transition-all duration-200 transform",
            "active:scale-95",
            panelState.frames && "ring-2 ring-purple-500 bg-purple-500/20"
          )}
        >
          <Frame className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Frames</span>
        </Button>

        {/* Showcase Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShowcase}
          className={cn(
            "flex flex-col items-center justify-center h-14 w-14",
            "bg-white/20 hover:bg-white/30 text-white rounded-xl",
            "transition-all duration-200 transform",
            "active:scale-95 relative",
            panelState.showcase && "ring-2 ring-yellow-500 bg-yellow-500/20"
          )}
        >
          <Crown className="w-5 h-5 mb-1 text-yellow-400" />
          <span className="text-xs font-medium">Showcase</span>
          {/* Premium indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-black/20" />
        </Button>
      </div>

      {/* Rotation Mode Indicator */}
      {panelState.rotateMode && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
      )}
    </div>
  );
};
