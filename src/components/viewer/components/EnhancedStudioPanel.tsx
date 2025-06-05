
import React, { useState } from 'react';
import { Sparkles, Sun, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UserTier } from '../types/tierSystem';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { StudioPanelHeader } from './StudioPanelHeader';
import { AdvancedPresets } from './AdvancedPresets';
import { AdvancedEffectControls } from './AdvancedEffectControls';
import { EnvironmentControls } from './EnvironmentControls';
import { MaterialControls } from './MaterialControls';

interface EnhancedStudioPanelProps {
  userTier: UserTier;
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  onClose: () => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onBrightnessChange: (value: number[]) => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export const EnhancedStudioPanel: React.FC<EnhancedStudioPanelProps> = ({
  userTier,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  onClose,
  onEffectChange,
  onSceneChange,
  onLightingChange,
  onMaterialSettingsChange,
  onBrightnessChange,
  onDownload,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState('effects');

  // Helper function to safely convert unknown values to valid effect parameter types
  const convertToValidEffectValue = (value: unknown): number | boolean | string => {
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
      return value;
    }
    // Fallback to 0 for unknown types
    return 0;
  };

  const applyPreset = (preset: any) => {
    console.log('🎨 Applying preset:', preset.name);
    Object.entries(preset.effects).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        const validValue = convertToValidEffectValue(value);
        console.log(`Setting ${effectId}.${parameterId} = ${validValue}`);
        onEffectChange(effectId, parameterId, validValue);
      });
    });
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden z-50">
      {/* Header */}
      <StudioPanelHeader
        userTier={userTier}
        onClose={onClose}
        onDownload={onDownload}
        onShare={onShare}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-b border-white/10 mx-4 mt-4">
            <TabsTrigger value="effects" className="text-white data-[state=active]:bg-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="environment" className="text-white data-[state=active]:bg-blue-600">
              <Sun className="w-3 h-3 mr-1" />
              Scene
            </TabsTrigger>
            <TabsTrigger value="material" className="text-white data-[state=active]:bg-green-600">
              <Settings className="w-3 h-3 mr-1" />
              Material
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="effects" className="flex-1 p-4 overflow-y-auto space-y-6">
            {/* Advanced Presets */}
            <AdvancedPresets onApplyPreset={applyPreset} />

            {/* Advanced Effect Controls */}
            <AdvancedEffectControls
              effectValues={effectValues}
              onEffectChange={onEffectChange}
            />
          </TabsContent>
          
          <TabsContent value="environment" className="flex-1 p-4 overflow-y-auto">
            <EnvironmentControls
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              overallBrightness={overallBrightness}
              onSceneChange={onSceneChange}
              onLightingChange={onLightingChange}
              onBrightnessChange={onBrightnessChange}
            />
          </TabsContent>

          <TabsContent value="material" className="flex-1 p-4 overflow-y-auto">
            <MaterialControls
              materialSettings={materialSettings}
              userTier={userTier}
              onMaterialSettingsChange={onMaterialSettingsChange}
              onDownload={onDownload}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
