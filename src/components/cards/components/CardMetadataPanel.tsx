
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardExpandableSection } from './CardExpandableSection';
import { 
  Tag, 
  FileText, 
  Settings, 
  Clock,
  Shield,
  Palette
} from 'lucide-react';
import type { CardData } from '@/hooks/useCardData';

interface CardMetadataPanelProps {
  card: CardData;
}

export const CardMetadataPanel: React.FC<CardMetadataPanelProps> = ({ card }) => {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Description Section */}
      {card.description && (
        <CardExpandableSection 
          title="Description" 
          icon={FileText}
          defaultExpanded={true}
        >
          <p className="text-crd-lightGray leading-relaxed">{card.description}</p>
        </CardExpandableSection>
      )}

      {/* Tags Section */}
      {card.tags && card.tags.length > 0 && (
        <CardExpandableSection title="Tags" icon={Tag}>
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-white/20 text-crd-lightGray hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardExpandableSection>
      )}

      {/* Design Metadata */}
      <CardExpandableSection title="Design Details" icon={Palette}>
        <div className="space-y-3 text-sm text-crd-lightGray">
          <div className="flex justify-between">
            <span>Edition Size</span>
            <span className="text-white">1</span>
          </div>
          <div className="flex justify-between">
            <span>Rarity</span>
            <span className="text-white capitalize">{card.rarity}</span>
          </div>
        </div>
      </CardExpandableSection>

      {/* Technical Details */}
      <CardExpandableSection title="Technical Details" icon={Shield}>
        <div className="space-y-3 text-sm text-crd-lightGray">
          <div className="flex justify-between">
            <span>Card ID</span>
            <span className="text-white font-mono">{card.id?.substring(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span>Created At</span>
            <span className="text-white">{formatDateTime(card.created_at)}</span>
          </div>
          {card.updated_at && (
            <div className="flex justify-between">
              <span>Updated At</span>
              <span className="text-white">{formatDateTime(card.updated_at)}</span>
            </div>
          )}
        </div>
      </CardExpandableSection>
    </div>
  );
};
