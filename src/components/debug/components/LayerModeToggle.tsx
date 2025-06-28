
import React from 'react';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  Layers,
  Frame,
  Eye
} from 'lucide-react';

export type LayerMode = 'elements' | 'frame' | 'preview';

interface LayerModeToggleProps {
  currentMode: LayerMode;
  onModeChange: (mode: LayerMode) => void;
  layerCount: number;
}

export const LayerModeToggle: React.FC<LayerModeToggleProps> = ({
  currentMode,
  onModeChange,
  layerCount
}) => {
  const modes = [
    {
      id: 'elements' as LayerMode,
      label: 'Elements',
      icon: Layers,
      description: 'Detailed layer analysis'
    },
    {
      id: 'frame' as LayerMode,
      label: 'Frame',
      icon: Frame,
      description: 'Content vs Design separation'
    },
    {
      id: 'preview' as LayerMode,
      label: 'Preview',
      icon: Eye,
      description: 'Full card with CRD branding'
    }
  ];

  return (
    <div className="flex items-center gap-2 bg-[#1a1f2e] border border-slate-700 rounded-lg p-1">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <PSDButton
            key={mode.id}
            variant={isActive ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onModeChange(mode.id)}
            className={`
              px-3 py-2 transition-all duration-200
              ${isActive ? 'bg-crd-blue text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}
            `}
          >
            <Icon className="w-4 h-4 mr-2" />
            {mode.label}
            {mode.id === 'elements' && (
              <Badge variant="outline" className="ml-2 text-xs bg-slate-800 border-slate-600">
                {layerCount}
              </Badge>
            )}
          </PSDButton>
        );
      })}
    </div>
  );
};
