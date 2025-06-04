
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

  // Much more compact height - significantly reduced
  const drawerHeight = isDesktop ? 'h-[25vh]' : 'h-[30vh]';
  
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

        {/* Drawer Content with much more compact sizing */}
        <DrawerContent 
          className={`${drawerHeight} bg-black/95 backdrop-blur-lg border-b border-white/20 z-[10001] fixed ${drawerPosition}`}
          style={{ transform: useTopTrigger ? 'translateY(0)' : undefined }}
        >
          <DrawerHeader className="border-b border-white/10 p-2">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white text-base font-semibold flex items-center">
                <Settings className="w-4 h-4 mr-2 text-crd-green" />
                Enhanced Studio
              </DrawerTitle>
              <div className="flex items-center space-x-2">
                {onDownload && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(card)}
                    className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black transition-colors h-7 py-0 px-2 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-6 w-6 p-0">
                    <X className="w-3 h-3" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Quick Effects Presets - Very compact */}
            <div>
              <h3 className="text-xs font-medium text-white mb-1">Quick Effects</h3>
              <QuickEffectsPresets onEffectChange={onEffectChange} />
            </div>

            {/* Environment Scenes - Very compact */}
            <div>
              <h3 className="text-xs font-medium text-white mb-1">Environments</h3>
              <EnvironmentScenes 
                selectedScene={selectedScene}
                onSceneChange={onSceneChange}
              />
            </div>

            {/* Lighting Presets - Very compact */}
            <div>
              <h3 className="text-xs font-medium text-white mb-1">Lighting</h3>
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
