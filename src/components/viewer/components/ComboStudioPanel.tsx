
import React, { useState } from 'react';
import { 
  Settings,
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download,
  Save,
  RotateCcw,
  Zap,
  Palette,
  Globe,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { QuickComboPresets } from './QuickComboPresets';
import { EffectsComboSection } from './EffectsComboSection';
import { EnvironmentComboSection } from './EnvironmentComboSection';
import { LightingComboSection } from './LightingComboSection';
import { MaterialComboSection } from './MaterialComboSection';
import { ComboMemorySection } from './ComboMemorySection';

interface ComboStudioPanelProps {
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
  onResetEffect: (effectId: string) => void;
  onResetAllEffects: () => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
  onClose?: () => void;
  card: CardData;
}

export const ComboStudioPanel: React.FC<ComboStudioPanelProps> = ({
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
  onResetEffect,
  onResetAllEffects,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  onClose,
  card
}) => {
  const [activeTab, setActiveTab] = useState('styles');
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();

  const getActiveEffectsCount = () => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

  const handleResetAll = () => {
    setSelectedPresetId(undefined);
    onResetAllEffects();
    // Reset other settings to defaults
    onBrightnessChange([100]);
    onMaterialSettingsChange({
      metalness: 0.5,
      roughness: 0.5,
      reflectivity: 0.5,
      clearcoat: 0.3
    });
  };

  const handleEffectChange = (effectId: string, parameterId: string, value: number | boolean | string) => {
    setSelectedPresetId(undefined); // Clear selected preset when manually changing effects
    onEffectChange(effectId, parameterId, value);
  };

  return (
    <div className="fixed top-0 right-0 w-[520px] h-full bg-black bg-opacity-95 backdrop-blur-lg overflow-hidden border-l border-white/10 z-10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-crd-green" />
          <h3 className="text-white font-medium">Combo Studio</h3>
          <div className="text-xs text-crd-lightGray bg-crd-green/20 px-2 py-1 rounded">
            {getActiveEffectsCount()} active
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </Button>
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(card)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Share2 className="w-4 h-4 text-white" />
            </Button>
          )}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(card)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Download className="w-4 h-4 text-white" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          )}
        </div>
      </div>

      {/* Master Controls */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleResetAll}
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Combo
          </Button>
        </div>
      </div>

      {/* Tabbed Interface */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-editor-dark border-b border-white/10 rounded-none">
            <TabsTrigger 
              value="styles" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Styles</span>
            </TabsTrigger>
            <TabsTrigger 
              value="environment" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Environment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Styles Tab */}
            <TabsContent value="styles" className="p-4 space-y-4 mt-0">
              {/* Quick Presets */}
              <Card className="bg-editor-dark border-editor-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Quick Combos</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuickComboPresets
                    onApplyCombo={(combo) => {
                      setSelectedPresetId(combo.id);
                      // Apply effects
                      Object.entries(combo.effects).forEach(([effectId, parameters]) => {
                        Object.entries(parameters).forEach(([parameterId, value]) => {
                          onEffectChange(effectId, parameterId, value);
                        });
                      });
                      // Apply scene and lighting if provided
                      if (combo.scene) onSceneChange(combo.scene);
                      if (combo.lighting) onLightingChange(combo.lighting);
                    }}
                    currentEffects={effectValues}
                    selectedPresetId={selectedPresetId}
                    onPresetSelect={setSelectedPresetId}
                  />
                </CardContent>
              </Card>

              {/* Effects Section */}
              <Card className="bg-editor-dark border-editor-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">
                    Effects ({getActiveEffectsCount()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EffectsComboSection
                    effectValues={effectValues}
                    onEffectChange={handleEffectChange}
                    onResetEffect={onResetEffect}
                  />
                </CardContent>
              </Card>

              {/* Materials Section */}
              <Card className="bg-editor-dark border-editor-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <MaterialComboSection
                    materialSettings={materialSettings}
                    onMaterialSettingsChange={onMaterialSettingsChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Environment Tab */}
            <TabsContent value="environment" className="p-4 space-y-4 mt-0">
              {/* Environment Section */}
              <Card className="bg-editor-dark border-editor-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">
                    Environment ({selectedScene.name})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnvironmentComboSection
                    selectedScene={selectedScene}
                    onSceneChange={onSceneChange}
                  />
                </CardContent>
              </Card>

              {/* Lighting Section */}
              <Card className="bg-editor-dark border-editor-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">
                    Lighting ({selectedLighting.name})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LightingComboSection
                    selectedLighting={selectedLighting}
                    overallBrightness={overallBrightness}
                    interactiveLighting={interactiveLighting}
                    onLightingChange={onLightingChange}
                    onBrightnessChange={onBrightnessChange}
                    onInteractiveLightingToggle={onInteractiveLightingToggle}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview & Export Tab */}
            <TabsContent value="preview" className="p-4 space-y-4 mt-0">
              {/* Export Controls */}
              <Card className="bg-editor-dark border-editor-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Export & Share</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {onDownload && (
                    <Button
                      onClick={() => onDownload(card)}
                      variant="outline"
                      className="w-full border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Card
                    </Button>
                  )}
                  {onShare && (
                    <Button
                      onClick={() => onShare(card)}
                      variant="outline"
                      className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Card
                    </Button>
                  )}
                  <Button
                    onClick={onToggleFullscreen}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
                  </Button>
                </CardContent>
              </Card>

              {/* Saved Combos */}
              <Card className="bg-editor-dark border-editor-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Saved Combos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComboMemorySection
                    currentState={{
                      effects: effectValues,
                      scene: selectedScene,
                      lighting: selectedLighting,
                      materials: materialSettings,
                      brightness: overallBrightness[0]
                    }}
                    onLoadCombo={(combo) => {
                      setSelectedPresetId(undefined);
                      // Apply loaded combo
                      Object.entries(combo.effects).forEach(([effectId, parameters]) => {
                        Object.entries(parameters).forEach(([parameterId, value]) => {
                          onEffectChange(effectId, parameterId, value);
                        });
                      });
                      if (combo.scene) onSceneChange(combo.scene);
                      if (combo.lighting) onLightingChange(combo.lighting);
                      if (combo.materials) onMaterialSettingsChange(combo.materials);
                      if (combo.brightness) onBrightnessChange([combo.brightness]);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
