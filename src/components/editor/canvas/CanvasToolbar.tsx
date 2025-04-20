
import React from 'react';
import { Grid3x3, Share, RotateCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface CanvasToolbarProps {
  showGrid: boolean;
  showEffects: boolean;
  onToggleGrid: () => void;
  onToggleEffects: () => void;
  onRotate: () => void;
  onShare: () => void;
}

export const CanvasToolbar = ({
  showGrid,
  showEffects,
  onToggleGrid,
  onToggleEffects,
  onRotate,
  onShare
}: CanvasToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-white text-2xl font-bold">Preview</h2>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-cardshow-lightGray hover:text-white"
              onClick={onToggleGrid}
            >
              <Grid3x3 size={18} className={showGrid ? "text-cardshow-green" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Grid</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-cardshow-lightGray hover:text-white"
              onClick={onToggleEffects}
            >
              <Sparkles size={18} className={showEffects ? "text-cardshow-orange" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Effects</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-cardshow-lightGray hover:text-white"
              onClick={onRotate}
            >
              <RotateCw size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate Card</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-cardshow-lightGray hover:text-white"
              onClick={onShare}
            >
              <Share size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Card</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
