
import React, { useState } from 'react';
import { 
  Sun, 
  Sparkles, 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  Settings,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';
import { EnhancedEffectControls } from './EnhancedEffectControls';
import { DemoFeature } from './DemoFeature';
import { GuidedTour } from './GuidedTour';

interface EnhancedCustomizePanelProps {
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

export const EnhancedCustomizePanel: React.FC<EnhancedCustomizePanelProps> = ({
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
  const [showTour, setShowTour] = useState(false);
  const [activeTab, setActiveTab] = useState('start');

  const handleApplyPreset = (presetEffects: EffectValues) => {
    // Apply all preset effects
    Object.entries(presetEffects).forEach(([effectId, parameters]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        onEffectChange(effectId, parameterId, value);
      });
    });
    
    // Switch to effects tab to show the applied settings
    setTimeout(() => setActiveTab('effects'), 500);
  };

  const handleTourStep = (step: number, action: string) => {
    switch (step) {
      case 1:
        // Apply holographic preset
        handleApplyPreset({
          holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 280, prismaticDepth: 70 },
          foilspray: { intensity: 0 },
          prizm: { intensity: 0 },
          chrome: { intensity: 0 },
          interference: { intensity: 0 },
          brushedmetal: { intensity: 0 },
          crystal: { intensity: 0 },
          vintage: { intensity: 0 }
        });
        break;
      case 2:
        // Switch to cosmic void scene
        const cosmicScene = ENVIRONMENT_SCENES.find(s => s.name === 'Cosmic Void');
        if (cosmicScene) onSceneChange(cosmicScene);
        setActiveTab('environment');
        break;
      case 3:
        // Apply golden hour lighting
        const goldenLighting = LIGHTING_PRESETS.find(l => l.name === 'Golden Hour');
        if (goldenLighting) onLightingChange(goldenLighting);
        break;
      case 4:
        // Switch to effects tab
        setActiveTab('effects');
        break;
    }
  };

  // Calculate active effects count safely
  const getActiveEffectsCount = () => {
    return Object.values(effectValues).filter(effect => {
      // Check if the effect has an intensity parameter and it's greater than 0
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  };

  return (
    <>
      <div className="fixed top-0 right-0 w-80 h-full bg-black bg-opacity-95 backdrop-blur-lg overflow-hidden border-l border-white/10 z-10 flex flex-col">
        {/* Header with toolbar buttons */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-white" />
            <h3 className="text-white font-medium">Enhanced Settings</h3>
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

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-b border-white/10 mx-4 mt-4">
              <TabsTrigger value="start" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Rocket className="w-3 h-3 mr-1" />
                Start
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-white data-[state=active]:bg-purple-600">
                <Sparkles className="w-3 h-3 mr-1" />
                Effects
              </TabsTrigger>
              <TabsTrigger value="environment" className="text-white data-[state=active]:bg-blue-600">
                <Sun className="w-3 h-3 mr-1" />
                Environment
              </TabsTrigger>
              <TabsTrigger value="save" className="text-white data-[state=active]:bg-green-600">
                <Download className="w-3 h-3 mr-1" />
                Save
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="start" className="flex-1 p-4 overflow-y-auto">
              <DemoFeature 
                onApplyPreset={handleApplyPreset}
                onStartTour={() => setShowTour(true)}
              />
            </TabsContent>
            
            <TabsContent value="effects" className="flex-1 p-4 overflow-y-auto">
              <EnhancedEffectControls
                effectValues={effectValues}
                onEffectChange={onEffectChange}
                onResetEffect={onResetEffect}
                onResetAll={onResetAllEffects}
              />
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

              {/* Lighting Presets */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Lighting Presets
                </h4>
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
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white text-sm mb-2 block">Overall Brightness: {overallBrightness[0]}%</label>
                    <Slider
                      value={overallBrightness}
                      onValueChange={onBrightnessChange}
                      min={50}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Interactive Lighting</span>
                    <button
                      onClick={onInteractiveLightingToggle}
                      className={`px-3 py-1 rounded text-xs ${
                        interactiveLighting ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {interactiveLighting ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Material Properties */}
              <div>
                <h4 className="text-white font-medium mb-3">Material Properties</h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(materialSettings).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-white mb-2 block capitalize">
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
            </TabsContent>

            <TabsContent value="save" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-white text-lg font-semibold">Save & Share</h3>
                  <p className="text-crd-lightGray text-sm">
                    Export your enhanced card or share with others
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    onClick={() => onDownload && onDownload(card)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download High Quality
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-white hover:bg-gray-700 py-3"
                    onClick={() => onShare && onShare(card)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with Community
                  </Button>
                </div>

                <div className="bg-editor-dark border border-editor-border rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Current Settings</h4>
                  <div className="space-y-1 text-sm text-crd-lightGray">
                    <p>Scene: {selectedScene.name}</p>
                    <p>Lighting: {selectedLighting.name}</p>
                    <p>Active Effects: {getActiveEffectsCount()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Guided Tour Modal */}
      <GuidedTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onStepAction={handleTourStep}
      />
    </>
  );
};
