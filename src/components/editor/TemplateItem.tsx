
import React from 'react';
import { cn } from '@/lib/utils';

interface TemplateItemProps {
  name: string;
  preview?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const TemplateItem = ({ 
  name, 
  preview = "/placeholder.svg", 
  isSelected = false,
  onClick
}: TemplateItemProps) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center p-2 rounded cursor-pointer hover:bg-editor-tool transition-colors",
        isSelected && "bg-editor-highlight"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "w-full aspect-[3/4] rounded overflow-hidden bg-black mb-1",
        isSelected && "ring-2 ring-blue-500"
      )}>
        <img 
          src={preview} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs text-gray-300 truncate w-full text-center">
        {name}
      </span>
    </div>
  );
};
