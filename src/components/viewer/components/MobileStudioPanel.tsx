
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { QuickComboPresets } from './QuickComboPresets';
import { EnvironmentComboSection } from './EnvironmentComboSection';
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
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => setActiveTab('styles')}
            variant="ghost"
            size="sm"
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === 'styles' 
                ? 'bg-crd-green text-black font-medium' 
                : 'text-white hover:text-crd-green'
            }`}
          >
            ✨ Styles
          </Button>
          <Button
            onClick={() => setActiveTab('environment')}
            variant="ghost"
            size="sm"
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === 'environment' 
                ? 'bg-crd-green text-black font-medium' 
                : 'text-white hover:text-crd-green'
            }`}
          >
            🌍 Environment
          </Button>
          <Button
            onClick={() => setActiveTab('preview')}
            variant="ghost"
            size="sm"
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === 'preview' 
                ? 'bg-crd-green text-black font-medium' 
                : 'text-white hover:text-crd-green'
            }`}
          >
            👁️ Preview
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
          <ChevronUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[60vh]">
        {/* Styles Tab */}
        {activeTab === 'styles' && (
          <div className="p-4 space-y-6">
            {/* Quick Combos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Quick Combos</h4>
                <Button
                  onClick={onResetAllEffects}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset All
                </Button>
              </div>
              
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

            {/* Effects Controls */}
            <div>
              <h4 className="text-white font-medium mb-4">Effects ({Object.values(effectValues).filter(effect => effect && typeof effect.intensity === 'number' && effect.intensity > 0).length})</h4>
              <div className="space-y-4">
                {/* Holographic */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Holographic</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.holographic?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('holographic', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.holographic?.intensity || 0}%
                    </span>
                  </div>
                </div>

                {/* Foil Spray */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Foil Spray</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.foilspray?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('foilspray', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.foilspray?.intensity || 0}%
                    </span>
                  </div>
                </div>

                {/* Prizm */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Prizm</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.prizm?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('prizm', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.prizm?.intensity || 0}%
                    </span>
                  </div>
                </div>

                {/* Chrome */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Chrome</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.chrome?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('chrome', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.chrome?.intensity || 0}%
                    </span>
                  </div>
                </div>

                {/* Interference */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Interference</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.interference?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('interference', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.interference?.intensity || 0}%
                    </span>
                  </div>
                </div>

                {/* Brushed Metal */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Brushed Metal</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.brushedmetal?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('brushedmetal', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.brushedmetal?.intensity || 0}%
                    </span>
                  </div>
                </div>

                {/* Crystal */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Crystal</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.crystal?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('crystal', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.crystal?.intensity || 0}%
                    </span>
                  </div>
                </div>

                {/* Vintage */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Vintage</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[effectValues.vintage?.intensity || 0]}
                      onValueChange={(value) => onEffectChange('vintage', 'intensity', value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">
                      {effectValues.vintage?.intensity || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div>
              <h4 className="text-white font-medium mb-4">Materials</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Metalness</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[50]}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">50%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Roughness</span>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={[50]}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-crd-green text-xs w-8 font-mono">50%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Environment Tab */}
        {activeTab === 'environment' && (
          <div className="p-4 space-y-6">
            <div>
              <h4 className="text-white font-medium mb-4">Spaces</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-crd-green text-sm mb-3">2D Environments</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => onSceneChange('forest')}
                      variant={selectedScene === 'forest' ? "default" : "outline"}
                      className={`h-12 text-xs ${
                        selectedScene === 'forest'
                          ? 'bg-crd-green text-black'
                          : 'border-white/20 hover:border-crd-green text-white'
                      }`}
                    >
                      🌲 Enchanted Forest
                    </Button>
                    <Button
                      onClick={() => onSceneChange('mountain')}
                      variant={selectedScene === 'mountain' ? "default" : "outline"}
                      className={`h-12 text-xs ${
                        selectedScene === 'mountain'
                          ? 'bg-crd-green text-black'
                          : 'border-white/20 hover:border-crd-green text-white'
                      }`}
                    >
                      🏔️ Mountain Vista
                    </Button>
                    <Button
                      onClick={() => onSceneChange('cavern')}
                      variant={selectedScene === 'cavern' ? "default" : "outline"}
                      className={`h-12 text-xs ${
                        selectedScene === 'cavern'
                          ? 'bg-crd-green text-black'
                          : 'border-white/20 hover:border-crd-green text-white'
                      }`}
                    >
                      💎 Crystal Cavern
                    </Button>
                    <Button
                      onClick={() => onSceneChange('metropolis')}
                      variant={selectedScene === 'metropolis' ? "default" : "outline"}
                      className={`h-12 text-xs ${
                        selectedScene === 'metropolis'
                          ? 'bg-crd-green text-black'
                          : 'border-white/20 hover:border-crd-green text-white'
                      }`}
                    >
                      🌃 Neon Metropolis
                    </Button>
                  </div>
                </div>

                <div>
                  <h5 className="text-blue-400 text-sm mb-3">3D Environments</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => onSceneChange('studio')}
                      variant={selectedScene === 'studio' ? "default" : "outline"}
                      className={`h-12 text-xs ${
                        selectedScene === 'studio'
                          ? 'bg-blue-500 text-white'
                          : 'border-white/20 hover:border-blue-500 text-white'
                      }`}
                    >
                      🎬 Modern Studio
                    </Button>
                    <div className="h-12 border border-white/10 rounded flex items-center justify-center opacity-50">
                      <span className="text-gray-400 text-xs">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lighting */}
            <div>
              <h4 className="text-white font-medium mb-4">Lighting</h4>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Brightness</span>
                <div className="flex items-center space-x-3">
                  <Slider
                    value={overallBrightness}
                    onValueChange={onBrightnessChange}
                    max={200}
                    min={10}
                    step={5}
                    className="w-24"
                  />
                  <span className="text-crd-green text-xs w-8 font-mono">
                    {overallBrightness[0]}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="p-4 space-y-6">
            <div>
              <h4 className="text-white font-medium mb-4">Export & Share</h4>
              <div className="space-y-3">
                <Button
                  onClick={onDownload}
                  className="w-full bg-crd-green text-black hover:bg-crd-green/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Card
                </Button>
                {onShare && (
                  <Button
                    onClick={onShare}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Card
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
