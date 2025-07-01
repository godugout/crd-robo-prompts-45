
import React from 'react';

interface CanvasDragAreaProps {
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

export const CanvasDragArea = ({
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  children
}: CanvasDragAreaProps) => {
  return (
    <div 
      className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};
