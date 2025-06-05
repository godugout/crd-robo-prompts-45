
import React, { useState, useCallback } from 'react';
import { Sparkles, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickComboPresets } from './QuickComboPresets';
import { CompactEffectControls } from './CompactEffectControls';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

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

// Enhanced effect configurations with better organization
const ENHANCED_EFFECTS_CONFIG = {
  holographic: {
    name: 'Holographic',
    color: 'text-purple-400',
    sliderColor: 'purple',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      shiftSpeed: { label: 'Shift Speed', min: 0, max: 300, step: 10 },
      rainbowSpread: { label: 'Rainbow Spread', min: 0, max: 360, step: 10 },
      prismaticDepth: { label: 'Prismatic Depth', min: 0, max: 100, step: 5 }
    }
  },
  foilspray: {
    name: 'Foil Spray',
    color: 'text-yellow-400',
    sliderColor: 'yellow',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      density: { label: 'Density', min: 0, max: 100, step: 5 },
      size: { label: 'Size', min: 0, max: 100, step: 5 }
    }
  },
  prizm: {
    name: 'Prizm',
    color: 'text-blue-400',
    sliderColor: 'blue',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      refraction: { label: 'Refraction', min: 0, max: 100, step: 5 },
      dispersion: { label: 'Dispersion', min: 0, max: 100, step: 5 }
    }
  },
  chrome: {
    name: 'Chrome',
    color: 'text-gray-300',
    sliderColor: 'gray',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      sharpness: { label: 'Sharpness', min: 0, max: 100, step: 5 },
      reflectivity: { label: 'Reflectivity', min: 0, max: 100, step: 5 }
    }
  },
  interference: {
    name: 'Interference',
    color: 'text-green-400',
    sliderColor: 'green',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      frequency: { label: 'Frequency', min: 0, max: 100, step: 5 },
      amplitude: { label: 'Amplitude', min: 0, max: 100, step: 5 }
    }
  },
  brushedmetal: {
    name: 'Brushed Metal',
    color: 'text-orange-400',
    sliderColor: 'orange',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      direction: { label: 'Direction', min: 0, max: 360, step: 15 },
      roughness: { label: 'Roughness', min: 0, max: 100, step: 5 }
    }
  },
  crystal: {
    name: 'Crystal',
    color: 'text-cyan-400',
    sliderColor: 'cyan',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      facets: { label: 'Facets', min: 3, max: 20, step: 1 },
      clarity: { label: 'Clarity', min: 0, max: 100, step: 5 }
    }
  },
  vintage: {
    name: 'Vintage',
    color: 'text-amber-400',
    sliderColor: 'amber',
    parameters: {
      intensity: { label: 'Intensity', min: 0, max: 100, step: 1 },
      aging: { label: 'Aging', min: 0, max: 100, step: 5 },
      wear: { label: 'Wear', min: 0, max: 100, step: 5 }
    }
  }
};

