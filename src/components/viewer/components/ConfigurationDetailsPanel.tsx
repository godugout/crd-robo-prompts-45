
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info, X, Eye, EyeOff } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { useDynamicCardBackMaterials } from '../hooks/useDynamicCardBackMaterials';

interface ConfigurationDetailsPanelProps {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
}

export const ConfigurationDetailsPanel: React.FC<ConfigurationDetailsPanelProps> = ({
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { selectedMaterial } = useDynamicCardBackMaterials(effectValues);

  // Get active effects with their intensities
  const activeEffects = Object.entries(effectValues || {})
    .filter(([_, params]) => params && typeof params.intensity === 'number' && params.intensity > 0)
    .map(([effectId, params]) => ({
      id: effectId,
      name: effectId.charAt(0).toUpperCase() + effectId.slice(1),
      intensity: params.intensity as number
    }))
    .sort((a, b) => b.intensity - a.intensity);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          variant="ghost"
          size="sm"
          className="bg-black bg-opacity-60 hover:bg-opacity-80 backdrop-blur border border-white/20 text-white"
        >
          <Info className="w-4 h-4 mr-2" />
          Config
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 max-h-96 overflow-y-auto">
      <div className="bg-black bg-opacity-90 backdrop-blur-lg rounded-lg border border-white/20 text-white text-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="font-medium">Configuration Details</span>
          </div>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 hover:bg-white/10"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-4">
          {/* Active Effects */}
          <div>
            <h4 className="font-medium text-blue-400 mb-2 flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              Active Effects ({activeEffects.length})
            </h4>
            {activeEffects.length > 0 ? (
              <div className="space-y-1">
                {activeEffects.map(effect => (
                  <div key={effect.id} className="flex justify-between items-center">
                    <span className="text-gray-300">{effect.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-400 transition-all duration-300"
                          style={{ width: `${effect.intensity}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">
                        {effect.intensity}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-xs">No effects active</p>
            )}
          </div>

          {/* Card Back Material */}
          <div>
            <h4 className="font-medium text-purple-400 mb-2">Card Back Material</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Material:</span>
                <span className="text-purple-300 font-medium">{selectedMaterial.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Opacity:</span>
                <span className="text-gray-400">{Math.round(selectedMaterial.opacity * 100)}%</span>
              </div>
              {selectedMaterial.blur && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Blur:</span>
                  <span className="text-gray-400">{selectedMaterial.blur}px</span>
                </div>
              )}
              {selectedMaterial.texture && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Texture:</span>
                  <span className="text-gray-400 capitalize">{selectedMaterial.texture}</span>
                </div>
              )}
            </div>
          </div>

          {/* Environment Settings */}
          <div>
            <h4 className="font-medium text-green-400 mb-2">Environment</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Scene:</span>
                <span className="text-green-300">{selectedScene.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Lighting:</span>
                <span className="text-green-300">{selectedLighting.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Brightness:</span>
                <span className="text-gray-400">{overallBrightness[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Interactive Lighting:</span>
                <div className="flex items-center">
                  {interactiveLighting ? (
                    <Eye className="w-3 h-3 text-green-400" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-gray-500" />
                  )}
                  <span className="text-gray-400 ml-1">
                    {interactiveLighting ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Material Properties */}
          <div>
            <h4 className="font-medium text-orange-400 mb-2">Material Properties</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Roughness:</span>
                <span className="text-gray-400">{Math.round(materialSettings.roughness * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Metalness:</span>
                <span className="text-gray-400">{Math.round(materialSettings.metalness * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Clearcoat:</span>
                <span className="text-gray-400">{Math.round(materialSettings.clearcoat * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Reflectivity:</span>
                <span className="text-gray-400">{Math.round(materialSettings.reflectivity * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
