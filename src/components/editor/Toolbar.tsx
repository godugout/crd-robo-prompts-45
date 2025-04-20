
import React from 'react';
import { 
  MousePointer, PenTool, Plus, Square, Circle, Type, 
  Image, Grid3x3, ZoomIn, ZoomOut, Undo, Redo, Layers 
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';

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
    <div className="flex items-center justify-between h-12 px-2 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center space-x-1">
        <ToolbarButton icon={<MousePointer />} tooltip="Select" active />
        <ToolbarButton icon={<PenTool />} tooltip="Pen" />
        <ToolbarButton icon={<Plus />} tooltip="Add Element" />
        <ToolbarButton icon={<Square />} tooltip="Rectangle" />
        <ToolbarButton icon={<Circle />} tooltip="Circle" />
        <ToolbarButton icon={<Type />} tooltip="Text" />
        <ToolbarButton icon={<Image />} tooltip="Image" />
        <ToolbarButton icon={<Layers />} tooltip="Layers" />
      </div>
      <div className="flex items-center space-x-1">
        <ToolbarButton icon={<Undo />} tooltip="Undo" />
        <ToolbarButton icon={<Redo />} tooltip="Redo" />
        <ToolbarButton icon={<Grid3x3 />} tooltip="Toggle Grid" />
        <ToolbarButton icon={<ZoomOut />} tooltip="Zoom Out" onClick={handleZoomOut} />
        <div className="text-white text-sm px-2">
          {currentZoom}%
        </div>
        <ToolbarButton icon={<ZoomIn />} tooltip="Zoom In" onClick={handleZoomIn} />
      </div>
    </div>
  );
};
