
import React from 'react';
import { Grid3x3, Share, RotateCw, Sparkles } from 'lucide-react';
import { CRDButton, Typography } from '@/components/ui/design-system';
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
      <Typography as="h2" variant="h3" className="mb-0">
        Preview
      </Typography>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <CRDButton 
              variant="ghost" 
              size="icon" 
              className={`text-crd-lightGray hover:text-white ${showGrid ? "text-crd-green" : ""}`}
              onClick={onToggleGrid}
            >
              <Grid3x3 size={18} />
            </CRDButton>
          </TooltipTrigger>
          <TooltipContent>Toggle Grid</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <CRDButton 
              variant="ghost" 
              size="icon" 
              className={`text-crd-lightGray hover:text-white ${showEffects ? "text-crd-orange" : ""}`}
              onClick={onToggleEffects}
            >
              <Sparkles size={18} />
            </CRDButton>
          </TooltipTrigger>
          <TooltipContent>Toggle Effects</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <CRDButton 
              variant="ghost" 
              size="icon" 
              className="text-crd-lightGray hover:text-white"
              onClick={onRotate}
            >
              <RotateCw size={18} />
            </CRDButton>
          </TooltipTrigger>
          <TooltipContent>Rotate Card</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <CRDButton 
              variant="ghost" 
              size="icon" 
              className="text-crd-lightGray hover:text-white"
              onClick={onShare}
            >
              <Share size={18} />
            </CRDButton>
          </TooltipTrigger>
          <TooltipContent>Share Card</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
