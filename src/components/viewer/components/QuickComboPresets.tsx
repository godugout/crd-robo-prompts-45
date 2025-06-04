
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Sparkles, 
  Zap, 
  Gem, 
  Clock, 
  Flame, 
  Snowflake, 
  Sun, 
  Moon, 
  Star, 
  User,
  Crown,
  Diamond,
  Shield,
  Atom,
  Palette,
  Award,
  Lock
} from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../types';

interface ComboPreset {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  effects: EffectValues;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
  isCustom?: boolean;
  tier: 'free' | 'premium';
  category?: 'prismatic' | 'metallic' | 'crystal' | 'vintage' | 'hybrid';
}

const COMBO_PRESETS: ComboPreset[] = [
  // FREE TIER (4 basic presets)
  {
    id: 'basic-holographic',
    name: 'Holographic',
    icon: Sparkles,
    description: 'Classic rainbow holographic shimmer',
    tier: 'free',
    category: 'prismatic',
    effects: {
      holographic: { intensity: 60, shiftSpeed: 120, rainbowSpread: 200, animated: true }
    }
  },
  {
    id: 'chrome-shine',
    name: 'Chrome',
    icon: Moon,
    description: 'Clean metallic chrome finish',
    tier: 'free',
    category: 'metallic',
    effects: {
      chrome: { intensity: 70, sharpness: 75, highlightSize: 50 }
    }
  },
  {
    id: 'vintage-card',
    name: 'Vintage',
    icon: Clock,
    description: 'Subtle aged patina look',
    tier: 'free',
    category: 'vintage',
    effects: {
      vintage: { intensity: 45, aging: 50, patina: '#8b7355' }
    }
  },
  {
    id: 'clear-reset',
    name: 'Clear',
    icon: Shield,
    description: 'No effects - clean card',
    tier: 'free',
    effects: {}
  },

  // PREMIUM TIER - PRISMATIC COLLECTION
  {
    id: 'rainbow-prizm',
    name: 'Rainbow Prizm',
    icon: Palette,
    description: 'Intense prismatic colors with holographic depth',
    tier: 'premium',
    category: 'prismatic',
    effects: {
      prizm: { intensity: 75, complexity: 8, colorSeparation: 85 },
      holographic: { intensity: 45, shiftSpeed: 140, rainbowSpread: 260, animated: true },
      crystal: { intensity: 25, facets: 6, dispersion: 60 }
    }
  },
  {
    id: 'crystal-prizm-fusion',
    name: 'Crystal Fusion',
    icon: Gem,
    description: 'Crystalline facets with prismatic dispersion',
    tier: 'premium',
    category: 'prismatic',
    effects: {
      prizm: { intensity: 60, complexity: 6, colorSeparation: 75 },
      crystal: { intensity: 80, facets: 12, dispersion: 85 },
      chrome: { intensity: 35, sharpness: 80, highlightSize: 40 }
    }
  },
  {
    id: 'spectrum-shift',
    name: 'Spectrum Shift',
    icon: Zap,
    description: 'Maximum color separation with interference waves',
    tier: 'premium',
    category: 'prismatic',
    effects: {
      prizm: { intensity: 85, complexity: 9, colorSeparation: 95 },
      interference: { intensity: 40, frequency: 12, thickness: 3 }
    }
  },
  {
    id: 'aurora-beam',
    name: 'Aurora Beam',
    icon: Star,
    description: 'Directional prismatic flow with metallic spray',
    tier: 'premium',
    category: 'prismatic',
    effects: {
      prizm: { intensity: 55, complexity: 7, colorSeparation: 70 },
      foilspray: { intensity: 35, density: 65, direction: 135 }
    }
  },

  // PREMIUM TIER - METALLIC LUXURY COLLECTION
  {
    id: 'platinum-chrome',
    name: 'Platinum Chrome',
    icon: Crown,
    description: 'Ultra-luxury chrome with brushed accents',
    tier: 'premium',
    category: 'metallic',
    effects: {
      chrome: { intensity: 90, sharpness: 85, highlightSize: 55 },
      brushedmetal: { intensity: 40, direction: 45, grainDensity: 8 },
      holographic: { intensity: 20, shiftSpeed: 80, rainbowSpread: 150, animated: true }
    }
  },
  {
    id: 'gold-dynasty',
    name: 'Gold Dynasty',
    icon: Award,
    description: 'Luxurious gold with vintage character',
    tier: 'premium',
    category: 'metallic',
    effects: {
      gold: { intensity: 85, shimmerSpeed: 90, platingThickness: 6, goldTone: 'rich', reflectivity: 85 },
      vintage: { intensity: 30, aging: 40, patina: '#b8860b' },
      chrome: { intensity: 25, sharpness: 70, highlightSize: 35 }
    }
  },
  {
    id: 'silver-storm',
    name: 'Silver Storm',
    icon: Snowflake,
    description: 'Dynamic silver with crystal clarity',
    tier: 'premium',
    category: 'metallic',
    effects: {
      chrome: { intensity: 70, sharpness: 90, highlightSize: 45 },
      foilspray: { intensity: 60, density: 70, direction: 90 },
      crystal: { intensity: 35, facets: 8, dispersion: 50 }
    }
  },
  {
    id: 'titanium-edge',
    name: 'Titanium Edge',
    icon: Shield,
    description: 'Industrial brushed metal with chrome highlights',
    tier: 'premium',
    category: 'metallic',
    effects: {
      brushedmetal: { intensity: 75, direction: 30, grainDensity: 12 },
      chrome: { intensity: 50, sharpness: 85, highlightSize: 30 }
    }
  },

  // PREMIUM TIER - CRYSTAL CLARITY COLLECTION
  {
    id: 'diamond-clarity',
    name: 'Diamond Clarity',
    icon: Diamond,
    description: 'Flawless crystal with chrome precision',
    tier: 'premium',
    category: 'crystal',
    effects: {
      crystal: { intensity: 90, facets: 12, dispersion: 95 },
      chrome: { intensity: 60, sharpness: 95, highlightSize: 25 },
      prizm: { intensity: 20, complexity: 4, colorSeparation: 40 }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice Crystal',
    icon: Snowflake,
    description: 'Cool crystal with interference patterns',
    tier: 'premium',
    category: 'crystal',
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 75 },
      interference: { intensity: 35, frequency: 10, thickness: 2 }
    }
  },
  {
    id: 'fire-crystal',
    name: 'Fire Crystal',
    icon: Flame,
    description: 'Warm crystal with golden holographic tones',
    tier: 'premium',
    category: 'crystal',
    effects: {
      crystal: { intensity: 80, facets: 10, dispersion: 80 },
      gold: { intensity: 45, shimmerSpeed: 100, goldTone: 'rich' },
      holographic: { intensity: 30, shiftSpeed: 160, rainbowSpread: 180, animated: true }
    }
  },
  {
    id: 'mystic-crystal',
    name: 'Mystic Crystal',
    icon: Moon,
    description: 'Mysterious crystal with vintage prismatic hints',
    tier: 'premium',
    category: 'crystal',
    effects: {
      crystal: { intensity: 65, facets: 6, dispersion: 70 },
      vintage: { intensity: 25, aging: 35, patina: '#c0c0c0' },
      prizm: { intensity: 15, complexity: 3, colorSeparation: 30 }
    }
  },

  // PREMIUM TIER - VINTAGE PREMIUM COLLECTION
  {
    id: 'ancient-gold',
    name: 'Ancient Gold',
    icon: Crown,
    description: 'Aged gold with authentic patina and brushed texture',
    tier: 'premium',
    category: 'vintage',
    effects: {
      vintage: { intensity: 80, aging: 75, patina: '#daa520' },
      gold: { intensity: 60, shimmerSpeed: 60, goldTone: 'antique' },
      brushedmetal: { intensity: 20, direction: 60, grainDensity: 6 }
    }
  },
  {
    id: 'weathered-chrome',
    name: 'Weathered Chrome',
    icon: Shield,
    description: 'Aged chrome with subtle wear patterns',
    tier: 'premium',
    category: 'vintage',
    effects: {
      vintage: { intensity: 55, aging: 60, patina: '#a8a8a8' },
      chrome: { intensity: 40, sharpness: 60, highlightSize: 50 }
    }
  },

  // PREMIUM TIER - HYBRID EXPERIMENTALS (Ultra Premium)
  {
    id: 'cosmic-storm',
    name: 'Cosmic Storm',
    icon: Atom,
    description: 'Complex multi-effect interaction for ultimate visual impact',
    tier: 'premium',
    category: 'hybrid',
    effects: {
      holographic: { intensity: 35, shiftSpeed: 180, rainbowSpread: 300, animated: true },
      prizm: { intensity: 30, complexity: 5, colorSeparation: 50 },
      crystal: { intensity: 25, facets: 8, dispersion: 60 },
      chrome: { intensity: 30, sharpness: 70, highlightSize: 40 },
      interference: { intensity: 20, frequency: 8, thickness: 2 }
    }
  },
  {
    id: 'prism-overload',
    name: 'Prism Overload',
    icon: Zap,
    description: 'Maximum prismatic intensity with crystalline structure',
    tier: 'premium',
    category: 'hybrid',
    effects: {
      prizm: { intensity: 95, complexity: 10, colorSeparation: 100 },
      crystal: { intensity: 75, facets: 15, dispersion: 90 },
      holographic: { intensity: 55, shiftSpeed: 200, rainbowSpread: 360, animated: true }
    }
  },
  {
    id: 'metallic-rainbow',
    name: 'Metallic Rainbow',
    icon: Palette,
    description: 'Chrome base with intense prismatic overlay',
    tier: 'premium',
    category: 'hybrid',
    effects: {
      chrome: { intensity: 60, sharpness: 80, highlightSize: 45 },
      prizm: { intensity: 70, complexity: 7, colorSeparation: 80 },
      gold: { intensity: 25, shimmerSpeed: 120, goldTone: 'rich' }
    }
  },
  {
    id: 'interference-matrix',
    name: 'Interference Matrix',
    icon: Atom,
    description: 'Complex wave interference with crystal and metallic accents',
    tier: 'premium',
    category: 'hybrid',
    effects: {
      interference: { intensity: 80, frequency: 15, thickness: 4 },
      crystal: { intensity: 50, facets: 10, dispersion: 70 },
      foilspray: { intensity: 40, density: 80, direction: 45 }
    }
  }
];

