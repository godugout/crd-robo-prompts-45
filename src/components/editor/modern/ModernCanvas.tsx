
import React from 'react';
import { useCanvasManager } from './hooks/useCanvasManager';
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
import { CanvasContainer } from './components/CanvasContainer';

export const ModernCanvas = () => {
  const { canvasRef, fabricCanvas } = useCanvasManager();
  const { handleCanvasClick, handleDrop, handleDragOver } = useCanvasInteractions(fabricCanvas);

  return (
    <CanvasContainer
      canvasRef={canvasRef}
      onCanvasClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    />
  );
};
