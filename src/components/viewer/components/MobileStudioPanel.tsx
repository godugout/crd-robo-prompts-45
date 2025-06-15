
import React, { useState } from 'react';
import { StylesTab } from './mobile-studio/StylesTab';
import { EnvironmentTab } from './mobile-studio/EnvironmentTab';
import { PreviewTab } from './mobile-studio/PreviewTab';
import { TabNavigation } from './mobile-studio/TabNavigation';
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
  effectValues,
  overallBrightness,
  onSceneChange,
  onEffectChange,
  onResetAllEffects,
  onBrightnessChange,
  onDownload,
  onShare,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  const [activeTab, setActiveTab] = useState<'styles' | 'environment' | 'preview'>('styles');

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 z-30 max-h-[80vh] overflow-hidden">
      {/* Header with Tabs */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={onClose}
      />

      {/* Content */}
      <div className="overflow-y-auto max-h-[60vh]">
        {activeTab === 'styles' && (
          <StylesTab
            effectValues={effectValues}
            onEffectChange={onEffectChange}
            onResetAllEffects={onResetAllEffects}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            onApplyCombo={onApplyCombo}
            isApplyingPreset={isApplyingPreset}
          />
        )}

        {activeTab === 'environment' && (
          <EnvironmentTab
            selectedScene={selectedScene}
            overallBrightness={overallBrightness}
            onSceneChange={onSceneChange}
            onBrightnessChange={onBrightnessChange}
          />
        )}

        {activeTab === 'preview' && (
          <PreviewTab
            onDownload={onDownload}
            onShare={onShare}
          />
        )}
      </div>
    </div>
  );
};
