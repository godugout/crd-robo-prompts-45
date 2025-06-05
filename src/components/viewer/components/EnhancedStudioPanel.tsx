import React, { useState } from 'react';
import { X, Settings, Sparkles, Sun, Download, Share2, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import type { UserTier } from '../types/tierSystem';
import { TIER_SYSTEM } from '../types/tierSystem';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

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
  const tierInfo = TIER_SYSTEM[userTier];

  const getTierIcon = () => {
    return userTier === 'pro' ? <Zap className="w-4 h-4" /> : <Crown className="w-4 h-4" />;
  };

  const getTierColor = () => {
    return tierInfo?.color || '#3B82F6';
  };

  // Helper function to safely get numeric values from effect properties
  const getNumericValue = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  // Helper function to safely call onEffectChange with proper types
  const handleEffectChange = (effectId: string, parameterId: string, value: number | boolean | string) => {
    onEffectChange(effectId, parameterId, value);
  };

  // Helper function to safely convert unknown values to valid effect parameter types
  const convertToValidEffectValue = (value: unknown): number | boolean | string => {
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
      return value;
    }
    // Fallback to 0 for unknown types
    return 0;
  };

  // Advanced effect presets for pro/baller users
  const advancedPresets = [
    {
      name: 'Diamond Prism',
      effects: {
        crystal: { intensity: 95, facets: 16, dispersion: 85, clarity: 90, sparkle: true },
        holographic: { intensity: 30, shiftSpeed: 80, rainbowSpread: 150, prismaticDepth: 40, animated: true }
      }
    },
    {
      name: 'Liquid Chrome',
      effects: {
        chrome: { intensity: 85, sharpness: 95, distortion: 15, highlightSize: 55, polish: 95 },
        interference: { intensity: 25, frequency: 45, amplitude: 30, phase: 0 }
      }
    },
    {
      name: 'Golden Holographic',
      effects: {
        gold: { intensity: 90, shimmerSpeed: 140, platingThickness: 8, goldTone: 'rich', reflectivity: 95, colorEnhancement: true },
        holographic: { intensity: 60, shiftSpeed: 120, rainbowSpread: 200, prismaticDepth: 55, animated: true }
      }
    }
  ];

  const applyPreset = (preset: any) => {
    Object.entries(preset.effects).forEach(([effectId, parameters]: [string, any]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        const validValue = convertToValidEffectValue(value);
        handleEffectChange(effectId, parameterId, validValue);
      });
    });
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Enhanced Studio</h2>
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ borderColor: getTierColor(), color: getTierColor() }}
          >
            {getTierIcon()}
            {tierInfo?.name || 'Pro'}
          </Badge>
        </div>
        <div className="flex space-x-1">
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Share2 className="w-4 h-4 text-white" />
            </Button>
          )}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
            >
              <Download className="w-4 h-4 text-white" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

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
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Crown className="w-4 h-4 text-amber-400 mr-2" />
                Premium Presets
                <Badge className="ml-2 text-xs bg-amber-400 text-black px-2 py-1 rounded">
                  NEW
                </Badge>
              </h4>
              <div className="space-y-2">
                {advancedPresets.map((preset, index) => (
                  <Button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    className="w-full text-left justify-start bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Advanced Effect Controls */}
            <div>
              <h4 className="text-white font-medium mb-3">Advanced Controls</h4>
              <div className="space-y-4">
                {Object.entries(effectValues).map(([effectId, effect]) => {
                  const intensityValue = getNumericValue(effect.intensity);
                  if (!intensityValue || intensityValue === 0) return null;
                  
                  return (
                    <div key={effectId} className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium capitalize">{effectId}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(intensityValue)}%
                        </Badge>
                      </div>
                      
                      {/* Dynamic controls based on effect type */}
                      <div className="space-y-2">
                        <div>
                          <label className="text-gray-300 text-xs mb-1 block">Intensity</label>
                          <Slider
                            value={[intensityValue]}
                            onValueChange={([value]) => handleEffectChange(effectId, 'intensity', value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        
                        {/* Effect-specific controls */}
                        {effectId === 'holographic' && (
                          <>
                            <div>
                              <label className="text-gray-300 text-xs mb-1 block">Shift Speed</label>
                              <Slider
                                value={[getNumericValue(effect.shiftSpeed, 100)]}
                                onValueChange={([value]) => handleEffectChange(effectId, 'shiftSpeed', value)}
                                min={50}
                                max={200}
                                step={5}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-gray-300 text-xs mb-1 block">Rainbow Spread</label>
                              <Slider
                                value={[getNumericValue(effect.rainbowSpread, 180)]}
                                onValueChange={([value]) => handleEffectChange(effectId, 'rainbowSpread', value)}
                                min={100}
                                max={360}
                                step={10}
                                className="w-full"
                              />
                            </div>
                          </>
                        )}
                        
                        {effectId === 'crystal' && (
                          <>
                            <div>
                              <label className="text-gray-300 text-xs mb-1 block">Facets</label>
                              <Slider
                                value={[getNumericValue(effect.facets, 12)]}
                                onValueChange={([value]) => handleEffectChange(effectId, 'facets', value)}
                                min={6}
                                max={24}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-gray-300 text-xs mb-1 block">Clarity</label>
                              <Slider
                                value={[getNumericValue(effect.clarity, 80)]}
                                onValueChange={([value]) => handleEffectChange(effectId, 'clarity', value)}
                                min={0}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="environment" className="flex-1 p-4 overflow-y-auto space-y-6">
            {/* Environment Scenes */}
            <div>
              <h4 className="text-white font-medium mb-4">Environment Scenes</h4>
              <div className="grid grid-cols-2 gap-3">
                {ENVIRONMENT_SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => onSceneChange(scene)}
                    className={`aspect-square rounded-lg p-3 transition-all ${
                      selectedScene.id === scene.id 
                        ? 'ring-2 ring-blue-500 scale-105' 
                        : 'hover:scale-102'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${scene.gradient.split(' ').join(', ')})`
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-white">
                      <span className="text-lg mb-1">{scene.icon}</span>
                      <span className="text-xs font-medium text-center">{scene.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting Controls */}
            <div>
              <h4 className="text-white font-medium mb-3">Lighting</h4>
              <div className="space-y-2 mb-4">
                {LIGHTING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLightingChange(preset)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedLighting.id === preset.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs opacity-75">{preset.description}</div>
                  </button>
                ))}
              </div>
              
              <div>
                <label className="text-white text-sm mb-2 block">
                  Overall Brightness: {overallBrightness[0]}%
                </label>
                <Slider
                  value={overallBrightness}
                  onValueChange={onBrightnessChange}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="material" className="flex-1 p-4 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-white font-medium mb-3">Material Properties</h4>
              <div className="space-y-4">
                {Object.entries(materialSettings).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-white text-sm mb-2 block capitalize">
                      {key}: {value.toFixed(2)}
                    </label>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => 
                        onMaterialSettingsChange({ ...materialSettings, [key]: newValue })
                      }
                      min={0}
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Premium Export
                <Badge className="ml-2 text-xs bg-green-400 text-black px-2 py-1 rounded">
                  NO LIMITS
                </Badge>
              </h4>
              <p className="text-gray-300 text-sm mb-3">
                {userTier === 'baller' ? '4K resolution, no watermarks' : 'HD resolution, no watermarks'}
              </p>
              <Button 
                onClick={onDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export High Quality
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
