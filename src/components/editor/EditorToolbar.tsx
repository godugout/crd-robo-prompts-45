
import React, { useState } from 'react';
import { 
  MousePointer, 
  PenTool, 
  Square, 
  Circle, 
  Type, 
  Image, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut,
  Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface EditorToolbarProps {
  onZoomChange: (zoom: number) => void;
  currentZoom: number;
}

export const EditorToolbar = ({ onZoomChange, currentZoom }: EditorToolbarProps) => {
  const [activeTool, setActiveTool] = useState<string>('select');

  const handleToolSelect = (tool: string) => {
    setActiveTool(tool);
    toast.success(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(currentZoom + 10, 200);
    onZoomChange(newZoom);
    toast.success(`Zoomed in to ${newZoom}%`);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(currentZoom - 10, 50);
    onZoomChange(newZoom);
    toast.success(`Zoomed out to ${newZoom}%`);
  };

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center space-x-2">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('select')}
        >
          <MousePointer className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === 'move' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('move')}
        >
          <Move className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === 'pen' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('pen')}
        >
          <PenTool className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant={activeTool === 'rectangle' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('rectangle')}
        >
          <Square className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === 'circle' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('circle')}
        >
          <Circle className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('text')}
        >
          <Type className="w-4 h-4" />
        </Button>
        
        <Button
          variant={activeTool === 'image' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleToolSelect('image')}
        >
          <Image className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => toast('Undo')}>
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => toast('Redo')}>
          <Redo className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={currentZoom <= 50}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <span className="text-white text-sm px-2 bg-editor-tool rounded h-7 flex items-center">
          {currentZoom}%
        </span>
        
        <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={currentZoom >= 200}>
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
