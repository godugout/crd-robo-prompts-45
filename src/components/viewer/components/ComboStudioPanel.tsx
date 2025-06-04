
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
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    presets: true,
    effects: true,
    environment: false,
    lighting: false,
    materials: false,
    memory: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveEffectsCount = () => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

  const handleResetAll = () => {
    onResetAllEffects();
    // Reset other settings to defaults
    onBrightnessChange([100]);
    onMaterialSettingsChange({
      metalness: 0.5,
      roughness: 0.5,
      reflectivity: 0.5
    });
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-black bg-opacity-95 backdrop-blur-lg overflow-hidden border-l border-white/10 z-10 flex flex-col">
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

      {/* Collapsible Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Quick Presets */}
        <Collapsible 
          open={expandedSections.presets} 
          onOpenChange={() => toggleSection('presets')}
        >
          <CollapsibleTrigger asChild>
            <Card className="bg-editor-dark border-editor-border cursor-pointer hover:bg-editor-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Quick Combos
                  <div className="text-xs text-crd-lightGray">
                    {expandedSections.presets ? '−' : '+'}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2">
              <QuickComboPresets
                onApplyCombo={(combo) => {
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
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Effects Section */}
        <Collapsible 
          open={expandedSections.effects} 
          onOpenChange={() => toggleSection('effects')}
        >
          <CollapsibleTrigger asChild>
            <Card className="bg-editor-dark border-editor-border cursor-pointer hover:bg-editor-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Effects ({getActiveEffectsCount()})
                  <div className="text-xs text-crd-lightGray">
                    {expandedSections.effects ? '−' : '+'}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2">
              <EffectsComboSection
                effectValues={effectValues}
                onEffectChange={onEffectChange}
                onResetEffect={onResetEffect}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Environment Section */}
        <Collapsible 
          open={expandedSections.environment} 
          onOpenChange={() => toggleSection('environment')}
        >
          <CollapsibleTrigger asChild>
            <Card className="bg-editor-dark border-editor-border cursor-pointer hover:bg-editor-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Environment ({selectedScene.name})
                  <div className="text-xs text-crd-lightGray">
                    {expandedSections.environment ? '−' : '+'}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2">
              <EnvironmentComboSection
                selectedScene={selectedScene}
                onSceneChange={onSceneChange}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Lighting Section */}
        <Collapsible 
          open={expandedSections.lighting} 
          onOpenChange={() => toggleSection('lighting')}
        >
          <CollapsibleTrigger asChild>
            <Card className="bg-editor-dark border-editor-border cursor-pointer hover:bg-editor-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Lighting ({selectedLighting.name})
                  <div className="text-xs text-crd-lightGray">
                    {expandedSections.lighting ? '−' : '+'}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2">
              <LightingComboSection
                selectedLighting={selectedLighting}
                overallBrightness={overallBrightness}
                interactiveLighting={interactiveLighting}
                onLightingChange={onLightingChange}
                onBrightnessChange={onBrightnessChange}
                onInteractiveLightingToggle={onInteractiveLightingToggle}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Materials Section */}
        <Collapsible 
          open={expandedSections.materials} 
          onOpenChange={() => toggleSection('materials')}
        >
          <CollapsibleTrigger asChild>
            <Card className="bg-editor-dark border-editor-border cursor-pointer hover:bg-editor-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Materials
                  <div className="text-xs text-crd-lightGray">
                    {expandedSections.materials ? '−' : '+'}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2">
              <MaterialComboSection
                materialSettings={materialSettings}
                onMaterialSettingsChange={onMaterialSettingsChange}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Combo Memory Section */}
        <Collapsible 
          open={expandedSections.memory} 
          onOpenChange={() => toggleSection('memory')}
        >
          <CollapsibleTrigger asChild>
            <Card className="bg-editor-dark border-editor-border cursor-pointer hover:bg-editor-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Saved Combos
                  <div className="text-xs text-crd-lightGray">
                    {expandedSections.memory ? '−' : '+'}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2">
              <ComboMemorySection
                currentState={{
                  effects: effectValues,
                  scene: selectedScene,
                  lighting: selectedLighting,
                  materials: materialSettings,
                  brightness: overallBrightness[0]
                }}
                onLoadCombo={(combo) => {
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
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
