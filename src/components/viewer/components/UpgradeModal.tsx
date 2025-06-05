
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Zap, Star, Sparkles } from 'lucide-react';
import { TIER_SYSTEM, type UserTier } from '../types/tierSystem';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: UserTier;
  onUpgrade: (newTier: UserTier) => void;
  targetTier?: UserTier;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onUpgrade,
  targetTier = 'pro'
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const targetTierInfo = TIER_SYSTEM[targetTier];
  const currentTierInfo = TIER_SYSTEM[currentTier];

  const handleUpgrade = async (tier: UserTier) => {
    setIsUpgrading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsUpgrading(false);
    setShowCelebration(true);
    
    // Show celebration for 2 seconds then upgrade
    setTimeout(() => {
      onUpgrade(tier);
      onClose();
      setShowCelebration(false);
    }, 2000);
  };

  const getTierIcon = (tier: UserTier) => {
    switch (tier) {
      case 'rookie': return <Star className="w-5 h-5" />;
      case 'pro': return <Zap className="w-5 h-5" />;
      case 'baller': return <Crown className="w-5 h-5" />;
    }
  };

  if (showCelebration) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-gradient-to-br from-purple-900 to-blue-900 border-none text-white">
          <div className="text-center py-8">
            <div className="mb-4 text-6xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Welcome to {targetTierInfo.name}!</h2>
            <p className="text-purple-200">
              You've unlocked amazing new features!
            </p>
            <div className="mt-4">
              <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                {getTierIcon(targetTier)}
                <span className="font-semibold">{targetTierInfo.displayName}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Level Up Your Card Game! 🚀
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Tier Display */}
          <div className="text-center">
            <Badge variant="outline" className="mb-2" style={{ color: currentTierInfo.color }}>
              Current: {currentTierInfo.name} {currentTierInfo.icon}
            </Badge>
          </div>

          {/* Tier Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pro Tier */}
            {currentTier === 'rookie' && (
              <div className={`border-2 rounded-lg p-6 transition-all ${
                targetTier === 'pro' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-blue-400'
              }`}>
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Zap className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold">Pro Collector</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">$5<span className="text-sm text-gray-400">/month</span></div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {TIER_SYSTEM.pro.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade('pro')}
                  disabled={isUpgrading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isUpgrading ? 'Processing...' : 'Upgrade to Pro'}
                </Button>
              </div>
            )}

            {/* Baller Tier */}
            <div className={`border-2 rounded-lg p-6 transition-all ${
              targetTier === 'baller' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-amber-400'
            }`}>
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold">Baller Collector</h3>
                </div>
                <div className="text-3xl font-bold text-amber-400">$20<span className="text-sm text-gray-400">/month</span></div>
                {currentTier === 'rookie' && (
                  <Badge className="mt-1 bg-gradient-to-r from-amber-500 to-orange-500">
                    Most Popular
                  </Badge>
                )}
              </div>
              
              <ul className="space-y-2 mb-6">
                {TIER_SYSTEM.baller.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                <li className="text-xs text-gray-400 ml-6">+ much more!</li>
              </ul>

              <Button
                onClick={() => handleUpgrade('baller')}
                disabled={isUpgrading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {isUpgrading ? 'Processing...' : 'Go Baller!'}
              </Button>
            </div>
          </div>

          {/* Benefits Highlight */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h4 className="font-semibold">What You Get Instantly:</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div>✨ Unlock all premium effects</div>
              <div>🚀 Remove watermarks</div>
              <div>💎 Unlimited exports</div>
              <div>🎯 Advanced controls</div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center text-sm text-gray-400">
            💯 30-day money-back guarantee • Cancel anytime
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
