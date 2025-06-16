
import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyGridSlotProps {
  position: number;
  onDrop: (cardId: string) => void;
}

export const EmptyGridSlot: React.FC<EmptyGridSlotProps> = ({ position }) => {
  return (
    <div className="w-full h-full border-2 border-dashed border-[#4a4a4a] rounded-lg flex flex-col items-center justify-center text-crd-lightGray hover:border-crd-green/50 hover:bg-crd-green/5 transition-colors cursor-pointer group">
      <div className="absolute top-2 left-2 w-6 h-6 bg-[#2c2c54] border border-[#4a4a4a] rounded-full flex items-center justify-center text-white text-xs font-bold">
        {position + 1}
      </div>
      
      <Plus className="w-8 h-8 mb-2 group-hover:text-crd-green transition-colors" />
      <span className="text-sm text-center group-hover:text-crd-green transition-colors">
        Empty Slot
      </span>
    </div>
  );
};
