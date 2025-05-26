
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EffectItemProps {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  isActive: boolean;
  onToggle: (effectId: string) => void;
  onIntensityChange: (effectId: string, intensity: number) => void;
}

export const EffectItem = ({ 
  id, 
  name, 
  icon: Icon, 
  color, 
  description, 
  isActive, 
  onToggle, 
  onIntensityChange 
}: EffectItemProps) => {
  return (
    <div className="space-y-2">
      <div 
        className={`p-3 rounded-lg border transition-all cursor-pointer ${
          isActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-editor-border bg-editor-tool hover:border-crd-green/50'
        }`}
        onClick={() => onToggle(id)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h5 className="text-white font-medium text-sm">{name}</h5>
            <p className="text-crd-lightGray text-xs">{description}</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${
            isActive 
              ? 'border-crd-green bg-crd-green' 
              : 'border-gray-400'
          }`}>
            {isActive && (
              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
            )}
          </div>
        </div>
      </div>

      {isActive && (
        <div className="ml-11 mr-4">
          <label className="text-crd-lightGray text-xs">Intensity</label>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            onChange={(e) => onIntensityChange(id, parseInt(e.target.value))}
            className="w-full mt-1 accent-crd-green"
          />
        </div>
      )}
    </div>
  );
};
