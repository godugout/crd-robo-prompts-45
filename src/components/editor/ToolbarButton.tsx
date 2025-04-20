
import React, { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ToolbarButtonProps {
  icon: ReactNode;
  tooltip: string;
  active?: boolean;
  onClick?: () => void;
}

export const ToolbarButton = ({ icon, tooltip, active = false, onClick }: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 p-1.5 ${active 
            ? 'bg-editor-tool text-white' 
            : 'text-gray-400 hover:text-white'}`}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="py-1 px-2 text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
