
import React from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CardData } from '@/hooks/useCardEditor';

interface ViewerControlsProps {
  isFullscreen: boolean;
  showCustomizePanel: boolean;
  showEffects: boolean;
  autoRotate: boolean;
  onToggleCustomizePanel: () => void;
  onToggleEffects: () => void;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  onClose?: () => void;
  card: CardData;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  isFullscreen,
  showCustomizePanel,
  showEffects,
  autoRotate,
  onToggleCustomizePanel,
  onToggleEffects,
  onToggleAutoRotate,
  onReset,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onShare,
  onDownload,
  onClose,
  card
}) => {
  return (
    <div className="absolute top-4 right-4 flex space-x-2 z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCustomizePanel}
        className={`bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 ${showCustomizePanel ? 'bg-opacity-40' : ''}`}
      >
        <Settings className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleEffects}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        {showEffects ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleAutoRotate}
        className={`bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20 ${autoRotate ? 'bg-opacity-40' : ''}`}
      >
        <RotateCw className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <Move className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <ZoomIn className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        <ZoomOut className="w-4 h-4 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleFullscreen}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
      </Button>
      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(card)}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
        >
          <Share2 className="w-4 h-4 text-white" />
        </Button>
      )}
      {onDownload && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDownload(card)}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
        >
          <Download className="w-4 h-4 text-white" />
        </Button>
      )}
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur border border-white/20"
        >
          <X className="w-4 h-4 text-white" />
        </Button>
      )}
    </div>
  );
};
