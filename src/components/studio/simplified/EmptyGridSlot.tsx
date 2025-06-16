
import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyGridSlotProps {
  position: number;
  onDrop: (cardId: string) => void;
}

export const EmptyGridSlot: React.FC<EmptyGridSlotProps> = ({ position }) => {
  return (
    <div className="w-full h-full relative group cursor-pointer transition-all duration-300">
      {/* Grid Position Number */}
      <div className="absolute -top-3 -left-3 w-7 h-7 bg-[#2c2c54] border-2 border-[#4a4a4a] rounded-full flex items-center justify-center text-white text-xs font-bold z-10 transition-all duration-200 group-hover:border-crd-green/50">
        {position + 1}
      </div>
      
      {/* Empty Slot Container */}
      <div className="w-full h-full border-2 border-dashed border-[#4a4a4a] rounded-xl bg-[#1a1a1d]/20 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 group-hover:border-crd-green/50 group-hover:bg-crd-green/5">
        {/* Plus Icon */}
        <div className="w-12 h-12 rounded-full bg-[#27272a] border border-[#4a4a4a] flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-crd-green/20 group-hover:border-crd-green/50">
          <Plus className="w-6 h-6 text-[#71717a] transition-colors duration-300 group-hover:text-crd-green" />
        </div>
        
        {/* Text Content */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-[#a1a1aa] transition-colors duration-300 group-hover:text-white">
            Empty Slot
          </p>
          <p className="text-xs text-[#71717a] transition-colors duration-300 group-hover:text-crd-green/80">
            Click "Add Card" to create
          </p>
        </div>
      </div>
    </div>
  );
};
