
import React, { useState, useCallback, useRef } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZoomableCardDetailProps {
  imageSrc: string;
  alt: string;
  isVisible: boolean;
}

export const ZoomableCardDetail: React.FC<ZoomableCardDetailProps> = ({
  imageSrc,
  alt,
  isVisible
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(1, Math.min(5, prev + delta)));
  }, []);
  
  const handleReset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - startPosition.x;
      const newY = e.clientY - startPosition.y;
      
      // Calculate boundaries to prevent dragging beyond image edges
      const containerWidth = containerRef.current?.clientWidth || 0;
      const containerHeight = containerRef.current?.clientHeight || 0;
      const maxX = (zoom - 1) * containerWidth / 2;
      const maxY = (zoom - 1) * containerHeight / 2;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    }
  }, [isDragging, startPosition, zoom]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add wheel event for zooming with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setZoom(prev => Math.max(1, Math.min(5, prev + delta)));
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div className="absolute left-4 bottom-4 flex space-x-2 z-10 bg-black/40 p-2 rounded backdrop-blur">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoom(0.5)}
          className="bg-white/20 hover:bg-white/30"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleZoom(-0.5)}
          className="bg-white/20 hover:bg-white/30"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="bg-white/20 hover:bg-white/30"
        >
          <Move className="w-4 h-4 text-white" />
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute top-4 right-4 z-10 bg-black/40 px-2 py-1 rounded backdrop-blur">
          <span className="text-white text-xs">{Math.round(zoom * 100)}%</span>
        </div>
        <img
          src={imageSrc}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-opacity duration-300"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: 'center',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};
