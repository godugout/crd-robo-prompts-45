
import React from 'react';
import { 
  MousePointer, PenTool, Plus, Square, Circle, Type, 
  Image, Grid3x3, ZoomIn, ZoomOut, Undo, Redo, Layers,
  Copy, Trash2, AlignLeft, AlignCenter, AlignRight, Move
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {
  onZoomChange: (zoom: number) => void;
  currentZoom: number;
}

export const Toolbar = ({ onZoomChange, currentZoom }: ToolbarProps) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(currentZoom + 10, 200));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(currentZoom - 10, 50));
  };

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center">
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={<MousePointer size={18} />} tooltip="Select" active />
          <ToolbarButton icon={<Move size={18} />} tooltip="Move" />
          <ToolbarButton icon={<PenTool size={18} />} tooltip="Pen" />
        </div>
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={<Plus size={18} />} tooltip="Add Element" />
          <ToolbarButton icon={<Square size={18} />} tooltip="Rectangle" />
          <ToolbarButton icon={<Circle size={18} />} tooltip="Circle" />
          <ToolbarButton icon={<Type size={18} />} tooltip="Text" />
          <ToolbarButton icon={<Image size={18} />} tooltip="Image" />
        </div>
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={<AlignLeft size={18} />} tooltip="Align Left" />
          <ToolbarButton icon={<AlignCenter size={18} />} tooltip="Align Center" />
          <ToolbarButton icon={<AlignRight size={18} />} tooltip="Align Right" />
        </div>
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={<Copy size={18} />} tooltip="Duplicate" />
          <ToolbarButton icon={<Trash2 size={18} />} tooltip="Delete" />
          <ToolbarButton icon={<Layers size={18} />} tooltip="Layers" />
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <ToolbarButton icon={<Undo size={18} />} tooltip="Undo" />
        <ToolbarButton icon={<Redo size={18} />} tooltip="Redo" />
        
        <Separator orientation="vertical" className="mx-2 h-6 bg-editor-border" />
        
        <ToolbarButton icon={<Grid3x3 size={18} />} tooltip="Toggle Grid" />
        <ToolbarButton icon={<ZoomOut size={18} />} tooltip="Zoom Out" onClick={handleZoomOut} />
        <div className="text-white text-sm px-2 bg-editor-tool rounded mx-1 h-7 flex items-center">
          {currentZoom}%
        </div>
        <ToolbarButton icon={<ZoomIn size={18} />} tooltip="Zoom In" onClick={handleZoomIn} />
      </div>
    </div>
  );
};
