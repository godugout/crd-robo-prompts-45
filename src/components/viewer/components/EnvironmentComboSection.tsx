
import React from 'react';
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
    <div className="grid grid-cols-2 gap-2">
      {ENVIRONMENT_SCENES.map((scene) => (
        <button
          key={scene.id}
          onClick={() => onSceneChange(scene)}
          className={`aspect-square rounded-lg p-2 transition-all ${
            selectedScene.id === scene.id 
              ? 'ring-2 ring-crd-green scale-105' 
              : 'hover:scale-102'
          }`}
          style={{
            background: `linear-gradient(135deg, ${scene.gradient.split(' ').join(', ')})`
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-white">
            <span className="text-lg mb-1">{scene.icon}</span>
            <span className="text-xs font-medium text-center leading-tight">{scene.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
