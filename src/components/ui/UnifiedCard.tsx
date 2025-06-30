
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedCardProps {
  title: string;
  description?: string;
  image?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats?: {
    views?: number;
    likes?: number;
  };
  actions?: {
    onView?: () => void;
    onLike?: () => void;
    onShare?: () => void;
  };
  className?: string;
}

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  title,
  description,
  image,
  rarity = 'common',
  stats,
  actions,
  className
}) => {
  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gray-800/50 border-gray-700",
      className
    )}>
      {/* Card Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎴</span>
              </div>
              <p className="text-sm">Card Preview</p>
            </div>
          </div>
        )}
        
        {/* Rarity Badge */}
        <Badge 
          className={cn(
            "absolute top-2 right-2 text-white border-0",
            rarityColors[rarity]
          )}
        >
          {rarity}
        </Badge>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {actions?.onView && (
            <Button
              size="sm"
              variant="outline"
              onClick={actions.onView}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {actions?.onLike && (
            <Button
              size="sm"
              variant="outline"
              onClick={actions.onLike}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Heart className="w-4 h-4" />
            </Button>
          )}
          {actions?.onShare && (
            <Button
              size="sm"
              variant="outline"
              onClick={actions.onShare}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {stats.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {stats.views.toLocaleString()}
              </div>
            )}
            {stats.likes !== undefined && (
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {stats.likes.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
