
import React from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrawerTrigger as BaseDrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import type { EnvironmentScene } from '../types';

interface TopTriggerProps {
  selectedScene: EnvironmentScene;
  activeEffectsCount: number;
}

export const TopTrigger: React.FC<TopTriggerProps> = ({
  selectedScene,
  activeEffectsCount
}) => {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[10000]">
      <BaseDrawerTrigger asChild>
        <Button
          variant="secondary"
          className="bg-black/80 backdrop-blur-lg border border-crd-green/30 text-white hover:bg-black/95 hover:border-crd-green/50 px-4 py-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
          size="sm"
        >
          <Settings className="w-4 h-4 mr-2 text-crd-green" />
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm">Enhanced Studio</span>
            <span className="text-xs text-gray-400">
              {selectedScene.name}
              {activeEffectsCount > 0 && (
                <Badge variant="outline" className="ml-1.5 py-0 h-4 border-crd-green/30 text-crd-green">
                  {activeEffectsCount} effect{activeEffectsCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 ml-2 text-crd-green" />
        </Button>
      </BaseDrawerTrigger>
    </div>
  );
};
