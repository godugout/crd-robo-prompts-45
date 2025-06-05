
import React from 'react';
import { X, Settings, Download, Share2, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserTier } from '../types/tierSystem';
import { TIER_SYSTEM } from '../types/tierSystem';

interface StudioPanelHeaderProps {
  userTier: UserTier;
  onClose: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export const StudioPanelHeader: React.FC<StudioPanelHeaderProps> = ({
  userTier,
  onClose,
  onDownload,
  onShare
}) => {
  const tierInfo = TIER_SYSTEM[userTier];

  const getTierIcon = () => {
    return userTier === 'pro' ? <Zap className="w-4 h-4" /> : <Crown className="w-4 h-4" />;
  };

  const getTierColor = () => {
    return tierInfo?.color || '#3B82F6';
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Enhanced Studio</h2>
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ borderColor: getTierColor(), color: getTierColor() }}
        >
          {getTierIcon()}
          {tierInfo?.name || 'Pro'}
        </Badge>
      </div>
      <div className="flex space-x-1">
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
          >
            <Share2 className="w-4 h-4 text-white" />
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white/10"
          >
            <Download className="w-4 h-4 text-white" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};
