
import React from 'react';
import { Button } from '@/components/ui/button';
import type { EnvironmentScene } from '../types';
import { ENVIRONMENT_SCENES } from '../constants';

interface EnvironmentComboSectionProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
}

export const EnvironmentComboSection: React.FC<EnvironmentComboSectionProps> = ({
  selectedScene,
  onSceneChange
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {ENVIRONMENT_SCENES.map((scene) => (
          <Button
            key={scene.id}
            onClick={() => onSceneChange(scene)}
            variant={selectedScene.id === scene.id ? "default" : "outline"}
            className={`h-auto p-3 flex flex-col items-center space-y-1 ${
              selectedScene.id === scene.id
                ? 'bg-crd-green text-black border-crd-green'
                : 'border-editor-border hover:border-crd-green hover:bg-crd-green/10'
            }`}
          >
            <span className="text-lg">{scene.icon}</span>
            <span className="text-xs font-medium">{scene.name}</span>
            <span className="text-xs text-center leading-tight opacity-70">
              {scene.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
