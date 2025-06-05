
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sparkles } from 'lucide-react';
import type { MaterialSettings } from '../types';

interface MaterialPropertiesSectionProps {
  materialSettings: MaterialSettings;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
}

export const MaterialPropertiesSection: React.FC<MaterialPropertiesSectionProps> = ({
  materialSettings,
  onMaterialSettingsChange
}) => {
  const [showMaterial, setShowMaterial] = useState(false);

  const handleMaterialSettingChange = useCallback(
    (key: keyof MaterialSettings, value: number) => {
      onMaterialSettingsChange({
        ...materialSettings,
        [key]: value,
      });
    },
    [materialSettings, onMaterialSettingsChange],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium flex items-center">
          <Sparkles className="w-4 h-4 text-crd-green mr-2" />
          Material Properties
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setShowMaterial(!showMaterial)} className="text-white hover:text-white">
          {showMaterial ? 'Hide' : 'Show'}
        </Button>
      </div>
      {showMaterial && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="roughness-slider" className="text-white text-sm mb-2 block">
              Roughness: {Math.round(materialSettings.roughness * 100)}%
            </Label>
            <Slider
              id="roughness-slider"
              value={[materialSettings.roughness * 100]}
              max={100}
              step={1}
              onValueChange={(value) => handleMaterialSettingChange('roughness', value[0] / 100)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="metalness-slider" className="text-white text-sm mb-2 block">
              Metalness: {Math.round(materialSettings.metalness * 100)}%
            </Label>
            <Slider
              id="metalness-slider"
              value={[materialSettings.metalness * 100]}
              max={100}
              step={1}
              onValueChange={(value) => handleMaterialSettingChange('metalness', value[0] / 100)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="clearcoat-slider" className="text-white text-sm mb-2 block">
              Clearcoat: {Math.round(materialSettings.clearcoat * 100)}%
            </Label>
            <Slider
              id="clearcoat-slider"
              value={[materialSettings.clearcoat * 100]}
              max={100}
              step={1}
              onValueChange={(value) => handleMaterialSettingChange('clearcoat', value[0] / 100)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="reflectivity-slider" className="text-white text-sm mb-2 block">
              Reflectivity: {Math.round(materialSettings.reflectivity * 100)}%
            </Label>
            <Slider
              id="reflectivity-slider"
              value={[materialSettings.reflectivity * 100]}
              max={100}
              step={1}
              onValueChange={(value) => handleMaterialSettingChange('reflectivity', value[0] / 100)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
