
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Edit } from 'lucide-react';
import { DetectedCard } from '@/services/cardCatalog/types';

interface SmartCardGridItemProps {
  card: DetectedCard;
  isSelected: boolean;
  onToggleSelection: (cardId: string) => void;
  onEdit?: (card: DetectedCard) => void;
  onCreate?: (card: DetectedCard) => void;
}

export const SmartCardGridItem: React.FC<SmartCardGridItemProps> = ({
  card,
  isSelected,
  onToggleSelection,
  onEdit,
  onCreate
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-blue-600';
      case 'processing': return 'bg-yellow-600';
      case 'enhanced': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  return (
    <Card 
      className={`bg-editor-dark border-editor-border overflow-hidden group hover:border-crd-green/50 transition-all ${
        isSelected ? 'ring-2 ring-crd-green' : ''
      }`}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={URL.createObjectURL(card.imageBlob)}
          alt={`Detected card ${card.id}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(card.id)}
            className="bg-black/70 border-white"
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`${getStatusColor(card.status)} text-white text-xs`}>
            {card.status}
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
            <span className={getConfidenceColor(card.confidence)}>
              {formatConfidence(card.confidence)}
            </span>
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button
              onClick={() => onEdit?.(card)}
              size="sm"
              className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onCreate?.(card)}
              size="sm"
              className="w-8 h-8 p-0 bg-crd-green/80 hover:bg-crd-green text-black"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
