
import React from 'react';
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
      description: 'Layer analysis'
    },
    {
      id: 'frame' as LayerMode,
      label: 'Frame',
      icon: Frame,
      description: 'Content vs Design'
    },
    {
      id: 'preview' as LayerMode,
      label: 'Preview',
      icon: Eye,
      description: 'CRD branding'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">View Mode</h3>
        <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600 text-xs">
          {layerCount} layers
        </Badge>
      </div>
      
      {/* Segmented Control */}
      <div className="bg-slate-800 rounded-lg p-1 flex">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-crd-blue text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Mode Description */}
      <p className="text-xs text-slate-400">
        {modes.find(mode => mode.id === currentMode)?.description}
      </p>
    </div>
  );
};
