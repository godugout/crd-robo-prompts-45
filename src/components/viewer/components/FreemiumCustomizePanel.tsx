
import React, { useState } from 'react';
import { Sparkles, X, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FreemiumPresetSelector } from './FreemiumPresetSelector';
import { UpgradeModal } from './UpgradeModal';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { FreemiumPreset } from '../hooks/useFreemiumEffects';
import type { UserTier } from '../types/tierSystem';
import { TIER_SYSTEM, canAccessFeature } from '../types/tierSystem';

interface FreemiumCustomizePanelProps {
  availablePresets: FreemiumPreset[];
  selectedPresetId: string;
  onPresetSelect: (presetId: string) => boolean;
  userTier: UserTier;
  canAccessPreset: (presetId: string) => boolean;
  onClose: () => void;
  onTierChange?: (newTier: UserTier) => void;
}

export const FreemiumCustomizePanel: React.FC<FreemiumCustomizePanelProps> = ({
  availablePresets,
  selectedPresetId,
  onPresetSelect,
  userTier,
  canAccessPreset,
  onClose,
  onTierChange
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Ensure we have a valid tier, fallback to 'rookie' if undefined
  const safeTier = userTier && TIER_SYSTEM[userTier] ? userTier : 'rookie';
  const currentTierInfo = TIER_SYSTEM[safeTier];
  const freePresets = availablePresets.filter(p => !p.isPremium);
  const premiumPresets = availablePresets.filter(p => p.isPremium);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgradeComplete = (newTier: UserTier) => {
    setShowUpgradeModal(false);
    // Immediately trigger tier change - no blocking onboarding
    if (onTierChange) {
      onTierChange(newTier);
    }
  };

  const getTierIcon = () => {
    switch (safeTier) {
      case 'rookie': return <Sparkles className="w-4 h-4" />;
      case 'pro': return <Zap className="w-4 h-4" />;
      case 'baller': return <Crown className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTierColor = () => {
    return currentTierInfo?.color || '#6B7280';
  };

  return (
    <>
      <div className="fixed top-0 right-0 h-full w-80 bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 overflow-hidden z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-white">Card Styles</h2>
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: getTierColor(), color: getTierColor() }}
            >
              {getTierIcon()}
              {currentTierInfo?.name || 'Rookie'}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Available Styles Section */}
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Sparkles className="w-4 h-4 text-crd-green mr-2" />
                Available Styles
              </h3>
              <FreemiumPresetSelector
                presets={freePresets}
                selectedPresetId={selectedPresetId}
                onPresetSelect={onPresetSelect}
                isPremiumUser={safeTier !== 'rookie'}
                canAccessPreset={canAccessPreset}
              />
            </div>

            {/* Separator */}
            <div className="border-b border-white/20" />

            {/* Locked Premium Styles Section */}
            {safeTier === 'rookie' && premiumPresets.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Crown className="w-4 h-4 text-amber-400 mr-2" />
                  Premium Styles
                  <Badge className="ml-2 text-xs bg-amber-400 text-black px-2 py-1 rounded">
                    LOCKED
                  </Badge>
                </h3>
                <FreemiumPresetSelector
                  presets={premiumPresets}
                  selectedPresetId={selectedPresetId}
                  onPresetSelect={onPresetSelect}
                  isPremiumUser={false}
                  canAccessPreset={canAccessPreset}
                />
              </div>
            )}

            {/* Upgrade Section */}
            {safeTier === 'rookie' && (
              <>
                <div className="border-b border-white/20" />
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-blue-400 mr-2" />
                    <h4 className="text-white font-medium">Level Up to Pro</h4>
                    <Badge className="ml-2 bg-blue-600 text-white text-xs">$5/month</Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Unlock all premium effects, unlimited exports, and remove watermarks.
                  </p>
                  <Button 
                    onClick={handleUpgradeClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="flex items-center mb-2">
                    <Crown className="w-5 h-5 text-amber-400 mr-2" />
                    <h4 className="text-white font-medium">Go Baller</h4>
                    <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                      $20/month
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Full studio access with advanced controls, custom presets, and 4K exports.
                  </p>
                  <Button 
                    onClick={handleUpgradeClick}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Go Baller!
                  </Button>
                </div>
              </>
            )}

            {/* Current Tier Benefits */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2 flex items-center">
                {getTierIcon()}
                <span className="ml-2">{currentTierInfo?.displayName || 'Rookie Collector'} Benefits</span>
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {(currentTierInfo?.features || []).slice(0, 4).map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
                {(currentTierInfo?.features || []).length > 4 && (
                  <li className="text-gray-400">+ more...</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={safeTier}
        onUpgrade={handleUpgradeComplete}
      />
    </>
  );
};
