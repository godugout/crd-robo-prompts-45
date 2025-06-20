
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RARITY_COLORS } from '@/types/cards';
import { Star, Sparkles, Crown, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RarityBadgeProps {
  rarity: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

const RARITY_ICONS: Record<string, any> = {
  common: null,
  uncommon: null,
  rare: Star,
  epic: Sparkles,
  legendary: Crown,
  mythic: Flame
};

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = 'md',
  showIcon = true,
  animated = true,
  className
}) => {
  const colors = RARITY_COLORS[rarity] || RARITY_COLORS.common;
  const Icon = RARITY_ICONS[rarity];

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Badge
      className={cn(
        'font-bold border transition-all duration-200',
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        animated && rarity === 'legendary' && 'animate-pulse',
        animated && rarity === 'mythic' && 'animate-bounce',
        className
      )}
      style={{
        boxShadow: animated ? `0 0 10px ${colors.glow}` : undefined
      }}
    >
      <div className="flex items-center gap-1">
        {showIcon && Icon && <Icon className={iconSizes[size]} />}
        <span className="capitalize">{rarity}</span>
      </div>
    </Badge>
  );
};
