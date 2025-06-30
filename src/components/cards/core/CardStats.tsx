
import React from 'react';
import { Card } from '@/types/cards';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';

interface CardStatsProps {
  card: Card;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const CardStats: React.FC<CardStatsProps> = ({
  card,
  variant = 'detailed',
  className = ''
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {card.price && (
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-mono text-white">
              ${card.price}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Market Info */}
      <div className="bg-crd-mediumGray/20 rounded-lg p-3">
        <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-crd-green" />
          Card Info
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {card.price && (
            <div>
              <span className="text-crd-lightGray">Price:</span>
              <div className="font-bold text-crd-green">
                ${card.price.toFixed(2)}
              </div>
            </div>
          )}
          <div>
            <span className="text-crd-lightGray">Edition:</span>
            <div className="font-bold text-white">
              {card.edition_size}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="bg-crd-mediumGray/20 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-crd-blue/20 text-crd-blue border-crd-blue/50"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
