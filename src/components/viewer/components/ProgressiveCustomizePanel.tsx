
import React, { useCallback } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickComboPresets } from './QuickComboPresets';
import { EffectsSection } from './EffectsSection';
import { EnvironmentSection } from './EnvironmentSection';
import { MaterialPropertiesSection } from './MaterialPropertiesSection';
import { ExportSection } from './ExportSection';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface ProgressiveCustomizePanelProps {
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
  onClose: () => void;
  card: any;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const ProgressiveCustomizePanel: React.FC<ProgressiveCustomizePanelProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  isFullscreen,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onResetAllEffects,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  onClose,
  card,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden ${
      isFullscreen ? 'z-60' : 'z-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Enhanced Studio</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Quick Styles Section - 2 columns */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-4 h-4 text-crd-green mr-2" />
              Quick Styles
              {isApplyingPreset && (
                <div className="ml-2 w-2 h-2 bg-crd-green rounded-full animate-pulse" />
              )}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <QuickComboPresets
                onApplyCombo={onApplyCombo}
                currentEffects={effectValues}
                selectedPresetId={selectedPresetId}
                onPresetSelect={onPresetSelect}
                isApplyingPreset={isApplyingPreset}
              />
            </div>
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Enhanced Effects Section */}
          <EffectsSection
            effectValues={effectValues}
            onEffectChange={onEffectChange}
            onResetAllEffects={onResetAllEffects}
          />

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Environment Settings Section */}
          <EnvironmentSection
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            onSceneChange={onSceneChange}
            onLightingChange={onLightingChange}
            onBrightnessChange={handleBrightnessChange}
            onInteractiveLightingToggle={onInteractiveLightingToggle}
          />

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Material Properties Section */}
          <MaterialPropertiesSection
            materialSettings={materialSettings}
            onMaterialSettingsChange={onMaterialSettingsChange}
          />

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Export Options Section */}
          <ExportSection
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            onDownload={onDownload}
            onShare={onShare}
          />
        </div>
      </div>
    </div>
  );
};
