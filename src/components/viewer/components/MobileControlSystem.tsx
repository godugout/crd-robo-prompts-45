
import React from 'react';
import { Sparkles, RotateCcw, Info, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileControlSystemProps {
  // Effects & Studio
  showEffects: boolean;
  onToggleEffects: () => void;
  onOpenStudio: () => void;
  
  // Card Controls
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleInfo: () => void;
  showInfo: boolean;
  
  // Navigation
  hasMultipleCards?: boolean;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  currentCardIndex?: number;
  totalCards?: number;
  onPreviousCard?: () => void;
  onNextCard?: () => void;
}

export const MobileControlSystem: React.FC<MobileControlSystemProps> = ({
  showEffects,
  onToggleEffects,
  onOpenStudio,
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-white/10">
      {/* Navigation Row - Only show if multiple cards */}
      {hasMultipleCards && (
        <div className="flex items-center justify-center py-2 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousCard}
              disabled={!canGoPrev}
              className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 h-9 w-9 p-0 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-white text-sm font-medium px-4 py-1 bg-white/10 rounded-full">
              {currentCardIndex + 1} / {totalCards}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextCard}
              disabled={!canGoNext}
              className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 h-9 w-9 p-0 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Controls Row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Controls - Effects & Studio */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={onToggleEffects}
            className={`h-12 w-12 p-0 rounded-full ${
              showEffects 
                ? 'bg-crd-green/20 border border-crd-green/50 text-crd-green' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Sparkles className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={onOpenStudio}
            className="bg-white/10 hover:bg-white/20 text-white h-12 px-6 rounded-full font-medium"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Studio
          </Button>
        </div>
        
        {/* Right Controls - Zoom & Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={onZoomOut}
            className="bg-white/10 hover:bg-white/20 text-white h-12 w-12 p-0 rounded-full"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={onZoomIn}
            className="bg-white/10 hover:bg-white/20 text-white h-12 w-12 p-0 rounded-full"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={onReset}
            className="bg-white/10 hover:bg-white/20 text-white h-12 w-12 p-0 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={onToggleInfo}
            className={`h-12 w-12 p-0 rounded-full ${
              showInfo 
                ? 'bg-crd-green/20 border border-crd-green/50 text-crd-green' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
