
import React from 'react';
import { Copy, Trash2, Layers, Eye, EyeOff } from 'lucide-react';
import { ToolbarButton } from '@/components/editor/ToolbarButton';
import { toast } from 'sonner';

interface ToolbarElementControlsProps {
  showEffects: boolean;
  toggleEffects: () => void;
}

export const ToolbarElementControls = ({ showEffects, toggleEffects }: ToolbarElementControlsProps) => {
  return (
    <>
      <ToolbarButton 
        icon={<Copy size={18} />} 
        tooltip="Duplicate" 
        onClick={() => toast('Element duplicated')}
      />
      <ToolbarButton 
        icon={<Trash2 size={18} />} 
        tooltip="Delete" 
        onClick={() => toast('Element deleted')}
      />
      <ToolbarButton 
        icon={<Layers size={18} />} 
        tooltip="Layers" 
        badge={4}
        onClick={() => toast('Showing layers panel')}
      />
      <ToolbarButton 
        icon={showEffects ? <EyeOff size={18} /> : <Eye size={18} />} 
        tooltip={showEffects ? "Hide Effects" : "Show Effects"} 
        onClick={toggleEffects}
      />
    </>
  );
};
