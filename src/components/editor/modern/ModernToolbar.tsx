
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MousePointer, 
  Square, 
  Circle, 
  Type, 
  Image, 
  PenTool,
  Move,
  ZoomIn,
  ZoomOut,
  Grid3x3
} from 'lucide-react';
import { useModernEditor } from './context/ModernEditorContext';
import { Separator } from '@/components/ui/separator';

export const ModernToolbar = () => {
  const { selectedTool, setSelectedTool, zoom, setZoom, showGrid, setShowGrid } = useModernEditor();

  const tools = [
    { id: 'select', icon: MousePointer, name: 'Select' },
    { id: 'move', icon: Move, name: 'Move' },
    { id: 'pen', icon: PenTool, name: 'Pen' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'image', icon: Image, name: 'Image' },
  ];

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 400));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 25));

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTool(tool.id)}
            className="h-8 w-8 p-0"
            title={tool.name}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={showGrid ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className="h-8 w-8 p-0"
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 25}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <span className="text-sm text-gray-600 min-w-[50px] text-center">
          {zoom}%
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 400}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
