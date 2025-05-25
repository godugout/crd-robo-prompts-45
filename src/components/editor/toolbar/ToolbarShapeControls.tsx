
import React from 'react';
import { Square, Circle, Type, Image, Star, Plus } from 'lucide-react';
import { ToolbarButton } from '@/components/editor/ToolbarButton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ToolbarShapeControlsProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
}

export const ToolbarShapeControls = ({ activeTool, onToolSelect }: ToolbarShapeControlsProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 p-1.5 text-gray-400 hover:text-white"
          >
            <Plus size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-editor-dark border-editor-border">
          <DropdownMenuItem className="text-white hover:bg-editor-tool cursor-pointer" onClick={() => toast('Rectangle added')}>
            <Square size={16} className="mr-2" />
            Rectangle
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-editor-tool cursor-pointer" onClick={() => toast('Circle added')}>
            <Circle size={16} className="mr-2" />
            Circle
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-editor-tool cursor-pointer" onClick={() => toast('Text added')}>
            <Type size={16} className="mr-2" />
            Text
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-editor-tool cursor-pointer" onClick={() => toast('Image placeholder added')}>
            <Image size={16} className="mr-2" />
            Image
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-editor-tool cursor-pointer" onClick={() => toast('Sticker added')}>
            <Star size={16} className="mr-2" />
            Sticker
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarButton 
        icon={<Square size={18} />} 
        tooltip="Rectangle" 
        active={activeTool === 'rectangle'} 
        onClick={() => onToolSelect('rectangle')}
      />
      <ToolbarButton 
        icon={<Circle size={18} />} 
        tooltip="Circle" 
        active={activeTool === 'circle'} 
        onClick={() => onToolSelect('circle')}
      />
      <ToolbarButton 
        icon={<Type size={18} />} 
        tooltip="Text" 
        active={activeTool === 'text'} 
        onClick={() => onToolSelect('text')}
      />
      <ToolbarButton 
        icon={<Image size={18} />} 
        tooltip="Image" 
        active={activeTool === 'image'} 
        onClick={() => onToolSelect('image')}
      />
    </>
  );
};
