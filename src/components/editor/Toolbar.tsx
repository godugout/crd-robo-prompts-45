
import React, { useState } from 'react';
import { 
  MousePointer, PenTool, Plus, Square, Circle, Type, 
  Image, Grid3x3, ZoomIn, ZoomOut, Undo, Redo, Layers,
  Copy, Trash2, AlignLeft, AlignCenter, AlignRight, Move,
  Sparkles, Star, Eye, EyeOff, Palette, Pencil
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ToolbarProps {
  onZoomChange: (zoom: number) => void;
  currentZoom: number;
}

export const Toolbar = ({ onZoomChange, currentZoom }: ToolbarProps) => {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [undoStack, setUndoStack] = useState<number>(3);
  const [redoStack, setRedoStack] = useState<number>(0);
  const [showEffects, setShowEffects] = useState<boolean>(false);
  const [isMagicBrush, setIsMagicBrush] = useState<boolean>(false);
  
  const handleZoomIn = () => {
    onZoomChange(Math.min(currentZoom + 10, 200));
    toast(`Zoomed in to ${Math.min(currentZoom + 10, 200)}%`);
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(currentZoom - 10, 50));
    toast(`Zoomed out to ${Math.max(currentZoom - 10, 50)}%`);
  };
  
  const handleToolSelect = (tool: string) => {
    setActiveTool(tool);
    toast(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`);
  };
  
  const handleUndo = () => {
    if (undoStack > 0) {
      setUndoStack(undoStack - 1);
      setRedoStack(redoStack + 1);
      toast('Undo: Reverted last change');
    } else {
      toast('Nothing to undo', {
        description: 'You are at the beginning of your edit history'
      });
    }
  };
  
  const handleRedo = () => {
    if (redoStack > 0) {
      setRedoStack(redoStack - 1);
      setUndoStack(undoStack + 1);
      toast('Redo: Restored last change');
    } else {
      toast('Nothing to redo', {
        description: 'You are at the latest edit'
      });
    }
  };
  
  const toggleEffects = () => {
    setShowEffects(!showEffects);
    if (!showEffects) {
      toast('Special effects enabled', {
        description: 'Card will display particle effects'
      });
    } else {
      toast('Special effects disabled');
    }
  };
  
  const toggleMagicBrush = () => {
    setIsMagicBrush(!isMagicBrush);
    toast(isMagicBrush ? 'Standard brush selected' : 'Magic brush selected', {
      description: isMagicBrush ? undefined : 'Creates sparkle effects as you draw'
    });
  };

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center">
        <div className="flex items-center space-x-1">
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
            <div className={`h-2 w-2 rounded-full ${isMagicBrush ? 'bg-cardshow-orange' : 'bg-gray-500'}`}></div>
          </Button>
        </div>
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
        <div className="flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-1.5 text-gray-400 hover:text-white">
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
            onClick={() => handleToolSelect('rectangle')}
          />
          <ToolbarButton 
            icon={<Circle size={18} />} 
            tooltip="Circle" 
            active={activeTool === 'circle'} 
            onClick={() => handleToolSelect('circle')}
          />
          <ToolbarButton 
            icon={<Type size={18} />} 
            tooltip="Text" 
            active={activeTool === 'text'} 
            onClick={() => handleToolSelect('text')}
          />
          <ToolbarButton 
            icon={<Image size={18} />} 
            tooltip="Image" 
            active={activeTool === 'image'} 
            onClick={() => handleToolSelect('image')}
          />
          <ToolbarButton 
            icon={<Sparkles size={18} />} 
            tooltip="Effects" 
            active={showEffects} 
            onClick={toggleEffects}
          />
        </div>
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
        <div className="flex items-center space-x-1">
          <ToolbarButton 
            icon={<AlignLeft size={18} />} 
            tooltip="Align Left" 
            onClick={() => toast('Aligned to left')}
          />
          <ToolbarButton 
            icon={<AlignCenter size={18} />} 
            tooltip="Align Center" 
            onClick={() => toast('Aligned to center')}
          />
          <ToolbarButton 
            icon={<AlignRight size={18} />} 
            tooltip="Align Right" 
            onClick={() => toast('Aligned to right')}
          />
        </div>
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
        <div className="flex items-center space-x-1">
          <ToolbarButton 
            icon={<Copy size={18} />} 
            tooltip="Duplicate" 
            onClick={() => toast('Element duplicated')}
          />
          <ToolbarButton 
            icon={<Trash2 size={18} />} 
            tooltip="Delete" 
            onClick={() => toast('Element deleted')}
          />
          <ToolbarButton 
            icon={<Layers size={18} />} 
            tooltip="Layers" 
            badge={4}
            onClick={() => toast('Showing layers panel')}
          />
          <ToolbarButton 
            icon={showEffects ? <EyeOff size={18} /> : <Eye size={18} />} 
            tooltip={showEffects ? "Hide Effects" : "Show Effects"} 
            onClick={toggleEffects}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <ToolbarButton 
          icon={<Undo size={18} />} 
          tooltip="Undo" 
          onClick={handleUndo}
          disabled={undoStack === 0}
          badge={undoStack > 0 ? undoStack : undefined}
        />
        <ToolbarButton 
          icon={<Redo size={18} />} 
          tooltip="Redo" 
          onClick={handleRedo}
          disabled={redoStack === 0}
          badge={redoStack > 0 ? redoStack : undefined}
        />
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
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
        <div className="text-white text-sm px-2 bg-editor-tool rounded mx-1 h-7 flex items-center">
          {currentZoom}%
        </div>
        <ToolbarButton 
          icon={<ZoomIn size={18} />} 
          tooltip="Zoom In" 
          onClick={handleZoomIn}
          disabled={currentZoom >= 200}
        />
      </div>
    </div>
  );
};
