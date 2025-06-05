
import React from 'react';
import { Sparkles, RotateCcw, ZoomIn, ZoomOut, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileBottomControlBarProps {
  showEffects: boolean;
  onToggleEffects: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleInfo: () => void;
  showInfo: boolean;
  // Navigation props
  hasMultipleCards?: boolean;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  currentCardIndex?: number;
  totalCards?: number;
  onPreviousCard?: () => void;
  onNextCard?: () => void;
}

export const MobileBottomControlBar: React.FC<MobileBottomControlBarProps> = ({
  showEffects,
  onToggleEffects,
  onReset,
  onZoomIn,
  onZoomOut,
  onToggleInfo,
  showInfo,
  hasMultipleCards = false,
  canGoPrev = false,
  canGoNext = false,
  currentCardIndex = 0,
  totalCards = 1,
  onPreviousCard,
  onNextCard
}) => {
  return (
    <div className="h-full flex items-center justify-between px-4" style={{ touchAction: 'manipulation' }}>
      {/* Left Section - Navigation */}
      <div className="flex items-center space-x-3">
        {hasMultipleCards ? (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={onPreviousCard}
              disabled={!canGoPrev}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                disabled:opacity-50 min-h-[48px] min-w-[48px] p-0
                touch-manipulation active:scale-95 transition-transform
                -webkit-tap-highlight-color: transparent
              "
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="text-white text-sm min-w-[60px] text-center font-medium">
              {currentCardIndex + 1}/{totalCards}
            </div>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={onNextCard}
              disabled={!canGoNext}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                disabled:opacity-50 min-h-[48px] min-w-[48px] p-0
                touch-manipulation active:scale-95 transition-transform
                -webkit-tap-highlight-color: transparent
              "
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        ) : (
          <div className="w-20" /> // Spacer
        )}
      </div>

      {/* Center Section - Main Controls */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleEffects}
          className={`
            bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
            min-h-[52px] min-w-[52px] p-0 touch-manipulation 
            active:scale-95 transition-all duration-150
            -webkit-tap-highlight-color: transparent
            ${showEffects ? 'ring-2 ring-crd-green ring-offset-2 ring-offset-black' : ''}
          `}
          style={{ touchAction: 'manipulation' }}
        >
          <Sparkles className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onReset}
          className="
            bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
            min-h-[52px] min-w-[52px] p-0 touch-manipulation
            active:scale-95 transition-transform duration-150
            -webkit-tap-highlight-color: transparent
          "
          style={{ touchAction: 'manipulation' }}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onZoomIn}
          className="
            bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
            min-h-[52px] min-w-[52px] p-0 touch-manipulation
            active:scale-95 transition-transform duration-150
            -webkit-tap-highlight-color: transparent
          "
          style={{ touchAction: 'manipulation' }}
        >
          <ZoomIn className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onZoomOut}
          className="
            bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
            min-h-[52px] min-w-[52px] p-0 touch-manipulation
            active:scale-95 transition-transform duration-150
            -webkit-tap-highlight-color: transparent
          "
          style={{ touchAction: 'manipulation' }}
        >
          <ZoomOut className="w-6 h-6" />
        </Button>
      </div>

      {/* Right Section - Info Toggle */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleInfo}
          className={`
            bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
            min-h-[48px] min-w-[48px] p-0 touch-manipulation
            active:scale-95 transition-all duration-150
            -webkit-tap-highlight-color: transparent
            ${showInfo ? 'ring-2 ring-crd-green ring-offset-2 ring-offset-black' : ''}
          `}
          style={{ touchAction: 'manipulation' }}
        >
          <Info className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
