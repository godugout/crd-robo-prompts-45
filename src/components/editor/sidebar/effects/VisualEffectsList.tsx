
import React, { useState } from 'react';
import { Sparkles, Zap, Sun, Palette, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { EffectItem } from './EffectItem';

interface VisualEffectsListProps {
  searchQuery: string;
}

export const VisualEffectsList = ({ searchQuery }: VisualEffectsListProps) => {
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
    <div className="space-y-4">
      <h4 className="text-white font-medium text-sm uppercase tracking-wide">Visual Effects</h4>
      <div className="space-y-3">
        {filteredEffects.map((effect) => (
          <EffectItem
            key={effect.id}
            id={effect.id}
            name={effect.name}
            icon={effect.icon}
            color={effect.color}
            description={effect.description}
            isActive={activeEffects[effect.id] || false}
            onToggle={handleEffectToggle}
            onIntensityChange={handleIntensityChange}
          />
        ))}
      </div>
    </div>
  );
};
