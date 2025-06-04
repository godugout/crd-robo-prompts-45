
import React from 'react';
import { 
  Settings,
  Download,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@/components/ui/drawer';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { QuickEffectsPresets } from './QuickEffectsPresets';
import { EnvironmentScenes } from './EnvironmentScenes';
import { LightingPresets } from './LightingPresets';
import { DrawerTrigger } from './DrawerTrigger';
import { TopTrigger } from './TopTrigger';
import { useDrawerState } from '../hooks/useDrawerState';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

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
  useTopTrigger?: boolean; // New prop for testing
}

export const CompactBottomDrawer: React.FC<CompactBottomDrawerProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onDownload,
  card,
  useTopTrigger = true // Default to true for testing
}) => {
  const { isOpen, setIsOpen, getActiveEffectsCount } = useDrawerState();
  const { isDesktop } = useResponsiveLayout();

  const activeEffectsCount = getActiveEffectsCount(effectValues);

  console.log('CompactBottomDrawer render:', { isOpen, activeEffectsCount, useTopTrigger });

  // Responsive height - smaller on desktop for better card visibility
  const drawerHeight = isDesktop ? 'h-[45vh]' : 'h-[70vh]';

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {/* Conditional Trigger - Top or Bottom */}
        {useTopTrigger ? (
          <TopTrigger 
            selectedScene={selectedScene}
            activeEffectsCount={activeEffectsCount}
          />
        ) : (
          <DrawerTrigger 
            selectedScene={selectedScene}
            activeEffectsCount={activeEffectsCount}
          />
        )}

        {/* Drawer Content with ultra-high z-index for testing */}
        <DrawerContent className={`${drawerHeight} bg-black/95 backdrop-blur-lg border-t border-white/20 z-[10001]`}>
          <DrawerHeader className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white text-xl font-semibold flex items-center">
                <Settings className="w-6 h-6 mr-3 text-crd-green" />
                Enhanced Studio {useTopTrigger && <span className="text-xs ml-2 text-crd-green">(Top Trigger - Testing)</span>}
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

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Quick Effects Presets */}
            <QuickEffectsPresets onEffectChange={onEffectChange} />

            {/* Environment Scenes */}
            <EnvironmentScenes 
              selectedScene={selectedScene}
              onSceneChange={onSceneChange}
            />

            {/* Lighting Presets */}
            <LightingPresets 
              selectedLighting={selectedLighting}
              onLightingChange={onLightingChange}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
