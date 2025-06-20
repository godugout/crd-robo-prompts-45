
import React from 'react';
import { Card, CardStats as CardStatsType } from '@/types/cards';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Zap, Star } from 'lucide-react';

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
  const hasCombatStats = card.power !== undefined || card.toughness !== undefined;
  const hasManaCost = card.mana_cost && Object.keys(card.mana_cost).length > 0;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {hasCombatStats && (
          <div className="flex items-center gap-1">
            <Sword className="w-3 h-3 text-red-400" />
            <span className="text-xs font-mono text-white">
              {card.power || 0}
            </span>
            <span className="text-xs text-gray-400">/</span>
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-xs font-mono text-white">
              {card.toughness || 0}
            </span>
          </div>
        )}
        
        {hasManaCost && (
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-mono text-white">
              {Object.values(card.mana_cost!).reduce((sum, cost) => sum + cost, 0)}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Combat Stats */}
      {hasCombatStats && (
        <div className="bg-crd-mediumGray/20 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-crd-green" />
            Combat Stats
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-red-400" />
              <span className="text-sm text-crd-lightGray">Power:</span>
              <span className="text-sm font-bold text-white">
                {card.power || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-crd-lightGray">Toughness:</span>
              <span className="text-sm font-bold text-white">
                {card.toughness || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mana Cost */}
      {hasManaCost && (
        <div className="bg-crd-mediumGray/20 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Mana Cost
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(card.mana_cost!).map(([type, cost]) => (
              <Badge
                key={type}
                variant="outline"
                className="border-yellow-400 text-yellow-400 bg-yellow-400/10"
              >
                {cost} {type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Abilities */}
      {card.abilities && card.abilities.length > 0 && (
        <div className="bg-crd-mediumGray/20 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2">Abilities</h4>
          <div className="space-y-1">
            {card.abilities.map((ability, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="mr-1 mb-1 text-xs bg-crd-blue/20 text-crd-blue border-crd-blue/50"
              >
                {ability}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Market Info */}
      <div className="bg-crd-mediumGray/20 rounded-lg p-3">
        <h4 className="text-sm font-medium text-white mb-2">Market Value</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-crd-lightGray">Base Price:</span>
            <div className="font-bold text-crd-green">
              ${card.base_price.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-crd-lightGray">Current Value:</span>
            <div className="font-bold text-crd-green">
              ${card.current_market_value.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
