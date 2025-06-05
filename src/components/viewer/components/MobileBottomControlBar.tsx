
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
    <div className="h-full flex items-center justify-between px-4">
      {/* Left Section - Navigation */}
      <div className="flex items-center space-x-2">
        {hasMultipleCards ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousCard}
              disabled={!canGoPrev}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white disabled:opacity-50 h-10 w-10 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-white text-sm min-w-[60px] text-center">
              {currentCardIndex + 1}/{totalCards}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextCard}
              disabled={!canGoNext}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white disabled:opacity-50 h-10 w-10 p-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <div className="w-20" /> // Spacer
        )}
      </div>

      {/* Center Section - Main Controls */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleEffects}
          className={`
            bg-white bg-opacity-20 hover:bg-opacity-30 text-white h-12 w-12 p-0
            ${showEffects ? 'ring-2 ring-crd-green' : ''}
          `}
        >
          <Sparkles className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white h-12 w-12 p-0"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white h-12 w-12 p-0"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white h-12 w-12 p-0"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Right Section - Info Toggle */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleInfo}
          className={`
            bg-white bg-opacity-20 hover:bg-opacity-30 text-white h-10 w-10 p-0
            ${showInfo ? 'ring-2 ring-crd-green' : ''}
          `}
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
