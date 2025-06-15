
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

interface WhiteboardCanvasProps {
  children: React.ReactNode;
  onTransformChange?: (transform: { x: number; y: number; scale: number }) => void;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  children,
  onTransformChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Canvas boundaries
  const CANVAS_SIZE = 4000;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;
  const PAN_LIMIT = 2000;

  const updateTransform = useCallback((newTransform: typeof transform) => {
    // Apply scale limits
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newTransform.scale));
    
    // Apply pan limits
    const clampedX = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, newTransform.x));
    const clampedY = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, newTransform.y));
    
    const finalTransform = {
      x: clampedX,
      y: clampedY,
      scale: clampedScale
    };
    
    setTransform(finalTransform);
    onTransformChange?.(finalTransform);
  }, [onTransformChange]);

  const bind = useGesture({
    onDrag: ({ offset: [x, y], pinching, event }) => {
      // Check if space key is held for panning (like Figma)
      const isSpacePanning = (event as any)?.spaceKey || !pinching;
      if (isSpacePanning) {
        updateTransform({ ...transform, x, y });
      }
    },
    onPinch: ({ offset: [scale] }) => {
      updateTransform({ ...transform, scale });
    },
    onWheel: ({ delta: [, dy], ctrlKey, metaKey, event }) => {
      event?.preventDefault();
      
      if (ctrlKey || metaKey) {
        // Zoom with ctrl/cmd + wheel
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, transform.scale - dy * 0.001));
        updateTransform({ ...transform, scale: newScale });
      } else {
        // Pan with wheel
        updateTransform({
          ...transform,
          x: transform.x - dy * 0.5,
          y: transform.y - dy * 0.5
        });
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#1a1a1a] cursor-grab active:cursor-grabbing"
      {...bind()}
    >
      {/* Canvas Boundary */}
      <div 
        className="absolute border-2 border-dashed border-white/20"
        style={{
          left: '50%',
          top: '50%',
          width: CANVAS_SIZE * transform.scale,
          height: CANVAS_SIZE * transform.scale,
          transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px)`,
          transformOrigin: 'center'
        }}
      />
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)',
          backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`
        }}
      />
      
      {/* Canvas Content */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        {children}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => updateTransform({ ...transform, scale: Math.min(MAX_SCALE, transform.scale * 1.2) })}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => updateTransform({ ...transform, scale: Math.max(MIN_SCALE, transform.scale / 1.2) })}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          −
        </button>
        <button
          onClick={() => updateTransform({ x: 0, y: 0, scale: 1 })}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xs"
        >
          1:1
        </button>
      </div>

      {/* Scale Indicator */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 text-white text-sm z-50">
        {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
};
