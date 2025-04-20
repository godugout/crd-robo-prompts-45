
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ToolbarButton } from '@/components/editor/ToolbarButton';
import { toast } from 'sonner';

export const ToolbarAlignControls = () => {
  return (
    <>
      <ToolbarButton 
        icon={<AlignLeft size={18} />} 
        tooltip="Align Left" 
        onClick={() => toast('Aligned to left')}
      />
      <ToolbarButton 
        icon={<AlignCenter size={18} />} 
        tooltip="Align Center" 
        onClick={() => toast('Aligned to center')}
      />
      <ToolbarButton 
        icon={<AlignRight size={18} />} 
        tooltip="Align Right" 
        onClick={() => toast('Aligned to right')}
      />
    </>
  );
};
