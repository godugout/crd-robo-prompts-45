
import React, { useEffect, useState } from 'react';
import { Crown, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserTier } from '../types/tierSystem';
import { TIER_SYSTEM } from '../types/tierSystem';

interface WelcomeToastProps {
  isVisible: boolean;
  userTier: UserTier;
  onDismiss: () => void;
}

export const WelcomeToast: React.FC<WelcomeToastProps> = ({
  isVisible,
  userTier,
  onDismiss
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const tierInfo = TIER_SYSTEM[userTier];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  const getTierIcon = () => {
    return userTier === 'pro' ? <Zap className="w-5 h-5" /> : <Crown className="w-5 h-5" />;
  };

  const getTierGradient = () => {
    return userTier === 'pro' 
      ? 'from-blue-500 to-purple-600' 
      : 'from-amber-500 to-orange-600';
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className={`bg-gradient-to-r ${getTierGradient()} p-1 rounded-lg shadow-lg max-w-sm`}>
        <div className="bg-black rounded-md p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="font-semibold text-sm">Welcome to {tierInfo.name}!</h3>
                <p className="text-xs text-gray-300">New features unlocked</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            {getTierIcon()}
            <span>{tierInfo.displayName}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">Advanced studio unlocked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
