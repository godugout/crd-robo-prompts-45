
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  tooltip?: string;
  onClick?: () => void;
}

export const ToolbarButton = ({ icon, active = false, tooltip, onClick }: ToolbarButtonProps) => {
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "w-8 h-8 rounded p-1.5",
        active ? "bg-editor-highlight text-white" : "text-gray-400 hover:text-white hover:bg-editor-tool"
      )}
      onClick={onClick}
    >
      {icon}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="bottom">{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
