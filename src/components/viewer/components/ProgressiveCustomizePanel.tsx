
import React, { useState, useCallback } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  Settings,
  Palette,
  Globe,
  Zap,
  RotateCcw,
  Save,
  Menu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { QuickComboPresets } from './QuickComboPresets';
import { EffectsComboSection } from './EffectsComboSection';
import { EnvironmentComboSection } from './EnvironmentComboSection';
import { LightingComboSection } from './LightingComboSection';
import { MaterialComboSection } from './MaterialComboSection';
import { ComboMemorySection } from './ComboMemorySection';

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
  onDownload?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
  onClose?: () => void;
  card: CardData;
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
  card
}) => {
  const [activeTab, setActiveTab] = useState('styles');
  const [savedCombosOpen, setSavedCombosOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();

  // Calculate active effects count
  const getActiveEffectsCount = useCallback(() => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  }, [effectValues]);

  // Handle preset selection with proper typing
  const handlePresetSelect = useCallback((preset: any) => {
    // Apply preset effects with proper typing
    Object.entries(preset.effects).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        onEffectChange(effectId, parameterId, value as string | number | boolean);
      });
    });
    // Apply scene and lighting if provided
    if (preset.scene) onSceneChange(preset.scene);
    if (preset.lighting) onLightingChange(preset.lighting);
  }, [onEffectChange, onSceneChange, onLightingChange]);

  // Handle effect changes to clear selected preset
  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    setSelectedPresetId(undefined); // Clear selected preset when manually changing effects
    onEffectChange(effectId, parameterId, value);
  }, [onEffectChange]);

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

  return (
    <div className="fixed top-0 right-0 w-[350px] h-full bg-black bg-opacity-95 backdrop-blur-lg overflow-hidden border-l border-white/10 z-10 flex flex-col">
      {/* Compact Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-crd-green" />
          <h3 className="text-white font-medium text-sm">Studio</h3>
          <div className="text-xs text-crd-lightGray bg-crd-green/20 px-1.5 py-0.5 rounded">
            {getActiveEffectsCount()}
          </div>
        </div>
        <div className="flex space-x-1">
          {/* Actions Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10 px-2"
              >
                <Menu className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black border-gray-700">
              <DropdownMenuItem onClick={onToggleFullscreen} className="text-white hover:bg-gray-800">
                {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={() => onDownload && onDownload(card)} className="text-white hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                Download Card
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare && onShare(card)} className="text-white hover:bg-gray-800">
                <Share2 className="w-4 h-4 mr-2" />
                Share Card
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={handleResetAll} className="text-red-400 hover:bg-gray-800">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </DropdownMenuItem>
              <DropdownMenuItem className="text-crd-green hover:bg-gray-800">
                <Save className="w-4 h-4 mr-2" />
                Save Combo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10 px-2"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          )}
        </div>
      </div>

      {/* Compact Tabbed Interface */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-editor-dark border-b border-white/10 rounded-none mx-2 mt-2">
            <TabsTrigger 
              value="styles" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white flex items-center gap-1 text-xs"
            >
              <Palette className="w-3 h-3" />
              Styles
            </TabsTrigger>
            <TabsTrigger 
              value="environment" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-white flex items-center gap-1 text-xs"
            >
              <Globe className="w-3 h-3" />
              Environment
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Styles Tab */}
            <TabsContent value="styles" className="mt-0 space-y-3">
              {/* Quick Combos - Compact */}
              <div className="bg-editor-dark border border-editor-border rounded-lg p-3">
                <h4 className="text-white text-xs font-medium mb-2">Quick Combos</h4>
                <QuickComboPresets 
                  onApplyCombo={handlePresetSelect} 
                  currentEffects={effectValues}
                  selectedPresetId={selectedPresetId}
                  onPresetSelect={setSelectedPresetId}
                />
              </div>

              {/* Effects Section - Compact */}
              <div className="bg-editor-dark border border-editor-border rounded-lg p-3">
                <h4 className="text-white text-xs font-medium mb-2">
                  Effects ({getActiveEffectsCount()})
                </h4>
                <EffectsComboSection
                  effectValues={effectValues}
                  onEffectChange={handleEffectChange}
                  onResetEffect={(effectId) => {
                    setSelectedPresetId(undefined);
                    // Reset individual effect - preserve existing functionality
                    const effect = effectValues[effectId];
                    if (effect) {
                      Object.keys(effect).forEach(paramId => {
                        if (paramId === 'intensity') {
                          onEffectChange(effectId, paramId, 0);
                        }
                      });
                    }
                  }}
                />
              </div>

              {/* Saved Combos - Collapsible */}
              <Collapsible open={savedCombosOpen} onOpenChange={setSavedCombosOpen}>
                <div className="bg-editor-dark border border-editor-border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <button className="w-full p-3 flex items-center justify-between text-white hover:bg-white/5">
                      <h4 className="text-xs font-medium">Saved Combos</h4>
                      {savedCombosOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
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
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </TabsContent>

            {/* Environment Tab */}
            <TabsContent value="environment" className="mt-0 space-y-3">
              {/* Environment Section - Compact */}
              <div className="bg-editor-dark border border-editor-border rounded-lg p-3">
                <h4 className="text-white text-xs font-medium mb-2">
                  Environment ({selectedScene.name})
                </h4>
                <EnvironmentComboSection
                  selectedScene={selectedScene}
                  onSceneChange={onSceneChange}
                />
              </div>

              {/* Lighting Section - Compact */}
              <div className="bg-editor-dark border border-editor-border rounded-lg p-3">
                <h4 className="text-white text-xs font-medium mb-2">
                  Lighting ({selectedLighting.name})
                </h4>
                <LightingComboSection
                  selectedLighting={selectedLighting}
                  overallBrightness={overallBrightness}
                  interactiveLighting={interactiveLighting}
                  onLightingChange={onLightingChange}
                  onBrightnessChange={onBrightnessChange}
                  onInteractiveLightingToggle={onInteractiveLightingToggle}
                />
              </div>

              {/* Materials Section - Compact */}
              <div className="bg-editor-dark border border-editor-border rounded-lg p-3">
                <h4 className="text-white text-xs font-medium mb-2">Materials</h4>
                <MaterialComboSection
                  materialSettings={materialSettings}
                  onMaterialSettingsChange={onMaterialSettingsChange}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
