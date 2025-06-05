
import React from 'react';
import { Sparkles, X, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FreemiumPresetSelector } from './FreemiumPresetSelector';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { FreemiumPreset } from '../hooks/useFreemiumEffects';

interface FreemiumCustomizePanelProps {
  availablePresets: FreemiumPreset[];
  selectedPresetId: string;
  onPresetSelect: (presetId: string) => boolean;
  isPremiumUser: boolean;
  canAccessPreset: (presetId: string) => boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const FreemiumCustomizePanel: React.FC<FreemiumCustomizePanelProps> = ({
  availablePresets,
  selectedPresetId,
  onPresetSelect,
  isPremiumUser,
  canAccessPreset,
  onClose,
  onUpgrade
}) => {
  const freePresets = availablePresets.filter(p => !p.isPremium);
  const premiumPresets = availablePresets.filter(p => p.isPremium);

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Card Styles</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Free Styles Section */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-4 h-4 text-crd-green mr-2" />
              Free Styles
            </h3>
            <FreemiumPresetSelector
              presets={freePresets}
              selectedPresetId={selectedPresetId}
              onPresetSelect={onPresetSelect}
              isPremiumUser={isPremiumUser}
              canAccessPreset={canAccessPreset}
            />
          </div>

          {/* Separator */}
          <div className="border-b border-white/20" />

          {/* Premium Styles Section */}
          <div>
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Crown className="w-4 h-4 text-amber-400 mr-2" />
              Premium Styles
              {!isPremiumUser && (
                <span className="ml-2 text-xs bg-amber-400 text-black px-2 py-1 rounded">
                  LOCKED
                </span>
              )}
            </h3>
            <FreemiumPresetSelector
              presets={premiumPresets}
              selectedPresetId={selectedPresetId}
              onPresetSelect={onPresetSelect}
              isPremiumUser={isPremiumUser}
              canAccessPreset={canAccessPreset}
            />
          </div>

          {/* Upgrade Section */}
          {!isPremiumUser && (
            <>
              <div className="border-b border-white/20" />
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-4 border border-amber-500/30">
                <div className="flex items-center mb-2">
                  <Crown className="w-5 h-5 text-amber-400 mr-2" />
                  <h4 className="text-white font-medium">Unlock Premium</h4>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Get access to premium effects, advanced controls, and unlimited exports.
                </p>
                <Button 
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </>
          )}

          {/* Info Section */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">How it works</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Choose from preset styles</li>
              <li>• Click to flip your card</li>
              <li>• Move mouse for interactive effects</li>
              {!isPremiumUser && (
                <li>• Upgrade for custom controls</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
