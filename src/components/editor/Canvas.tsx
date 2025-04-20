
import React from 'react';

interface CanvasProps {
  zoom: number;
}

export const Canvas = ({ zoom }: CanvasProps) => {
  const scale = zoom / 100;
  
  return (
    <div className="flex-1 bg-editor-darker overflow-auto flex items-center justify-center p-8">
      <div 
        className="relative bg-editor-canvas rounded shadow-lg"
        style={{
          width: 600,
          height: 800,
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease-in-out'
        }}
      >
        {/* Grid overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 0',
            backgroundBlendMode: 'normal',
          }}
        />
      </div>
    </div>
  );
};
