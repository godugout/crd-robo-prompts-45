
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Eye, 
  Heart, 
  Bookmark,
  Star,
  Hash,
  DollarSign,
  Sparkles
} from 'lucide-react';
import type { CardData } from '@/hooks/useCardData';

interface CardQuickFactsPanelProps {
  card: CardData;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export const CardQuickFactsPanel: React.FC<CardQuickFactsPanelProps> = ({
  card,
  likeCount,
  isLiked,
  isBookmarked
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      case 'uncommon':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const quickFacts = [
    {
      icon: Calendar,
      label: 'Created',
      value: formatDate(card.created_at),
      color: 'text-crd-lightGray'
    },
    {
      icon: Heart,
      label: 'Likes',
      value: likeCount.toString(),
      color: isLiked ? 'text-red-400' : 'text-crd-lightGray'
    },
    {
      icon: Hash,
      label: 'Edition',
      value: '1',
      color: 'text-crd-lightGray'
    }
  ];

  if (card.price) {
    quickFacts.push({
      icon: DollarSign,
      label: 'Price',
      value: `$${card.price}`,
      color: 'text-crd-green'
    });
  }

  return (
    <Card className="bg-editor-dark/50 backdrop-blur-sm border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Facts</h3>
          <Badge className={`bg-gradient-to-r ${getRarityColor(card.rarity)} text-white font-bold px-3 py-1`}>
            <Sparkles className="w-3 h-3 mr-1" />
            {card.rarity.toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {quickFacts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${fact.color}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-crd-lightGray">{fact.label}</div>
                  <div className={`text-sm font-medium ${fact.color}`}>{fact.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Creator info */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-crd-blue to-crd-green rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {card.creator_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-white font-medium text-sm truncate">{card.creator_name || 'Unknown'}</span>
                {card.creator_verified && <Star className="w-3 h-3 text-crd-green fill-current" />}
              </div>
              <div className="text-xs text-crd-lightGray">Creator</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
