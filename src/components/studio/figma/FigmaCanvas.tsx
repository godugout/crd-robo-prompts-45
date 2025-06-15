import React, { useRef, useState, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

interface FigmaCanvasProps {
  children: React.ReactNode;
}

export const FigmaCanvas: React.FC<FigmaCanvasProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [spacePressed, setSpacePressed] = useState(false);

  // Canvas limits
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;
  const PAN_LIMIT = 5000;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateTransform = useCallback((newTransform: typeof transform) => {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newTransform.scale));
    const clampedX = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, newTransform.x));
    const clampedY = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, newTransform.y));
    
    setTransform({
      x: clampedX,
      y: clampedY,
      scale: clampedScale
    });
  }, []);

  useGesture({
    onDrag: ({ offset: [x, y], pinching }) => {
      if (spacePressed && !pinching) {
        updateTransform({ ...transform, x, y });
      }
    },
    onWheel: ({ delta: [, dy], ctrlKey, metaKey, event }) => {
      event?.preventDefault();
      
      if (ctrlKey || metaKey) {
        // Zoom at cursor position
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, transform.scale - dy * 0.001));
        updateTransform({ ...transform, scale: newScale });
      } else {
        // Pan with mouse wheel
        updateTransform({
          ...transform,
          x: transform.x - dy * 0.5,
          y: transform.y - dy * 0.5
        });
      }
    }
  }, { target: containerRef });

  return (
    <div
      ref={containerRef}
      className={`flex-1 bg-[#1a1a1a] relative overflow-hidden ${
        spacePressed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Canvas Boundary - Visible working area */}
      <div 
        className="absolute border-2 border-dashed border-white/10"
        style={{
          left: '50%',
          top: '50%',
          width: 3000 * transform.scale,
          height: 2000 * transform.scale,
          transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px)`,
        }}
      />
      
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #404040 1px, transparent 1px)',
          backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`,
        }}
      />

      {/* Rulers */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-[#2c2c2c] border-b border-[#3c3c3c] flex items-center">
        <div className="ml-6 text-white/50 text-xs font-mono">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="inline-block w-10 text-center">
              {i * 100}
            </span>
          ))}
        </div>
      </div>
      
      <div className="absolute top-6 left-0 bottom-0 w-6 bg-[#2c2c2c] border-r border-[#3c3c3c]">
        <div className="h-full flex flex-col items-center justify-start pt-4">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="h-10 text-white/50 text-xs font-mono writing-mode-vertical">
              {i * 100}
            </div>
          ))}
        </div>
      </div>
      
      {/* Canvas Content */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center'
        }}
      >
        {children}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
        <button
          onClick={() => updateTransform({ ...transform, scale: Math.min(MAX_SCALE, transform.scale * 1.2) })}
          className="w-8 h-8 bg-[#2c2c2c] border border-[#3c3c3c] rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-[#3c3c3c] transition-colors"
        >
          +
        </button>
        <button
          onClick={() => updateTransform({ ...transform, scale: Math.max(MIN_SCALE, transform.scale / 1.2) })}
          className="w-8 h-8 bg-[#2c2c2c] border border-[#3c3c3c] rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-[#3c3c3c] transition-colors"
        >
          −
        </button>
        <button
          onClick={() => updateTransform({ x: 0, y: 0, scale: 1 })}
          className="w-8 h-8 bg-[#2c2c2c] border border-[#3c3c3c] rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-[#3c3c3c] transition-colors text-xs"
        >
          1:1
        </button>
      </div>

      {/* Scale Indicator */}
      <div className="absolute bottom-6 left-6 bg-[#2c2c2c] border border-[#3c3c3c] rounded px-3 py-1 text-white/70 text-sm z-50">
        {Math.round(transform.scale * 100)}%
      </div>

      {/* Space Bar Hint */}
      {!spacePressed && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white/70 px-3 py-1 rounded text-sm pointer-events-none">
          Hold <kbd className="bg-white/20 px-1 rounded">Space</kbd> + drag to pan
        </div>
      )}
    </div>
  );
};
