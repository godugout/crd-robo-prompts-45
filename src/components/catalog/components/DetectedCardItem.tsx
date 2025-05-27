
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit } from 'lucide-react';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';

interface DetectedCardItemProps {
  card: DetectedCard;
  index: number;
  isSelected: boolean;
  onToggle: (cardId: string) => void;
  onEdit: (cardId: string) => void;
  onSelect: (card: DetectedCard) => void;
}

export const DetectedCardItem: React.FC<DetectedCardItemProps> = ({
  card,
  index,
  isSelected,
  onToggle,
  onEdit,
  onSelect
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-600';
    if (confidence >= 0.6) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-crd-green bg-crd-green/10'
          : 'border-editor-border bg-editor-tool hover:border-crd-green/50'
      }`}
      onClick={() => onSelect(card)}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(card.id)}
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="w-16 h-20 rounded overflow-hidden bg-gray-700">
          <img
            src={URL.createObjectURL(card.imageBlob)}
            alt={`Card ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">
              Card {index + 1}
            </span>
            <Badge className={`${getConfidenceColor(card.confidence)} text-white text-xs`}>
              {Math.round(card.confidence * 100)}%
            </Badge>
          </div>
          
          <div className="text-crd-lightGray text-sm">
            {Math.round(card.bounds.width)} × {Math.round(card.bounds.height)}px
          </div>
          
          {card.metadata?.player?.name && (
            <div className="text-crd-lightGray text-xs mt-1">
              {card.metadata.player.name}
            </div>
          )}
        </div>
        
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card.id);
            onSelect(card);
          }}
          variant="ghost"
          size="sm"
          className="text-crd-green hover:bg-crd-green/20"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
