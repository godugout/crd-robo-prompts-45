
import React, { useState } from 'react';
import { ChevronUp, Settings, Palette, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickComboPresets } from './QuickComboPresets';
import { MobileStudioDrawer } from './MobileStudioDrawer';
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
  card,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-20 left-0 right-0 bg-black bg-opacity-95 backdrop-blur border-t border-white/10 z-30">
      {/* Quick Styles Section - Always Visible */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium text-sm flex items-center">
            <Zap className="w-4 h-4 text-crd-green mr-2" />
            Quick Styles
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronUp className="w-4 h-4 text-white" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <QuickComboPresets
            onApplyCombo={onApplyCombo}
            currentEffects={effectValues}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            isApplyingPreset={isApplyingPreset}
          />
        </div>
      </div>

      {/* Advanced Controls Toggle */}
      <div className="border-t border-white/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-white text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Advanced Studio
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white text-sm"
          >
            <Palette className="w-4 h-4 mr-2" />
            Color Themes
          </Button>
        </div>
      </div>

      {/* Advanced Studio Drawer */}
      <MobileStudioDrawer
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        effectValues={effectValues}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        materialSettings={materialSettings}
        isFullscreen={isFullscreen}
        onSceneChange={onSceneChange}
        onLightingChange={onLightingChange}
        onEffectChange={onEffectChange}
        onResetAllEffects={onResetAllEffects}
        onBrightnessChange={onBrightnessChange}
        onInteractiveLightingToggle={onInteractiveLightingToggle}
        onMaterialSettingsChange={onMaterialSettingsChange}
        onToggleFullscreen={onToggleFullscreen}
        onDownload={onDownload}
        onShare={onShare}
        card={card}
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        onApplyCombo={onApplyCombo}
        isApplyingPreset={isApplyingPreset}
        isOpen={showAdvanced}
        onOpenChange={setShowAdvanced}
      />
    </div>
  );
};
