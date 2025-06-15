
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

  const updateTransform = useCallback((newTransform: typeof transform) => {
    setTransform(newTransform);
    onTransformChange?.(newTransform);
  }, [onTransformChange]);

  const bind = useGesture({
    onDrag: ({ offset: [x, y], pinching }) => {
      if (!pinching) {
        updateTransform({ ...transform, x, y });
      }
    },
    onPinch: ({ offset: [scale] }) => {
      const newScale = Math.max(0.1, Math.min(3, scale));
      updateTransform({ ...transform, scale: newScale });
    },
    onWheel: ({ delta: [, dy], ctrlKey, metaKey }) => {
      if (ctrlKey || metaKey) {
        // Zoom with ctrl/cmd + wheel
        const newScale = Math.max(0.1, Math.min(3, transform.scale - dy * 0.001));
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
      {/* Graph Paper Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)',
          backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`,
          transform: `scale(${transform.scale})`
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
          onClick={() => updateTransform({ ...transform, scale: Math.min(3, transform.scale * 1.2) })}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => updateTransform({ ...transform, scale: Math.max(0.1, transform.scale / 1.2) })}
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
