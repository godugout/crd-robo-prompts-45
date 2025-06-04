
import React, { useState, useCallback } from 'react';
import { 
  Settings,
  Sparkles,
  Sun,
  Download,
  ChevronUp,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { HorizontalPresetSelection } from './HorizontalPresetSelection';
import { HorizontalEnvironmentControls } from './HorizontalEnvironmentControls';
import { HorizontalExportControls } from './HorizontalExportControls';

interface BottomDrawerCustomizePanelProps {
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

export const BottomDrawerCustomizePanel: React.FC<BottomDrawerCustomizePanelProps> = ({
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
  const [activeTab, setActiveTab] = useState('presets');
  const [isOpen, setIsOpen] = useState(false);

  // Calculate active effects count
  const getActiveEffectsCount = useCallback(() => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  }, [effectValues]);

  const currentPresetName = "Custom"; // This could be enhanced to track actual preset

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Tab - Always visible at bottom */}
      <DrawerTrigger asChild>
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <Button
            variant="secondary"
            className="bg-black/80 backdrop-blur-lg border border-white/20 text-white hover:bg-black/90 px-6 py-3 rounded-full shadow-lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Enhanced Studio
            <ChevronUp className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DrawerTrigger>

      {/* Drawer Content */}
      <DrawerContent className="h-[70vh] bg-black/95 backdrop-blur-lg border-t border-white/20">
        <DrawerHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="w-5 h-5 text-crd-green" />
              <DrawerTitle className="text-white text-lg font-semibold">
                Enhanced Studio Control Board
              </DrawerTitle>
              <div className="text-sm text-crd-lightGray">
                Scene: {selectedScene.name} • Effects: {getActiveEffectsCount()} active
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Horizontal Tabs Layout */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-12 px-6">
              <TabsTrigger 
                value="presets" 
                className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black px-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Visual Presets
              </TabsTrigger>
              <TabsTrigger 
                value="environment" 
                className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6"
              >
                <Sun className="w-4 h-4 mr-2" />
                Environment
              </TabsTrigger>
              <TabsTrigger 
                value="export" 
                className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-white px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Export & Save
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="flex-1 overflow-y-auto p-6">
              <HorizontalPresetSelection
                onEffectChange={onEffectChange}
                onResetAllEffects={onResetAllEffects}
              />
            </TabsContent>
            
            <TabsContent value="environment" className="flex-1 overflow-y-auto p-6">
              <HorizontalEnvironmentControls
                selectedScene={selectedScene}
                selectedLighting={selectedLighting}
                overallBrightness={overallBrightness}
                interactiveLighting={interactiveLighting}
                materialSettings={materialSettings}
                onSceneChange={onSceneChange}
                onLightingChange={onLightingChange}
                onBrightnessChange={onBrightnessChange}
                onInteractiveLightingToggle={onInteractiveLightingToggle}
                onMaterialSettingsChange={onMaterialSettingsChange}
              />
            </TabsContent>

            <TabsContent value="export" className="flex-1 overflow-y-auto p-6">
              <HorizontalExportControls
                card={card}
                selectedScene={selectedScene}
                selectedLighting={selectedLighting}
                activeEffectsCount={getActiveEffectsCount()}
                onDownload={onDownload || (() => {})}
                onShare={onShare || (() => {})}
                onResetAll={onResetAllEffects}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
