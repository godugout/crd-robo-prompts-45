
import React from 'react';
import { MousePointer, PenTool, Move, Sparkles } from 'lucide-react';
import { ToolbarButton } from '@/components/editor/ToolbarButton';
import { Button } from '@/components/ui/button';

interface ToolbarDrawingControlsProps {
  activeTool: string;
  isMagicBrush: boolean;
  showEffects: boolean;
  handleToolSelect: (tool: string) => void;
  toggleMagicBrush: () => void;
  toggleEffects: () => void;
}

export const ToolbarDrawingControls = ({
  activeTool,
  isMagicBrush,
  showEffects,
  handleToolSelect,
  toggleMagicBrush,
  toggleEffects
}: ToolbarDrawingControlsProps) => {
  return (
    <>
      <ToolbarButton 
        icon={<MousePointer size={18} />} 
        tooltip="Select" 
        active={activeTool === 'select'} 
        onClick={() => handleToolSelect('select')}
      />
      <ToolbarButton 
        icon={<Move size={18} />} 
        tooltip="Move" 
        active={activeTool === 'move'} 
        onClick={() => handleToolSelect('move')}
      />
      <div className="flex items-center">
        <ToolbarButton 
          icon={<PenTool size={18} />} 
          tooltip={isMagicBrush ? "Magic Pen" : "Pen"} 
          active={activeTool === 'pen'} 
          onClick={() => handleToolSelect('pen')}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-4 w-4 ml-1 p-0"
          onClick={toggleMagicBrush}
        >
          <div className={`h-2 w-2 rounded-full ${isMagicBrush ? 'bg-crd-orange' : 'bg-gray-500'}`}></div>
        </Button>
      </div>
      <ToolbarButton 
        icon={<Sparkles size={18} />} 
        tooltip="Effects" 
        active={showEffects} 
        onClick={toggleEffects}
      />
    </>
  );
};
