
import React, { useState } from 'react';
import { Undo, Redo } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { toast } from 'sonner';
import { ToolbarSection, ToolbarDivider } from './toolbar/ToolbarSection';
import { ToolbarDrawingControls } from './toolbar/ToolbarDrawingControls';
import { ToolbarShapeControls } from './toolbar/ToolbarShapeControls';
import { ToolbarAlignControls } from './toolbar/ToolbarAlignControls';
import { ToolbarElementControls } from './toolbar/ToolbarElementControls';
import { ToolbarZoomControls } from './toolbar/ToolbarZoomControls';

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
        <ToolbarSection>
          <ToolbarDrawingControls 
            activeTool={activeTool}
            isMagicBrush={isMagicBrush}
            showEffects={showEffects}
            handleToolSelect={handleToolSelect}
            toggleMagicBrush={toggleMagicBrush}
            toggleEffects={toggleEffects}
          />
        </ToolbarSection>
        
        <ToolbarDivider />
        
        <ToolbarSection>
          <ToolbarShapeControls
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
          />
        </ToolbarSection>
        
        <ToolbarDivider />
        
        <ToolbarSection>
          <ToolbarAlignControls />
        </ToolbarSection>
        
        <ToolbarDivider />
        
        <ToolbarSection>
          <ToolbarElementControls
            showEffects={showEffects}
            toggleEffects={toggleEffects}
          />
        </ToolbarSection>
      </div>
      
      <ToolbarSection>
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
        
        <ToolbarDivider />
        
        <ToolbarZoomControls
          currentZoom={currentZoom}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
        />
      </ToolbarSection>
    </div>
  );
};
