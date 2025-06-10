
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
import type { CardData } from '@/types/card';

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

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-600/70">Pending</Badge>;
    }
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
          {card.template_id && (
            <div className="flex justify-between">
              <span>Template</span>
              <span className="text-white">{card.template_id.substring(0, 8)}...</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Edition Size</span>
            <span className="text-white">{card.publishing_options?.distribution?.edition_size || 1}</span>
          </div>
          {card.design_metadata && Object.keys(card.design_metadata).length > 0 && (
            <div className="flex justify-between">
              <span>Effects</span>
              <span className="text-white">
                {Object.keys(card.design_metadata).length} applied
              </span>
            </div>
          )}
        </div>
      </CardExpandableSection>

      {/* Publication Info */}
      <CardExpandableSection title="Publication Info" icon={Settings}>
        <div className="space-y-3 text-sm text-crd-lightGray">
          <div className="flex justify-between">
            <span>Visibility</span>
            <Badge variant="outline" className="bg-white/10 border-none">
              {card.visibility?.charAt(0).toUpperCase() + card.visibility?.slice(1) || 'Private'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>In Marketplace</span>
            <Badge variant={card.publishing_options?.marketplace_listing ? "default" : "outline"} className={card.publishing_options?.marketplace_listing ? "bg-crd-green" : "text-crd-lightGray"}>
              {card.publishing_options?.marketplace_listing ? "Listed" : "Not Listed"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>In Catalog</span>
            <Badge variant={card.publishing_options?.crd_catalog_inclusion ? "default" : "outline"} className={card.publishing_options?.crd_catalog_inclusion ? "bg-crd-blue" : "text-crd-lightGray"}>
              {card.publishing_options?.crd_catalog_inclusion ? "Included" : "Not Included"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Print Available</span>
            <Badge variant={card.publishing_options?.print_available ? "default" : "outline"} className={card.publishing_options?.print_available ? "bg-crd-orange" : "text-crd-lightGray"}>
              {card.publishing_options?.print_available ? "Available" : "Unavailable"}
            </Badge>
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
            <span>Verification</span>
            {getVerificationBadge(card.verification_status)}
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
