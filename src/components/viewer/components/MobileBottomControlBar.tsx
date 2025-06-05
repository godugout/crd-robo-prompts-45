
import React from 'react';
import { Sparkles, RotateCcw, ZoomIn, ZoomOut, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="h-full flex flex-col">
      {/* Navigation Section - Only show if multiple cards */}
      {hasMultipleCards && (
        <div className="flex items-center justify-center px-4 py-2 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousCard}
              disabled={!canGoPrev}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                disabled:opacity-50 min-h-[40px] min-w-[40px] p-2
                touch-manipulation active:scale-95 transition-transform
                -webkit-tap-highlight-color: transparent
              "
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-white text-sm min-w-[60px] text-center font-medium px-3">
              {currentCardIndex + 1}/{totalCards}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextCard}
              disabled={!canGoNext}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                disabled:opacity-50 min-h-[40px] min-w-[40px] p-2
                touch-manipulation active:scale-95 transition-transform
                -webkit-tap-highlight-color: transparent
              "
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Controls - Horizontal scroll for overflow */}
      <div className="flex-1 flex items-center px-2">
        <ScrollArea className="w-full">
          <div className="flex items-center justify-center space-x-2 px-2 min-w-max">
            {/* Effects Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={onToggleEffects}
              className={`
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                min-h-[48px] min-w-[48px] p-2 touch-manipulation 
                active:scale-95 transition-all duration-150 flex-shrink-0
                -webkit-tap-highlight-color: transparent
                ${showEffects ? 'ring-2 ring-crd-green ring-offset-2 ring-offset-black' : ''}
              `}
              style={{ touchAction: 'manipulation' }}
            >
              <Sparkles className="w-5 h-5" />
            </Button>

            {/* Reset */}
            <Button
              variant="ghost"
              size="lg"
              onClick={onReset}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                min-h-[48px] min-w-[48px] p-2 touch-manipulation flex-shrink-0
                active:scale-95 transition-transform duration-150
                -webkit-tap-highlight-color: transparent
              "
              style={{ touchAction: 'manipulation' }}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            {/* Zoom In */}
            <Button
              variant="ghost"
              size="lg"
              onClick={onZoomIn}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                min-h-[48px] min-w-[48px] p-2 touch-manipulation flex-shrink-0
                active:scale-95 transition-transform duration-150
                -webkit-tap-highlight-color: transparent
              "
              style={{ touchAction: 'manipulation' }}
            >
              <ZoomIn className="w-5 h-5" />
            </Button>

            {/* Zoom Out */}
            <Button
              variant="ghost"
              size="lg"
              onClick={onZoomOut}
              className="
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                min-h-[48px] min-w-[48px] p-2 touch-manipulation flex-shrink-0
                active:scale-95 transition-transform duration-150
                -webkit-tap-highlight-color: transparent
              "
              style={{ touchAction: 'manipulation' }}
            >
              <ZoomOut className="w-5 h-5" />
            </Button>

            {/* Info Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={onToggleInfo}
              className={`
                bg-white bg-opacity-20 hover:bg-opacity-30 text-white 
                min-h-[48px] min-w-[48px] p-2 touch-manipulation flex-shrink-0
                active:scale-95 transition-all duration-150
                -webkit-tap-highlight-color: transparent
                ${showInfo ? 'ring-2 ring-crd-green ring-offset-2 ring-offset-black' : ''}
              `}
              style={{ touchAction: 'manipulation' }}
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
