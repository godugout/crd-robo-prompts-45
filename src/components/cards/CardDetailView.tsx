
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Maximize2, Share, Download, Star, Calendar, Tag } from 'lucide-react';
import { CompactCardViewer } from '@/components/viewer/CompactCardViewer';
import type { CardData } from '@/hooks/useCardData';

interface CardDetailViewProps {
  card: CardData;
  onOpenViewer: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export const CardDetailView: React.FC<CardDetailViewProps> = ({
  card,
  onOpenViewer,
  onShare,
  onDownload
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic':
        return 'bg-gradient-to-r from-purple-400 to-pink-500';
      case 'rare':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500';
      case 'uncommon':
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Compact 3D Card Viewer */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative">
              <CompactCardViewer
                card={card}
                onFullscreen={onOpenViewer}
                width={400}
                height={560}
              />
              
              {/* Rarity Badge Overlay */}
              <div className="absolute top-4 left-4 z-50">
                <Badge 
                  className={`${getRarityColor(card.rarity)} text-white font-bold px-3 py-1 text-sm`}
                >
                  {card.rarity.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onOpenViewer}
                className="w-full bg-crd-blue hover:bg-crd-blue/90 text-white font-medium h-12"
                size="lg"
              >
                <Maximize2 className="w-5 h-5 mr-2" />
                Fullscreen 3D View
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={onShare}
                  className="border-editor-border text-crd-lightGray hover:bg-editor-border hover:text-white"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={onDownload}
                  className="border-editor-border text-crd-lightGray hover:bg-editor-border hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Card Information */}
          <div className="space-y-6">
            {/* Title and Creator */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{card.title}</h1>
              <div className="flex items-center gap-2 text-crd-lightGray">
                <span>by</span>
                <span className="text-white font-medium">{card.creator_name}</span>
                {card.creator_verified && (
                  <Star className="w-4 h-4 text-crd-green fill-current" />
                )}
              </div>
            </div>

            {/* Description */}
            {card.description && (
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-crd-lightGray leading-relaxed">{card.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Card Details */}
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-white">Card Details</h3>
                
                <div className="space-y-3">
                  {/* Price */}
                  {card.price && (
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Price</span>
                      <span className="text-white font-medium">${card.price}</span>
                    </div>
                  )}
                  
                  <Separator className="bg-editor-border" />
                  
                  {/* Created Date */}
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created
                    </span>
                    <span className="text-white">{formatDate(card.created_at)}</span>
                  </div>
                  
                  {/* Rarity */}
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">Rarity</span>
                    <Badge 
                      className={`${getRarityColor(card.rarity)} text-white font-medium`}
                    >
                      {card.rarity}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <Card className="bg-editor-dark border-editor-border">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-editor-border text-crd-lightGray hover:bg-editor-border hover:text-white"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
