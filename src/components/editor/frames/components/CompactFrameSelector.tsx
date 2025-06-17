
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
    <div className={`space-y-3 ${className}`}>
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
              className="aspect-[3/4] rounded-lg border-2 border-white/20 group-hover:border-crd-green/50 transition-colors overflow-hidden"
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
            
            {/* Frame info directly below preview */}
            <div className="mt-2 px-1 text-center">
              <p className="text-white text-xs font-medium truncate">{frame.name}</p>
              <p className="text-gray-400 text-xs truncate opacity-70 capitalize">{frame.category}</p>
            </div>
            
            {/* Enhanced hover tooltip */}
            {hoveredFrame === frame.id && (
              <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 pointer-events-none border border-white/20">
                <div className="font-medium">{frame.name}</div>
                <div className="text-gray-300 mt-1 max-w-32 truncate">{frame.description}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