// Custom slider component with inline styles for color variants
const ColoredSlider = ({ value, onValueChange, min, max, step, color, variant = 'primary', className = '' }: {
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  color: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}) => {
  // Using CSS variables to ensure dynamic colors work
  const sliderStyle = React.useMemo(() => {
    const colorMap: Record<string, string> = {
      purple: '#a855f7',
      yellow: '#facc15', 
      blue: '#60a5fa',
      gray: '#9ca3af',
      green: '#4ade80',
      orange: '#fb923c',
      cyan: '#22d3ee',
      amber: '#fbbf24'
    };
    
    const baseColor = colorMap[color] || '#9ca3af';
    
    if (variant === 'primary') {
      // Primary: white track with colored thumb
      return {
        '--track-bg': 'rgba(255, 255, 255, 0.2)',
        '--track-border': 'rgba(255, 255, 255, 0.4)',
        '--range-bg': 'rgba(255, 255, 255, 1)',
        '--thumb-bg': baseColor,
        '--thumb-border': baseColor,
        '--thumb-shadow': `${baseColor}80`
      } as React.CSSProperties;
    } else {
      // Secondary: colored track (muted) with colored thumb
      return {
        '--track-bg': `${baseColor}33`,
        '--track-border': `${baseColor}66`,
        '--range-bg': `${baseColor}66`,
        '--thumb-bg': baseColor,
        '--thumb-border': baseColor,
        '--thumb-shadow': `${baseColor}80`
      } as React.CSSProperties;
    }
  }, [color, variant]);

  return (
    <div style={sliderStyle}>
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        className={`w-full slider-colored ${className}`}
      />
    </div>
  );
};

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
  const [showEnvironment, setShowEnvironment] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);
  const [expandedEffects, setExpandedEffects] = useState<Set<string>>(new Set());

  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  const handleMaterialSettingChange = useCallback(
    (key: keyof MaterialSettings, value: number) => {
      onMaterialSettingsChange({
        ...materialSettings,
        [key]: value,
      });
    },
    [materialSettings, onMaterialSettingsChange],
  );

  const handleResetEffect = useCallback((effectId: string) => {
    onEffectChange(effectId, 'intensity', 0);
  }, [onEffectChange]);

  const toggleEffectExpanded = useCallback((effectId: string) => {
    setExpandedEffects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(effectId)) {
        newSet.delete(effectId);
      } else {
        newSet.add(effectId);
      }
      return newSet;
    });
  }, []);

  const getActiveEffectsCount = () => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

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
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center">
                <Sparkles className="w-4 h-4 text-crd-green mr-2" />
                Enhanced Effects ({getActiveEffectsCount()})
              </h3>
              <Button variant="ghost" size="sm" onClick={onResetAllEffects} className="text-red-400 hover:text-red-300">
                Reset All
              </Button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(ENHANCED_EFFECTS_CONFIG).map(([effectId, config]) => {
                const effectData = effectValues[effectId] || { intensity: 0 };
                const intensity = typeof effectData.intensity === 'number' ? effectData.intensity : 0;
                const isExpanded = expandedEffects.has(effectId);
                const isActive = intensity > 0;
                const hasSecondaryParams = Object.keys(config.parameters).length > 1;
                
                return (
                  <div key={effectId} className={`border border-white/10 rounded-lg p-3 ${isActive ? 'bg-white/5' : 'bg-transparent'}`}>
                    {/* Title and Intensity Slider on one line */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className={`text-sm font-medium ${config.color} min-w-[90px]`}>
                          {config.name}
                        </span>
                        <div className="flex-1">
                          <ColoredSlider
                            value={[intensity]}
                            onValueChange={(value) => onEffectChange(effectId, 'intensity', value[0])}
                            min={0}
                            max={100}
                            step={1}
                            color={config.sliderColor}
                            variant="primary"
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{intensity}</span>
                      </div>
                      
                      {/* Expand/Collapse button - only show if effect has parameters beyond intensity */}
                      {hasSecondaryParams && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEffectExpanded(effectId)}
                          className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                        >
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>

                    {/* Collapsible additional parameters */}
                    {isExpanded && hasSecondaryParams && (
                      <div className="space-y-2 pl-2 border-l border-white/10">
                        {Object.entries(config.parameters).map(([paramId, paramConfig]) => {
                          if (paramId === 'intensity') return null; // Skip intensity as it's already shown above
                          
                          const value = typeof effectData[paramId] === 'number' ? effectData[paramId] : paramConfig.min;
                          
                          return (
                            <div key={paramId} className="flex items-center space-x-2">
                              <Label className={`text-xs w-20 text-right text-${config.sliderColor}-400/70`}>
                                {paramConfig.label}
                              </Label>
                              <div className="flex-1">
                                <ColoredSlider
                                  value={[value]}
                                  onValueChange={(newValue) => onEffectChange(effectId, paramId, newValue[0])}
                                  min={paramConfig.min}
                                  max={paramConfig.max}
                                  step={paramConfig.step}
                                  color={config.sliderColor}
                                  variant="secondary"
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Environment Settings Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center">
                <Sparkles className="w-4 h-4 text-crd-green mr-2" />
                Environment
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEnvironment(!showEnvironment)} className="text-white hover:text-white">
                {showEnvironment ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showEnvironment && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scene-select" className="text-white text-sm mb-2 block">
                    Scene
                  </Label>
                  <Select onValueChange={(value) => onSceneChange(JSON.parse(value))}>
                    <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder={selectedScene.name} />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {ENVIRONMENT_SCENES.map((scene) => (
                        <SelectItem key={scene.name} value={JSON.stringify(scene)} className="text-white hover:bg-white/10">
                          {scene.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lighting-select" className="text-white text-sm mb-2 block">
                    Lighting
                  </Label>
                  <Select onValueChange={(value) => onLightingChange(JSON.parse(value))}>
                    <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder={selectedLighting.name} />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {LIGHTING_PRESETS.map((lighting) => (
                        <SelectItem key={lighting.name} value={JSON.stringify(lighting)} className="text-white hover:bg-white/10">
                          {lighting.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brightness-slider" className="text-white text-sm mb-2 block">
                    Brightness: {overallBrightness[0]}%
                  </Label>
                  <Slider
                    id="brightness-slider"
                    value={overallBrightness}
                    max={200}
                    step={1}
                    onValueChange={handleBrightnessChange}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="interactive-lighting" className="text-white text-sm">
                    Interactive Lighting
                  </Label>
                  <Switch
                    id="interactive-lighting"
                    checked={interactiveLighting}
                    onCheckedChange={onInteractiveLightingToggle}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Material Properties Section */}
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

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Export Options Section */}
          <div className="space-y-4">
            <h3 className="text-white font-medium flex items-center">
              <Sparkles className="w-4 h-4 text-crd-green mr-2" />
              Export Options
            </h3>
            <Button variant="secondary" onClick={onToggleFullscreen} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </Button>
            <Button variant="secondary" onClick={onDownload} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
              Download
            </Button>
            {onShare && (
              <Button variant="secondary" onClick={onShare} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
