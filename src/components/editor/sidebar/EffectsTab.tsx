
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Sun, Palette, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface EffectsTabProps {
  searchQuery?: string;
  onEffectsComplete?: () => void;
}

export const EffectsTab = ({ searchQuery = '', onEffectsComplete }: EffectsTabProps) => {
  const [activeEffects, setActiveEffects] = useState<{[key: string]: boolean}>({});

  const effects = [
    { 
      id: 'holographic', 
      name: 'Holographic', 
      icon: Sparkles, 
      color: 'from-purple-500 to-cyan-500',
      description: 'Adds a shimmering holographic overlay'
    },
    { 
      id: 'neonGlow', 
      name: 'Neon Glow', 
      icon: Zap, 
      color: 'from-pink-500 to-purple-500',
      description: 'Creates a glowing neon border effect'
    },
    { 
      id: 'goldenHour', 
      name: 'Golden Hour', 
      icon: Sun, 
      color: 'from-orange-400 to-yellow-500',
      description: 'Warm golden lighting effect'
    },
    { 
      id: 'vintage', 
      name: 'Vintage Film', 
      icon: Palette, 
      color: 'from-amber-600 to-orange-600',
      description: 'Classic film grain and color grading'
    },
    { 
      id: 'chromatic', 
      name: 'Chromatic', 
      icon: Eye, 
      color: 'from-red-500 via-green-500 to-blue-500',
      description: 'RGB color separation effect'
    }
  ];

  const filteredEffects = effects.filter(effect => 
    effect.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEffectToggle = (effectId: string) => {
    const newState = !activeEffects[effectId];
    setActiveEffects(prev => ({ ...prev, [effectId]: newState }));
    
    // Send effect change to main preview
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: effectId, enabled: newState }
    }));
    
    toast.success(`${effects.find(e => e.id === effectId)?.name} ${newState ? 'enabled' : 'disabled'}`);
  };

  const handleIntensityChange = (effectId: string, intensity: number) => {
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: `${effectId}Intensity`, value: intensity }
    }));
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Visual Effects</h3>
          <p className="text-crd-lightGray text-sm">
            Add stunning visual effects to your card
          </p>
        </div>

        {/* Quick Adjustments */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Quick Adjustments</h4>
          <div className="space-y-3">
            <div>
              <label className="text-white text-xs font-medium">Overall Brightness</label>
              <input
                type="range"
                min="50"
                max="150"
                defaultValue="100"
                onChange={(e) => {
                  window.dispatchEvent(new CustomEvent('effectChange', {
                    detail: { effectType: 'brightness', value: parseInt(e.target.value) }
                  }));
                }}
                className="w-full mt-1 accent-crd-green"
              />
            </div>
            <div>
              <label className="text-white text-xs font-medium">Contrast</label>
              <input
                type="range"
                min="50"
                max="150"
                defaultValue="100"
                onChange={(e) => {
                  window.dispatchEvent(new CustomEvent('effectChange', {
                    detail: { effectType: 'contrast', value: parseInt(e.target.value) }
                  }));
                }}
                className="w-full mt-1 accent-crd-green"
              />
            </div>
          </div>
        </div>

        {/* Visual Effects */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Visual Effects</h4>
          <div className="space-y-3">
            {filteredEffects.map((effect) => (
              <div key={effect.id} className="space-y-2">
                <div 
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    activeEffects[effect.id] 
                      ? 'border-crd-green bg-crd-green/10' 
                      : 'border-editor-border bg-editor-tool hover:border-crd-green/50'
                  }`}
                  onClick={() => handleEffectToggle(effect.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${effect.color} flex items-center justify-center`}>
                      <effect.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium text-sm">{effect.name}</h5>
                      <p className="text-crd-lightGray text-xs">{effect.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      activeEffects[effect.id] 
                        ? 'border-crd-green bg-crd-green' 
                        : 'border-gray-400'
                    }`}>
                      {activeEffects[effect.id] && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Intensity slider for active effects */}
                {activeEffects[effect.id] && (
                  <div className="ml-11 mr-4">
                    <label className="text-crd-lightGray text-xs">Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      onChange={(e) => handleIntensityChange(effect.id, parseInt(e.target.value))}
                      className="w-full mt-1 accent-crd-green"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preset Combinations */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Effect Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Cyberpunk', effects: ['neonGlow', 'chromatic'] },
              { name: 'Retro Wave', effects: ['holographic', 'vintage'] },
              { name: 'Warm Glow', effects: ['goldenHour'] },
              { name: 'Clean', effects: [] }
            ].map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  // Reset all effects
                  setActiveEffects({});
                  // Apply preset effects
                  const newEffects: {[key: string]: boolean} = {};
                  preset.effects.forEach(effectId => {
                    newEffects[effectId] = true;
                    window.dispatchEvent(new CustomEvent('effectChange', {
                      detail: { effectType: effectId, enabled: true }
                    }));
                  });
                  setActiveEffects(newEffects);
                  toast.success(`${preset.name} preset applied`);
                }}
                className="border-editor-border text-white hover:bg-crd-green hover:text-black"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Preview Note */}
        <div className="bg-editor-tool p-4 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-2">Live Preview</h4>
          <p className="text-crd-lightGray text-xs">
            All effects are applied in real-time to the center preview. Toggle effects on/off to see the changes instantly.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};
