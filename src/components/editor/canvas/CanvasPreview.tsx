
import React from 'react';

interface CanvasPreviewProps {
  cardRef: React.RefObject<HTMLDivElement>;
  scale: number;
  rotation: number;
  brightness: number;
  contrast: number;
  cardPos: { x: number; y: number };
  showGrid: boolean;
  showEffects: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
  description: string;
}

export const CanvasPreview = ({
  cardRef,
  scale,
  rotation,
  brightness,
  contrast,
  cardPos,
  showGrid,
  showEffects,
  onMouseDown,
  title,
  description
}: CanvasPreviewProps) => {
  return (
    <div 
      ref={cardRef}
      className="relative bg-editor-canvas rounded-xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        width: 320,
        height: 420,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease-in-out',
        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
        position: 'relative',
        left: `${cardPos.x}px`,
        top: `${cardPos.y}px`
      }}
      onMouseDown={onMouseDown}
    >
      <img 
        src="public/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png" 
        alt="Card preview" 
        className="w-full h-full object-cover"
      />
      
      {showGrid && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0',
            backgroundBlendMode: 'normal',
          }}
        />
      )}
      
      {showEffects && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 backdrop-blur-sm">
        <h3 className="text-white text-xl font-bold">{title}</h3>
        <p className="text-gray-200 text-sm mt-1 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};
