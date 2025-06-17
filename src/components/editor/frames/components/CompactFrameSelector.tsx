
import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Frame {
  id: string;
  name: string;
  category: string;
  premium: boolean;
  preview: string;
  description: string;
}

interface CompactFrameSelectorProps {
  frames: Frame[];
  selectedFrame: string;
  onFrameSelect: (frameId: string) => void;
  className?: string;
}

export const CompactFrameSelector: React.FC<CompactFrameSelectorProps> = ({
  frames,
  selectedFrame,
  onFrameSelect,
  className = ""
}) => {
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);

  const handleFrameSelect = (frame: Frame) => {
    onFrameSelect(frame.id);
    toast.success(`Applied ${frame.name} frame`);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-white text-sm font-medium mb-3">Choose Frame</div>
      
      <div className="grid grid-cols-3 gap-3">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className={`relative group cursor-pointer transition-all duration-200 ${
              selectedFrame === frame.id
                ? 'ring-2 ring-crd-green shadow-lg scale-105'
                : 'hover:scale-102 hover:shadow-md'
            }`}
            onClick={() => handleFrameSelect(frame)}
            onMouseEnter={() => setHoveredFrame(frame.id)}
            onMouseLeave={() => setHoveredFrame(null)}
          >
            <div 
              className="aspect-[3/4] rounded-lg border-2 border-editor-border group-hover:border-crd-green/50 transition-colors overflow-hidden"
              style={{ background: frame.preview }}
            >
              <div className="absolute inset-2 bg-black/20 rounded flex items-center justify-center">
                <div className="text-white text-xs font-bold text-center">
                  <div className="w-6 h-4 bg-white/30 rounded mb-1 mx-auto"></div>
                  <div className="w-8 h-1 bg-white/50 rounded mx-auto"></div>
                </div>
              </div>
              
              {frame.premium && (
                <div className="absolute top-1 right-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
              )}
              
              {selectedFrame === frame.id && (
                <div className="absolute top-1 left-1 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
                </div>
              )}
            </div>
            
            {/* Compact frame info */}
            <div className="mt-1 px-1">
              <p className="text-white text-xs font-medium truncate">{frame.name}</p>
              <p className="text-crd-lightGray text-xs truncate opacity-70">{frame.category}</p>
            </div>
            
            {/* Hover tooltip */}
            {hoveredFrame === frame.id && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                {frame.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
