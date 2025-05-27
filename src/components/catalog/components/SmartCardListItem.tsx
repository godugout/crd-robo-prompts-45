
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Edit } from 'lucide-react';
import { DetectedCard } from '@/services/cardCatalog/types';

interface SmartCardListItemProps {
  card: DetectedCard;
  isSelected: boolean;
  onToggleSelection: (cardId: string) => void;
  onEdit?: (card: DetectedCard) => void;
  onCreate?: (card: DetectedCard) => void;
}

export const SmartCardListItem: React.FC<SmartCardListItemProps> = ({
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
      className={`bg-editor-dark border-editor-border ${
        isSelected ? 'ring-2 ring-crd-green' : ''
      }`}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(card.id)}
        />
        
        <div className="w-16 h-20 rounded-lg overflow-hidden bg-editor-tool">
          <img
            src={URL.createObjectURL(card.imageBlob)}
            alt={`Detected card ${card.id}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-medium">
                {card.metadata?.player?.name || 'Unknown Player'}
              </h3>
              <p className="text-crd-lightGray text-sm">
                {card.metadata?.team?.name || 'Unknown Team'} • {card.metadata?.year?.value || '----'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor(card.status)} text-white text-xs`}>
                  {card.status}
                </Badge>
                <span className={`text-xs ${getConfidenceColor(card.confidence)}`}>
                  {formatConfidence(card.confidence)} confidence
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => onEdit?.(card)}
                variant="outline"
                size="sm"
                className="border-editor-border text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button
                onClick={() => onCreate?.(card)}
                size="sm"
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                <Edit className="w-4 h-4 mr-2" />
                Create Card
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
