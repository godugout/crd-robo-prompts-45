
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MousePointer, 
  Hand, 
  Square, 
  Circle, 
  Type, 
  Image, 
  Layers, 
  Palette,
  Settings,
  Share2,
  Download,
  Undo,
  Redo,
  Grid3X3,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface FigmaToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  onToggleBottomPanel: () => void;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
}

export const FigmaToolbar: React.FC<FigmaToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onToggleLeftPanel,
  onToggleRightPanel,
  onToggleBottomPanel,
  leftPanelOpen,
  rightPanelOpen,
  bottomPanelOpen
}) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Hand' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse' },
    { id: 'text', icon: Type, label: 'Text' }
  ];

  return (
    <div className="h-12 bg-[#2c2c2c] border-b border-[#3c3c3c] flex items-center justify-between px-4">
      {/* Left Section - Logo and File Operations */}
      <div className="flex items-center gap-3">
        <div className="text-white font-semibold text-sm">CRD Studio</div>
        <div className="w-px h-6 bg-[#3c3c3c]" />
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Center Section - Tools */}
      <div className="flex items-center gap-1 bg-[#1e1e1e] rounded-lg p-1">
        {tools.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onToolSelect(id)}
            className={`text-white/70 hover:text-white hover:bg-white/10 ${
              selectedTool === id ? 'bg-white/10 text-white' : ''
            }`}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Right Section - View Controls and Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLeftPanel}
          className={`text-white/70 hover:text-white hover:bg-white/10 ${
            leftPanelOpen ? 'bg-white/10 text-white' : ''
          }`}
        >
          <Palette className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBottomPanel}
          className={`text-white/70 hover:text-white hover:bg-white/10 ${
            bottomPanelOpen ? 'bg-white/10 text-white' : ''
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleRightPanel}
          className={`text-white/70 hover:text-white hover:bg-white/10 ${
            rightPanelOpen ? 'bg-white/10 text-white' : ''
          }`}
        >
          <Layers className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-[#3c3c3c]" />
        
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
