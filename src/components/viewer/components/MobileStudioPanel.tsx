
import React, { useState } from 'react';
import { ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { QuickComboPresets } from './QuickComboPresets';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface MobileStudioPanelProps {
  isVisible: boolean;
  onClose: () => void;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  isFullscreen: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  card: any;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const MobileStudioPanel: React.FC<MobileStudioPanelProps> = ({
  isVisible,
  onClose,
  effectValues,
  overallBrightness,
  onEffectChange,
  onResetAllEffects,
  onBrightnessChange,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 z-30 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-medium text-lg">Studio</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
          <ChevronUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Styles Section */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium text-sm">Styles</h4>
          <Button
            onClick={onResetAllEffects}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
        
        {/* Preset Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <QuickComboPresets
            onApplyCombo={onApplyCombo}
            currentEffects={effectValues}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            isApplyingPreset={isApplyingPreset}
          />
        </div>
      </div>

      {/* Effects Section */}
      <div className="p-4 border-b border-white/10">
        <h4 className="text-white font-medium text-sm mb-3">Effects</h4>
        <div className="space-y-3">
          {/* Holographic */}
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Holographic</span>
            <div className="flex items-center space-x-2">
              <Slider
                value={[effectValues.holographic?.intensity || 0]}
                onValueChange={(value) => onEffectChange('holographic', 'intensity', value[0])}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-crd-lightGray text-xs w-8">
                {effectValues.holographic?.intensity || 0}
              </span>
            </div>
          </div>

          {/* Foil Spray */}
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Foil Spray</span>
            <div className="flex items-center space-x-2">
              <Slider
                value={[effectValues.foilspray?.intensity || 0]}
                onValueChange={(value) => onEffectChange('foilspray', 'intensity', value[0])}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-crd-lightGray text-xs w-8">
                {effectValues.foilspray?.intensity || 0}
              </span>
            </div>
          </div>

          {/* Prizm */}
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Prizm</span>
            <div className="flex items-center space-x-2">
              <Slider
                value={[effectValues.prizm?.intensity || 0]}
                onValueChange={(value) => onEffectChange('prizm', 'intensity', value[0])}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-crd-lightGray text-xs w-8">
                {effectValues.prizm?.intensity || 0}
              </span>
            </div>
          </div>

          {/* Chrome */}
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Chrome</span>
            <div className="flex items-center space-x-2">
              <Slider
                value={[effectValues.chrome?.intensity || 0]}
                onValueChange={(value) => onEffectChange('chrome', 'intensity', value[0])}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-crd-lightGray text-xs w-8">
                {effectValues.chrome?.intensity || 0}
              </span>
            </div>
          </div>

          {/* Crystal */}
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Crystal</span>
            <div className="flex items-center space-x-2">
              <Slider
                value={[effectValues.crystal?.intensity || 0]}
                onValueChange={(value) => onEffectChange('crystal', 'intensity', value[0])}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-crd-lightGray text-xs w-8">
                {effectValues.crystal?.intensity || 0}
              </span>
            </div>
          </div>

          {/* Gold */}
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Gold</span>
            <div className="flex items-center space-x-2">
              <Slider
                value={[effectValues.gold?.intensity || 0]}
                onValueChange={(value) => onEffectChange('gold', 'intensity', value[0])}
                max={100}
                step={1}
                className="w-20"
              />
              <span className="text-crd-lightGray text-xs w-8">
                {effectValues.gold?.intensity || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lighting Section */}
      <div className="p-4">
        <h4 className="text-white font-medium text-sm mb-3">Lighting</h4>
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Brightness</span>
          <div className="flex items-center space-x-2">
            <Slider
              value={overallBrightness}
              onValueChange={onBrightnessChange}
              max={200}
              min={10}
              step={5}
              className="w-20"
            />
            <span className="text-crd-lightGray text-xs w-8">
              {overallBrightness[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
