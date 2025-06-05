
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Gem, Zap, Clock, Crown, Diamond, Lock } from 'lucide-react';
import type { FreemiumPreset } from '../hooks/useFreemiumEffects';

const PRESET_ICONS = {
  Sparkles,
  Gem, 
  Zap,
  Clock,
  Crown,
  Diamond
};

interface FreemiumPresetSelectorProps {
  presets: FreemiumPreset[];
  selectedPresetId: string;
  onPresetSelect: (presetId: string) => boolean;
  isPremiumUser: boolean;
  canAccessPreset: (presetId: string) => boolean;
}

export const FreemiumPresetSelector: React.FC<FreemiumPresetSelectorProps> = ({
  presets,
  selectedPresetId,
  onPresetSelect,
  isPremiumUser,
  canAccessPreset
}) => {
  const handlePresetClick = (preset: FreemiumPreset) => {
    if (!canAccessPreset(preset.id)) {
      // Show upgrade prompt for premium features
      console.log('🔒 Upgrade required for:', preset.name);
      // TODO: Trigger upgrade modal
      return;
    }
    
    onPresetSelect(preset.id);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const IconComponent = PRESET_ICONS[preset.icon as keyof typeof PRESET_ICONS] || Sparkles;
          const isSelected = selectedPresetId === preset.id;
          const isAccessible = canAccessPreset(preset.id);
          const isLocked = preset.isPremium && !isPremiumUser;
          
          return (
            <Tooltip key={preset.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handlePresetClick(preset)}
                  variant="ghost"
                  className={`w-full h-7 px-2 flex items-center justify-start space-x-2 border transition-colors relative ${
                    isSelected && isAccessible
                      ? 'bg-crd-green/30 border-crd-green text-white' 
                      : isLocked
                      ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-editor-dark border-editor-border hover:border-crd-green hover:bg-crd-green/20'
                  } text-xs`}
                  disabled={isLocked}
                >
                  <IconComponent className={`w-3 h-3 flex-shrink-0 ${
                    isSelected && isAccessible ? 'text-crd-green' : 
                    isLocked ? 'text-gray-500' : 'text-crd-green'
                  }`} />
                  <span className={`font-medium truncate ${
                    isLocked ? 'text-gray-500' : 'text-white'
                  }`}>
                    {preset.name}
                  </span>
                  {isLocked && (
                    <Lock className="w-2 h-2 text-gray-500 ml-auto" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
                <div className="text-center max-w-48">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-300 mb-1">{preset.description}</div>
                  {isLocked && (
                    <div className="text-xs text-amber-400 italic">
                      🔒 Premium Feature - Upgrade to unlock
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
