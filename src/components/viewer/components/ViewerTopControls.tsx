
import React from 'react';
import { 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Eye,
  EyeOff,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ViewerTopControlsProps {
  showEffects: boolean;
  autoRotate: boolean;
  showCustomizePanel: boolean;
  onToggleEffects: () => void;
  onToggleAutoRotate: () => void;
  onToggleCustomizePanel: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentCardIndex: number;
  totalCards: number;
  onPreviousCard: () => void;
  onNextCard: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const ViewerTopControls: React.FC<ViewerTopControlsProps> = ({
  showEffects,
  autoRotate,
  showCustomizePanel,
  onToggleEffects,
  onToggleAutoRotate,
  onToggleCustomizePanel,
  onReset,
  onZoomIn,
  onZoomOut,
  currentCardIndex,
  totalCards,
  onPreviousCard,
  onNextCard,
  canGoPrev,
  canGoNext
}) => {
  return (
    <div className="fixed top-6 left-0 right-0 z-[9999] flex items-center justify-between px-6">
      {/* Left Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCustomizePanel}
          className={`bg-black/80 backdrop-blur-lg border border-crd-green/30 text-white hover:bg-black/95 hover:border-crd-green/50 transition-all duration-200 ${
            showCustomizePanel ? 'bg-crd-green/20 border-crd-green/60' : ''
          }`}
        >
          <Settings className="w-4 h-4 mr-2 text-crd-green" />
          Enhanced Studio
        </Button>

        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEffects}
            className="bg-black/80 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20"
          >
            {showEffects ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleAutoRotate}
            className={`bg-black/80 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 ${autoRotate ? 'bg-white/30' : ''}`}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="bg-black/80 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20"
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="bg-black/80 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="bg-black/80 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center Navigation (if multiple cards) */}
      {totalCards > 1 && (
        <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousCard}
            disabled={!canGoPrev}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Badge variant="outline" className="border-crd-green/30 text-crd-green">
            {currentCardIndex + 1} of {totalCards}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextCard}
            disabled={!canGoNext}
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Right Controls - Close button can be added here if needed */}
      <div className="flex items-center space-x-2">
        {/* Space for additional controls */}
      </div>
    </div>
  );
};
