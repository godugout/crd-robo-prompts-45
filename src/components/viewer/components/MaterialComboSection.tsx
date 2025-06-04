
import React from 'react';
import { Slider } from '@/components/ui/slider';
import type { MaterialSettings } from '../types';

interface MaterialComboSectionProps {
  materialSettings: MaterialSettings;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
}

export const MaterialComboSection: React.FC<MaterialComboSectionProps> = ({
  materialSettings,
  onMaterialSettingsChange
}) => {
  const materials = [
    { key: 'metalness', label: 'Metalness', description: 'How metallic the surface appears' },
    { key: 'roughness', label: 'Roughness', description: 'Surface roughness affects reflections' },
    { key: 'reflectivity', label: 'Reflectivity', description: 'How much light reflects off surface' },
    { key: 'clearcoat', label: 'Clearcoat', description: 'Clear protective coating effect' }
  ];

  return (
    <div className="space-y-4">
      {materials.map(({ key, label, description }) => {
        const value = materialSettings[key as keyof MaterialSettings];
        
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white text-sm font-medium">{label}</label>
                <p className="text-crd-lightGray text-xs">{description}</p>
              </div>
              <span className="text-crd-lightGray text-xs min-w-[3rem] text-right">
                {Math.round(value * 100)}%
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => 
                onMaterialSettingsChange({ 
                  ...materialSettings, 
                  [key]: newValue 
                })
              }
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>
        );
      })}
    </div>
  );
};