interface QuickComboPresetsProps {
  onApplyCombo: (combo: ComboPreset) => void;
  currentEffects: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  isPremiumUser?: boolean; // Add premium access control
}

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ 
  onApplyCombo, 
  currentEffects, 
  selectedPresetId, 
  onPresetSelect,
  isPremiumUser = false // Default to free tier
}) => {
  // Filter presets based on user tier
  const availablePresets = COMBO_PRESETS.filter(preset => 
    preset.tier === 'free' || isPremiumUser
  );

  // Check if current effects match any preset
  const effectsMatchPreset = (presetEffects: EffectValues, currentEffects: EffectValues): boolean => {
    const presetKeys = Object.keys(presetEffects);
    const currentKeys = Object.keys(currentEffects).filter(key => {
      const effect = currentEffects[key];
      return effect && typeof effect.intensity === 'number' && effect.intensity > 0;
    });

    if (presetKeys.length !== currentKeys.length) return false;

    return presetKeys.every(key => {
      const preset = presetEffects[key];
      const current = currentEffects[key];
      if (!current || !preset) return false;
      
      const presetIntensity = typeof preset.intensity === 'number' ? preset.intensity : 0;
      const currentIntensity = typeof current.intensity === 'number' ? current.intensity : 0;
      return Math.abs(currentIntensity - presetIntensity) < 5;
    });
  };

  // Check if we have custom effects that don't match any preset
  const hasCustomEffects = (): boolean => {
    const hasActiveEffects = Object.values(currentEffects).some(effect => 
      effect && typeof effect.intensity === 'number' && effect.intensity > 0
    );
    
    if (!hasActiveEffects) return false;
    
    return !availablePresets.some(preset => effectsMatchPreset(preset.effects, currentEffects));
  };

  // Create custom preset from current effects
  const createCustomPreset = (): ComboPreset => ({
    id: 'user-custom',
    name: "Your Style",
    icon: User,
    description: 'Your custom effect combination',
    effects: currentEffects,
    isCustom: true,
    tier: 'free'
  });

  const allPresets = hasCustomEffects() ? [...availablePresets, createCustomPreset()] : availablePresets;

  const handlePresetClick = (preset: ComboPreset) => {
    // Check if premium preset is being accessed by free user
    if (preset.tier === 'premium' && !isPremiumUser) {
      // Show upgrade prompt or restrict access
      return;
    }
    
    onPresetSelect(preset.id);
    onApplyCombo(preset);
  };

  // Group presets by category for better organization
  const categorizedPresets = allPresets.reduce((acc, preset) => {
    if (preset.isCustom) {
      acc.custom = acc.custom || [];
      acc.custom.push(preset);
    } else if (preset.tier === 'free') {
      acc.free = acc.free || [];
      acc.free.push(preset);
    } else {
      const category = preset.category || 'other';
      acc[category] = acc[category] || [];
      acc[category].push(preset);
    }
    return acc;
  }, {} as Record<string, ComboPreset[]>);

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Free Tier Section */}
        {categorizedPresets.free && (
          <div className="space-y-1">
            <div className="text-xs text-crd-lightGray px-1 mb-2">Free Presets</div>
            {categorizedPresets.free.map((preset) => {
              const IconComponent = preset.icon;
              const isSelected = selectedPresetId === preset.id || 
                (!selectedPresetId && effectsMatchPreset(preset.effects, currentEffects));
              
              return (
                <Tooltip key={preset.id}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handlePresetClick(preset)}
                      variant="ghost"
                      className={`w-full h-7 px-2 flex items-center justify-start space-x-2 border transition-colors ${
                        isSelected 
                          ? 'bg-crd-green/30 border-crd-green text-white' 
                          : 'bg-editor-dark border-editor-border hover:border-crd-green hover:bg-crd-green/20'
                      } text-xs`}
                    >
                      <IconComponent className={`w-3 h-3 flex-shrink-0 ${
                        isSelected ? 'text-crd-green' : 'text-crd-green'
                      }`} />
                      <span className="font-medium truncate text-white">
                        {preset.name}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
                    <div className="text-center">
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-300">{preset.description}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* Premium Tier Sections */}
        {isPremiumUser && (
          <>
            {['prismatic', 'metallic', 'crystal', 'vintage', 'hybrid'].map(category => {
              if (!categorizedPresets[category]) return null;
              
              const categoryTitles = {
                prismatic: 'Prismatic Collection',
                metallic: 'Metallic Luxury',
                crystal: 'Crystal Clarity',
                vintage: 'Vintage Premium',
                hybrid: 'Hybrid Experimentals'
              };
              
              return (
                <div key={category} className="space-y-1">
                  <div className="text-xs text-amber-400 px-1 mb-2 flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    {categoryTitles[category as keyof typeof categoryTitles]}
                  </div>
                  {categorizedPresets[category].map((preset) => {
                    const IconComponent = preset.icon;
                    const isSelected = selectedPresetId === preset.id || 
                      (!selectedPresetId && effectsMatchPreset(preset.effects, currentEffects));
                    
                    return (
                      <Tooltip key={preset.id}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handlePresetClick(preset)}
                            variant="ghost"
                            className={`w-full h-7 px-2 flex items-center justify-start space-x-2 border transition-colors ${
                              isSelected 
                                ? 'bg-amber-500/30 border-amber-500 text-white' 
                                : 'bg-editor-dark border-amber-600/30 hover:border-amber-500 hover:bg-amber-500/20'
                            } text-xs`}
                          >
                            <IconComponent className={`w-3 h-3 flex-shrink-0 ${
                              isSelected ? 'text-amber-400' : 'text-amber-400'
                            }`} />
                            <span className="font-medium truncate text-white">
                              {preset.name}
                            </span>
                            <Crown className="w-2 h-2 text-amber-400 ml-auto" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
                          <div className="text-center">
                            <div className="font-medium flex items-center">
                              <Crown className="w-3 h-3 mr-1 text-amber-400" />
                              {preset.name}
                            </div>
                            <div className="text-xs text-gray-300">{preset.description}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}

        {/* Premium Upsell for Free Users */}
        {!isPremiumUser && (
          <div className="space-y-1 mt-4 pt-3 border-t border-editor-border">
            <div className="text-xs text-amber-400 px-1 mb-2 flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Premium Effects
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg">
              <div className="text-center space-y-2">
                <Crown className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="text-xs text-white font-medium">Unlock 15+ Premium Presets</div>
                <div className="text-xs text-gray-300">Crystal Clarity • Metallic Luxury • Hybrid Effects</div>
                <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-black text-xs h-6">
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Effects */}
        {categorizedPresets.custom && (
          <div className="space-y-1 mt-4 pt-3 border-t border-editor-border">
            <div className="text-xs text-crd-lightGray px-1 mb-2">Custom</div>
            {categorizedPresets.custom.map((preset) => {
              const IconComponent = preset.icon;
              const isSelected = selectedPresetId === preset.id;
              
              return (
                <Tooltip key={preset.id}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handlePresetClick(preset)}
                      variant="ghost"
                      className={`w-full h-7 px-2 flex items-center justify-start space-x-2 border transition-colors ${
                        isSelected 
                          ? 'bg-crd-green/30 border-crd-green text-white' 
                          : 'bg-editor-dark border-editor-border hover:border-crd-green hover:bg-crd-green/20'
                      } text-xs`}
                    >
                      <IconComponent className="w-3 h-3 flex-shrink-0 text-crd-green" />
                      <span className="font-medium truncate text-crd-green">
                        {preset.name}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
                    <div className="text-center">
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-300">{preset.description}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
