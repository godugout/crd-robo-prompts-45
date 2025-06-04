
import React from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrawerTrigger as BaseDrawerTrigger } from '@/components/ui/drawer';
import type { EnvironmentScene } from '../types';

interface TopTriggerProps {
  selectedScene: EnvironmentScene;
  activeEffectsCount: number;
}

export const TopTrigger: React.FC<TopTriggerProps> = ({
  selectedScene,
  activeEffectsCount
}) => {
  const currentStatusText = activeEffectsCount > 0 
    ? `${activeEffectsCount} effects active`
    : 'No effects';

  return (
    <div className="fixed top-6 right-6 z-[10000]">
      <BaseDrawerTrigger asChild>
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
          <ChevronDown className="w-5 h-5 ml-3 text-crd-green" />
        </Button>
      </BaseDrawerTrigger>
    </div>
  );
};
