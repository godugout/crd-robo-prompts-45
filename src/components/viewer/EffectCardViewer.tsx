
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

type ComboType = 'holographic' | 'prizm' | 'crystal' | 'vintage' | 'golden' | 'ice' | 'solar' | 'lunar' | 'starlight';

interface CardState {
  activeCombo: ComboType;
  effects: {
    holographic: number;
    foilSpray: number;
    prizm: number;
    chrome: number;
    interference: number;
    brushedMetal: number;
    crystal: number;
    vintage: number;
  };
}

const COMBO_PRESETS = {
  holographic: { holographic: 85, foilSpray: 0, prizm: 0, chrome: 45, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 },
  prizm: { holographic: 0, foilSpray: 0, prizm: 70, chrome: 0, interference: 0, brushedMetal: 55, crystal: 0, vintage: 0 },
  crystal: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 0, interference: 60, brushedMetal: 0, crystal: 80, vintage: 0 },
  vintage: { holographic: 0, foilSpray: 50, prizm: 0, chrome: 0, interference: 0, brushedMetal: 0, crystal: 0, vintage: 65 },
  golden: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 35, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 },
  ice: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 35, interference: 45, brushedMetal: 0, crystal: 70, vintage: 0 },
  solar: { holographic: 60, foilSpray: 0, prizm: 0, chrome: 0, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 },
  lunar: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 0, interference: 45, brushedMetal: 0, crystal: 0, vintage: 35 },
  starlight: { holographic: 0, foilSpray: 65, prizm: 40, chrome: 0, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 }
};

const COMBO_DESCRIPTIONS = {
  holographic: 'Classic iridescent effect',
  prizm: 'Geometric prismatic patterns',
  crystal: 'Transparent crystalline finish',
  vintage: 'Aged metallic patina',
  golden: 'Rich gold leaf surface',
  ice: 'Frosted crystal with cool tones',
  solar: 'Warm golden radiance',
  lunar: 'Cool silver moonlight glow',
  starlight: 'Celestial sparkle field'
};

export const EffectCardViewer = () => {
  const [cardState, setCardState] = useState<CardState>({
    activeCombo: 'solar',
    effects: {
      holographic: 60,
      foilSpray: 0,
      prizm: 0,
      chrome: 0,
      interference: 0,
      brushedMetal: 0,
      crystal: 0,
      vintage: 0
    }
  });

  const applyCombo = (combo: ComboType) => {
    setCardState(prev => ({
      ...prev,
      activeCombo: combo,
      effects: { ...prev.effects, ...COMBO_PRESETS[combo] }
    }));
  };

  const updateEffect = (effectName: keyof CardState['effects'], value: number) => {
    setCardState(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectName]: value
      }
    }));
  };

  const resetEffect = (effectName: keyof CardState['effects']) => {
    updateEffect(effectName, 0);
  };

  const getMaterialStyle = () => {
    const { activeCombo, effects } = cardState;
    let baseStyle = {};

    switch (activeCombo) {
      case 'solar':
        baseStyle = {
          background: 'linear-gradient(45deg, #ffcc00, #ff8c00, #ffd700)',
          boxShadow: '0 0 30px rgba(255, 204, 0, 0.6)',
        };
        break;
      case 'holographic':
        baseStyle = {
          background: 'linear-gradient(45deg, #ff0080, #0080ff, #00ff80, #ff8000)',
          backgroundSize: '400% 400%',
          animation: 'holographicShift 3s ease-in-out infinite',
        };
        break;
      case 'lunar':
        baseStyle = {
          background: 'linear-gradient(45deg, #c0c0c0, #e6e6fa, #b0c4de)',
          boxShadow: '0 0 25px rgba(192, 192, 192, 0.5)',
        };
        break;
      // Add other combo styles...
      default:
        baseStyle = {
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
        };
    }

    // Apply holographic overlay if active
    if (effects.holographic > 0) {
      const intensity = effects.holographic / 100;
      baseStyle = {
        ...baseStyle,
        background: `
          linear-gradient(45deg, 
            rgba(255, 0, 128, ${intensity * 0.3}), 
            rgba(0, 128, 255, ${intensity * 0.3}), 
            rgba(0, 255, 128, ${intensity * 0.3}), 
            rgba(255, 128, 0, ${intensity * 0.3})
          ),
          ${baseStyle.background || 'linear-gradient(45deg, #667eea, #764ba2)'}
        `,
      };
    }

    return baseStyle;
  };

  const effectsConfig = [
    { name: 'holographic', label: 'Holographic', color: 'bg-purple-500' },
    { name: 'foilSpray', label: 'Foil Spray', color: 'bg-blue-500' },
    { name: 'prizm', label: 'Prizm', color: 'bg-pink-500' },
    { name: 'chrome', label: 'Chrome', color: 'bg-gray-400' },
    { name: 'interference', label: 'Interference', color: 'bg-cyan-500' },
    { name: 'brushedMetal', label: 'Brushed Metal', color: 'bg-amber-600' },
    { name: 'crystal', label: 'Crystal', color: 'bg-blue-400' },
    { name: 'vintage', label: 'Vintage', color: 'bg-orange-500' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card Display Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardContent className="p-8 flex items-center justify-center">
                <div className="relative">
                  {/* Card Container */}
                  <div 
                    className="w-80 h-[448px] rounded-lg shadow-2xl transition-all duration-300 relative overflow-hidden"
                    style={getMaterialStyle()}
                  >
                    {/* Card Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">EZ-ETH</h2>
                        <div className="w-32 h-32 mx-auto bg-black/20 rounded-lg flex items-center justify-center mb-4">
                          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded" />
                          </div>
                        </div>
                        <p className="text-sm opacity-90">Character wearing purple hoodie and sunglasses</p>
                      </div>
                      <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-yellow-500 text-black font-bold rounded">
                          LEGENDARY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            
            {/* Quick Combos Panel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4">Quick Combos</h3>
                <div className="space-y-2">
                  {Object.entries(COMBO_DESCRIPTIONS).map(([combo, description]) => (
                    <Button
                      key={combo}
                      onClick={() => applyCombo(combo as ComboType)}
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto p-3 ${
                        cardState.activeCombo === combo 
                          ? 'bg-green-500/20 border border-green-500 text-green-400' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium capitalize">{combo}</div>
                        <div className="text-xs opacity-70">{description}</div>
                      </div>
                      {cardState.activeCombo === combo && (
                        <span className="ml-auto text-green-400">✓</span>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Effects Panel */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4">Effects</h3>
                <div className="space-y-4">
                  {effectsConfig.map(({ name, label, color }) => {
                    const value = cardState.effects[name as keyof CardState['effects']];
                    return (
                      <div key={name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <span className="text-white text-sm font-medium">{label}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-xs w-8 text-right">
                              {value}%
                            </span>
                            <Button
                              onClick={() => resetEffect(name as keyof CardState['effects'])}
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([newValue]) => updateEffect(name as keyof CardState['effects'], newValue)}
                          min={0}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes holographicShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};
