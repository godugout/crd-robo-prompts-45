
import React from 'react';
import { Sun } from 'lucide-react';
import { ENVIRONMENT_SCENES } from '../constants';
import type { EnvironmentScene } from '../types';

interface EnvironmentScenesProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
}

export const EnvironmentScenes: React.FC<EnvironmentScenesProps> = ({
  selectedScene,
  onSceneChange
}) => {
  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
        <Sun className="w-5 h-5 mr-2 text-blue-400" />
        Environments
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {ENVIRONMENT_SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSceneChange(scene)}
            className={`aspect-square rounded-lg p-3 transition-all hover:scale-105 ${
              selectedScene.id === scene.id 
                ? 'ring-2 ring-blue-500 scale-105' 
                : ''
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
  );
};
