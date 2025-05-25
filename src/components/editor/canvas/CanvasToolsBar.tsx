
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3x3, Share, RotateCw, Sparkles, Trash2, Copy } from 'lucide-react';

interface CanvasToolsBarProps {
  showGrid: boolean;
  showEffects: boolean;
  selectedElement: any;
  onToggleGrid: () => void;
  onToggleEffects: () => void;
  onRotate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export const CanvasToolsBar = ({
  showGrid,
  showEffects,
  selectedElement,
  onToggleGrid,
  onToggleEffects,
  onRotate,
  onDuplicate,
  onDelete,
  onShare
}: CanvasToolsBarProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-crd-lightGray hover:text-white rounded-lg ${showGrid ? "text-crd-green" : ""}`}
        onClick={onToggleGrid}
        title="Toggle Grid"
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-crd-lightGray hover:text-white rounded-lg ${showEffects ? "text-crd-orange" : ""}`}
        onClick={onToggleEffects}
        title="Toggle Effects"
      >
        <Sparkles className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-crd-lightGray hover:text-white rounded-lg"
        onClick={onRotate}
        disabled={!selectedElement}
        title="Rotate Selected"
      >
        <RotateCw className="w-4 h-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="text-crd-lightGray hover:text-white rounded-lg"
        onClick={onDuplicate}
        disabled={!selectedElement}
        title="Duplicate Selected"
      >
        <Copy className="w-4 h-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="text-crd-lightGray hover:text-red-400 rounded-lg"
        onClick={onDelete}
        disabled={!selectedElement}
        title="Delete Selected"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-crd-lightGray hover:text-white rounded-lg"
        onClick={onShare}
        title="Export Card"
      >
        <Share className="w-4 h-4" />
      </Button>
    </div>
  );
};
