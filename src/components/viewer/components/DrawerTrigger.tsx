
import React from 'react';
import { Settings, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrawerTrigger as BaseDrawerTrigger } from '@/components/ui/drawer';
import type { EnvironmentScene } from '../types';

interface DrawerTriggerProps {
  selectedScene: EnvironmentScene;
  activeEffectsCount: number;
}

export const DrawerTrigger: React.FC<DrawerTriggerProps> = ({
  selectedScene,
  activeEffectsCount
}) => {
  const currentStatusText = activeEffectsCount > 0 
    ? `${activeEffectsCount} effects active`
    : 'No effects';

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
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
          <ChevronUp className="w-5 h-5 ml-3 text-crd-green" />
        </Button>
      </BaseDrawerTrigger>
    </div>
  );
};
