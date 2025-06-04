
import React, { useState, useCallback } from 'react';
import { 
  Settings,
  Sparkles,
  Sun,
  Download,
  ChevronUp,
  X,
  Palette,
  Zap,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from '@/components/ui/drawer';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

interface CompactBottomDrawerProps {
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
  card: CardData;
}

// Quick preset definitions
const QUICK_PRESETS = [
  {
    id: 'holographic',
    name: 'Holographic',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-purple-600',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 280, prismaticDepth: 70 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'chrome',
    name: 'Chrome',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-blue-600',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 90 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 30 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-yellow-600',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 70 },
      prizm: { intensity: 0 },
      chrome: { intensity: 40 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 50 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  },
  {
    id: 'none',
    name: 'None',
    icon: <X className="w-4 h-4" />,
    color: 'bg-gray-600',
    effects: {
      holographic: { intensity: 0 },
      foilspray: { intensity: 0 },
      prizm: { intensity: 0 },
      chrome: { intensity: 0 },
      interference: { intensity: 0 },
      brushedmetal: { intensity: 0 },
      crystal: { intensity: 0 },
      vintage: { intensity: 0 }
    }
  }
];

export const CompactBottomDrawer: React.FC<CompactBottomDrawerProps> = ({
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
  card
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate active effects count
  const getActiveEffectsCount = useCallback(() => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  }, [effectValues]);

  const handlePresetApply = useCallback((preset: typeof QUICK_PRESETS[0]) => {
    Object.entries(preset.effects).forEach(([effectId, parameters]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        onEffectChange(effectId, parameterId, value);
      });
    });
  }, [onEffectChange]);

  const currentStatusText = getActiveEffectsCount() > 0 
    ? `${getActiveEffectsCount()} effects active`
    : 'No effects';

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* Enhanced Compact Trigger */}
      <DrawerTrigger asChild>
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <Button
            variant="secondary"
            className="bg-black/90 backdrop-blur-lg border-2 border-crd-green/30 text-white hover:bg-black/95 hover:border-crd-green/50 px-6 py-3 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105"
          >
            <Settings className="w-5 h-5 mr-3 text-crd-green" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Enhanced Studio</span>
              <span className="text-xs opacity-75">
                {selectedScene.name} • {currentStatusText}
              </span>
            </div>
            <ChevronUp className="w-5 h-5 ml-3 text-crd-green" />
          </Button>
        </div>
      </DrawerTrigger>

      {/* Compact Drawer Content */}
      <DrawerContent className="h-[70vh] bg-black/95 backdrop-blur-lg border-t border-white/20">
        <DrawerHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-white text-xl font-semibold flex items-center">
              <Settings className="w-6 h-6 mr-3 text-crd-green" />
              Enhanced Studio
            </DrawerTitle>
            <div className="flex items-center space-x-3">
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(card)}
                  className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          {/* Quick Effects Presets */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              Quick Effects
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetApply(preset)}
                  className={`p-4 rounded-xl border-2 border-transparent hover:border-white/30 transition-all ${preset.color} bg-opacity-20 hover:bg-opacity-30 hover:scale-105`}
                >
                  <div className="flex flex-col items-center space-y-2 text-white">
                    {preset.icon}
                    <span className="text-sm font-medium">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Environment Scenes - Compact Grid */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Sun className="w-5 h-5 mr-2 text-blue-400" />
              Environments
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {ENVIRONMENT_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => onSceneChange(scene)}
                  className={`aspect-square rounded-lg p-3 transition-all hover:scale-105 ${
                    selectedScene.id === scene.id 
                      ? 'ring-2 ring-blue-500 scale-105' 
                      : ''
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

          {/* Lighting Presets - Horizontal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-yellow-400" />
              Lighting
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LIGHTING_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onLightingChange(preset)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedLighting.id === preset.id 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium text-sm">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
