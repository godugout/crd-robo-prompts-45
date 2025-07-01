
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  active?: boolean;
  disabled?: boolean;
  badge?: number;
  onClick: () => void;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  tooltip,
  active = false,
  disabled = false,
  badge,
  onClick
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 p-1.5 relative",
            active ? "bg-editor-tool text-white" : "text-gray-400 hover:text-white",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={onClick}
          disabled={disabled}
        >
          {icon}
          {badge && (
            <span className="absolute -top-1 -right-1 bg-crd-orange text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {badge}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
