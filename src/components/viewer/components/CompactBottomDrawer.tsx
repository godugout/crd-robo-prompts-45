
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
  useTopTrigger?: boolean;
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
  useTopTrigger = true
}) => {
  const { isOpen, setIsOpen, getActiveEffectsCount } = useDrawerState();
  const { isDesktop } = useResponsiveLayout();

  const activeEffectsCount = getActiveEffectsCount(effectValues);

  console.log('CompactBottomDrawer render:', { isOpen, activeEffectsCount, useTopTrigger });

  // More compact height for top drawer - reduced from previous values
  const drawerHeight = isDesktop ? 'h-[35vh]' : 'h-[50vh]';
  
  // Position from top instead of bottom when using TopTrigger
  const drawerPosition = useTopTrigger ? 'top-0 inset-x-0 rounded-b-[10px]' : 'inset-x-0 bottom-0 rounded-t-[10px]';

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

        {/* Drawer Content with position based on trigger type */}
        <DrawerContent 
          className={`${drawerHeight} bg-black/95 backdrop-blur-lg border-b border-white/20 z-[10001] fixed ${drawerPosition}`}
          style={{ transform: useTopTrigger ? 'translateY(0)' : undefined }}
        >
          <DrawerHeader className="border-b border-white/10 p-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white text-lg font-semibold flex items-center">
                <Settings className="w-5 h-5 mr-2 text-crd-green" />
                Enhanced Studio
              </DrawerTitle>
              <div className="flex items-center space-x-3">
                {onDownload && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(card)}
                    className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black transition-colors h-8 py-0"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Export
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-7 w-7 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick Effects Presets - More compact layout */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Quick Effects</h3>
              <QuickEffectsPresets onEffectChange={onEffectChange} />
            </div>

            {/* Environment Scenes - More compact layout */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Environments</h3>
              <EnvironmentScenes 
                selectedScene={selectedScene}
                onSceneChange={onSceneChange}
              />
            </div>

            {/* Lighting Presets - More compact layout */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Lighting</h3>
              <LightingPresets 
                selectedLighting={selectedLighting}
                onLightingChange={onLightingChange}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
