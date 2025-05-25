import React from 'react';
import { Brush, Type, Square, Circle, Image, Eraser } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Canvas as FabricCanvas, Circle as FabricCircle, Rect, FabricText } from 'fabric';
import { toast } from 'sonner';

interface CanvasDrawingToolsProps {
  fabricCanvas: FabricCanvas | null;
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const CanvasDrawingTools = ({ 
  fabricCanvas, 
  activeTool, 
  onToolChange 
}: CanvasDrawingToolsProps) => {
  const handleToolSelect = (tool: string) => {
    if (!fabricCanvas) return;
    
    onToolChange(tool);
    
    // Configure canvas based on tool
    switch (tool) {
      case 'draw':
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.width = 2;
        fabricCanvas.freeDrawingBrush.color = '#000000';
        break;
      case 'erase':
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.width = 10;
        fabricCanvas.freeDrawingBrush.color = '#ffffff';
        break;
      case 'select':
        fabricCanvas.isDrawingMode = false;
        break;
      case 'text':
        fabricCanvas.isDrawingMode = false;
        addText();
        break;
      case 'rectangle':
        fabricCanvas.isDrawingMode = false;
        addRectangle();
        break;
      case 'circle':
        fabricCanvas.isDrawingMode = false;
        addCircle();
        break;
      default:
        fabricCanvas.isDrawingMode = false;
    }
    
    toast.success(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`);
  };

  const addText = () => {
    if (!fabricCanvas) return;
    
    const text = new FabricText('Edit this text', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
      fontFamily: 'Arial',
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  const addRectangle = () => {
    if (!fabricCanvas) return;
    
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 80,
      fill: 'rgba(0,0,255,0.3)',
      stroke: '#0000ff',
      strokeWidth: 2,
    });
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      radius: 50,
      fill: 'rgba(255,0,0,0.3)',
      stroke: '#ff0000',
      strokeWidth: 2,
    });
    
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
  };

  const tools = [
    { id: 'select', icon: <span className="text-xs">↖</span>, label: 'Select' },
    { id: 'draw', icon: <Brush size={16} />, label: 'Draw' },
    { id: 'erase', icon: <Eraser size={16} />, label: 'Erase' },
    { id: 'text', icon: <Type size={16} />, label: 'Text' },
    { id: 'rectangle', icon: <Square size={16} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={16} />, label: 'Circle' },
  ];

  return (
    <div className="flex gap-1 p-2 bg-editor-darker rounded-lg border border-editor-border">
      {tools.map((tool) => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <CRDButton
              variant={activeTool === tool.id ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleToolSelect(tool.id)}
              className="w-8 h-8 p-0"
            >
              {tool.icon}
            </CRDButton>
          </TooltipTrigger>
          <TooltipContent>{tool.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
