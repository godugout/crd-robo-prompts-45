
import React, { useRef } from 'react';
import { useModernEditor } from '../context/ModernEditorContext';

interface CanvasContainerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCanvasClick: (e: any) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const CanvasContainer = ({ 
  canvasRef, 
  onCanvasClick, 
  onDrop, 
  onDragOver 
}: CanvasContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, showGrid } = useModernEditor();

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center'
        }}
      >
        <div className="relative bg-white rounded-lg shadow-lg">
          {/* Grid Background */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ddd 1px, transparent 1px),
                  linear-gradient(to bottom, #ddd 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          )}
          
          <canvas
            ref={canvasRef}
            onClick={onCanvasClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-lg text-sm text-gray-600">
        {zoom}%
      </div>
    </div>
  );
};
