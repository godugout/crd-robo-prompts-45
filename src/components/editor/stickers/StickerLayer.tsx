
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Move, Trash2, Copy } from 'lucide-react';

interface StickerData {
  id: string;
  type: 'emoji' | 'icon' | 'shape';
  content: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color?: string;
}

interface StickerLayerProps {
  sticker: StickerData;
  isSelected: boolean;
  onUpdate: (sticker: StickerData) => void;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const StickerLayer: React.FC<StickerLayerProps> = ({
  sticker,
  isSelected,
  onUpdate,
  onSelect,
  onDelete,
  onDuplicate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - sticker.x,
      y: e.clientY - sticker.y
    });
    onSelect();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    onUpdate({
      ...sticker,
      x: Math.max(0, Math.min(300 - 40, newX)),
      y: Math.max(0, Math.min(420 - 40, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    onUpdate({
      ...sticker,
      rotation: (sticker.rotation + 15) % 360
    });
  };

  const handleScale = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(2, sticker.scale + delta));
    onUpdate({
      ...sticker,
      scale: newScale
    });
  };

  return (
    <div className="relative">
      <div
        ref={stickerRef}
        className={`absolute cursor-move select-none transition-all ${
          isSelected ? 'ring-2 ring-crd-green' : ''
        } ${isDragging ? 'z-50' : 'z-10'}`}
        style={{
          left: sticker.x,
          top: sticker.y,
          transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
          transformOrigin: 'center'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={onSelect}
      >
        <div className="w-10 h-10 flex items-center justify-center text-2xl bg-transparent hover:bg-black/10 rounded transition-colors">
          {sticker.content}
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-black/50 border-white/20 hover:bg-black/70"
            onClick={handleRotate}
          >
            <RotateCw className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-black/50 border-white/20 hover:bg-black/70"
            onClick={onDuplicate}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-black/50 border-red-500/50 hover:bg-red-500/20"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}

      {isSelected && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs bg-black/50 border-white/20 hover:bg-black/70"
            onClick={() => handleScale(-0.1)}
          >
            -
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs bg-black/50 border-white/20 hover:bg-black/70"
            onClick={() => handleScale(0.1)}
          >
            +
          </Button>
        </div>
      )}
    </div>
  );
};
