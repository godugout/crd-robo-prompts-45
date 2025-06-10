
import React from 'react';
import { ZoomIn, ZoomOut, Grid3x3 } from 'lucide-react';
import { ToolbarButton } from '@/components/editor/ToolbarButton';
import { toast } from 'sonner';

interface ToolbarZoomControlsProps {
  currentZoom: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

export const ToolbarZoomControls = ({ currentZoom, handleZoomIn, handleZoomOut }: ToolbarZoomControlsProps) => {
  return (
    <>
      <ToolbarButton 
        icon={<Grid3x3 size={18} />} 
        tooltip="Toggle Grid" 
        onClick={() => toast('Grid toggled')}
      />
      <ToolbarButton 
        icon={<ZoomOut size={18} />} 
        tooltip="Zoom Out" 
        onClick={handleZoomOut}
        disabled={currentZoom <= 50}
      />
      <ToolbarButton 
        icon={<ZoomIn size={18} />} 
        tooltip="Zoom In" 
        onClick={handleZoomIn}
        disabled={currentZoom >= 200}
      />
    </>
  );
};
