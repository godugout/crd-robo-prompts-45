
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, Save, Sparkles, Sun, Moon, Zap } from 'lucide-react';

interface SceneEffects {
  lighting: string;
  atmosphere: string;
  style: string;
}

interface FinalSceneStepProps {
  cardData: any;
  sceneEffects?: SceneEffects;
  onSceneEffectsChange: (effects: SceneEffects) => void;
  onComplete: () => void;
}

const LIGHTING_OPTIONS = [
  { id: 'natural', name: 'Natural', icon: Sun, preview: '☀️' },
  { id: 'dramatic', name: 'Dramatic', icon: Moon, preview: '🌙' },
  { id: 'studio', name: 'Studio', icon: Zap, preview: '💡' }
];

const ATMOSPHERE_OPTIONS = [
  { id: 'clean', name: 'Clean', preview: '✨' },
  { id: 'vintage', name: 'Vintage', preview: '📸' },
  { id: 'futuristic', name: 'Futuristic', preview: '🔮' }
];

const STYLE_OPTIONS = [
  { id: 'realistic', name: 'Realistic', preview: '📷' },
  { id: 'enhanced', name: 'Enhanced', preview: '🎨' },
  { id: 'artistic', name: 'Artistic', preview: '🖼️' }
];

export const FinalSceneStep: React.FC<FinalSceneStepProps> = ({
  cardData,
  sceneEffects = { lighting: 'natural', atmosphere: 'clean', style: 'realistic' },
  onSceneEffectsChange,
  onComplete
}) => {
  const [selectedLighting, setSelectedLighting] = useState(sceneEffects.lighting);
  const [selectedAtmosphere, setSelectedAtmosphere] = useState(sceneEffects.atmosphere);
  const [selectedStyle, setSelectedStyle] = useState(sceneEffects.style);

  const updateEffects = (updates: Partial<SceneEffects>) => {
    const newEffects = { ...sceneEffects, ...updates };
    onSceneEffectsChange(newEffects);
  };

  const handleLightingChange = (lighting: string) => {
    setSelectedLighting(lighting);
    updateEffects({ lighting });
  };

  const handleAtmosphereChange = (atmosphere: string) => {
    setSelectedAtmosphere(atmosphere);
    updateEffects({ atmosphere });
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    updateEffects({ style });
  };

  return (
    <div className="flex h-full">
      {/* Effects Controls */}
      <div className="w-80 bg-editor-dark border-r border-editor-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Final Scene & Effects</h3>
          <p className="text-gray-400 text-sm">
            Apply final touches to create the perfect presentation for your card.
          </p>
        </div>

        <div className="space-y-6">
          {/* Lighting */}
          <div>
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Lighting
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {LIGHTING_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleLightingChange(option.id)}
                  variant={selectedLighting === option.id ? 'default' : 'outline'}
                  className={`justify-start ${
                    selectedLighting === option.id
                      ? 'bg-crd-green text-black'
                      : 'border-gray-600 text-white hover:bg-editor-border'
                  }`}
                >
                  <span className="mr-2">{option.preview}</span>
                  {option.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Atmosphere */}
          <div>
            <h4 className="text-white font-medium mb-3">Atmosphere</h4>
            <div className="grid grid-cols-1 gap-2">
              {ATMOSPHERE_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleAtmosphereChange(option.id)}
                  variant={selectedAtmosphere === option.id ? 'default' : 'outline'}
                  className={`justify-start ${
                    selectedAtmosphere === option.id
                      ? 'bg-crd-green text-black'
                      : 'border-gray-600 text-white hover:bg-editor-border'
                  }`}
                >
                  <span className="mr-2">{option.preview}</span>
                  {option.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <h4 className="text-white font-medium mb-3">Style</h4>
            <div className="grid grid-cols-1 gap-2">
              {STYLE_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleStyleChange(option.id)}
                  variant={selectedStyle === option.id ? 'default' : 'outline'}
                  className={`justify-start ${
                    selectedStyle === option.id
                      ? 'bg-crd-green text-black'
                      : 'border-gray-600 text-white hover:bg-editor-border'
                  }`}
                >
                  <span className="mr-2">{option.preview}</span>
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final Preview & Actions */}
      <div className="flex-1 p-6">
        <div className="flex flex-col h-full">
          {/* Final Preview */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <Card className="aspect-[5/7] w-80 bg-gray-800 border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800"></div>
              
              {/* Visual effect indicators */}
              <div className="absolute top-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
                {selectedLighting} • {selectedAtmosphere} • {selectedStyle}
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-crd-green" />
                  <p className="text-sm">Final Card Preview</p>
                  <p className="text-xs mt-1">With applied effects</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-2">Your Card is Ready!</h4>
              <p className="text-gray-400">What would you like to do next?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-crd-green text-black hover:bg-crd-green/90">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={onComplete}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Publish Card
              </Button>
            </div>

            <Button variant="outline" className="w-full border-gray-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download High-Res
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
