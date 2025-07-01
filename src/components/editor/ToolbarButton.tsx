
import React, { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ToolbarButtonProps {
  icon: ReactNode;
  tooltip: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
}

export const ToolbarButton = ({ 
  icon, 
  tooltip, 
  active = false, 
  onClick, 
  disabled = false,
  badge
}: ToolbarButtonProps) => {
  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 p-1.5 ${
              active 
                ? 'bg-editor-tool text-white' 
                : 'text-gray-400 hover:text-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onClick}
            disabled={disabled}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="py-1 px-2 text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 bg-crd-orange text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </div>
  );
};
