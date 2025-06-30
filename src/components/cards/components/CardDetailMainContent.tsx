
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Maximize2 } from 'lucide-react';
import type { CardData as HookCardData } from '@/hooks/useCardData';

interface CardDetailMainContentProps {
  cardTitle: string;
  cardId: string;
  card: HookCardData;
  onOpenViewer: () => void;
}

export const CardDetailMainContent: React.FC<CardDetailMainContentProps> = ({
  cardTitle,
  cardId,
  card,
  onOpenViewer
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Card Preview */}
      <Card className="relative overflow-hidden bg-crd-darker border-crd-mediumGray/20">
        <div className="aspect-[3/4] relative group">
          {card.image_url ? (
            <>
              <img
                src={card.image_url}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay with 3D viewer button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  <Button
                    onClick={onOpenViewer}
                    className="bg-crd-green hover:bg-crd-green/90 text-black font-medium flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    View in 3D
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Fullscreen
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray to-crd-darker flex items-center justify-center">
              <div className="text-center text-crd-lightGray">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-crd-mediumGray/50 flex items-center justify-center">
                  <Play className="w-8 h-8" />
                </div>
                <p className="text-sm">No preview available</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Card Information */}
      <Card className="p-6 bg-crd-darker border-crd-mediumGray/20">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{card.title}</h1>
            {card.description && (
              <p className="text-crd-lightGray leading-relaxed">{card.description}</p>
            )}
          </div>

          {/* Card Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-crd-mediumGray/20">
            <div>
              <p className="text-sm text-crd-lightGray">Rarity</p>
              <p className="font-medium text-white capitalize">{card.rarity}</p>
            </div>
            <div>
              <p className="text-sm text-crd-lightGray">Creator</p>
              <p className="font-medium text-white">{card.creator_name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-crd-lightGray">Edition</p>
              <p className="font-medium text-white">1/1</p>
            </div>
            <div>
              <p className="text-sm text-crd-lightGray">Status</p>
              <p className="font-medium text-crd-green">Available</p>
            </div>
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="pt-4 border-t border-crd-mediumGray/20">
              <p className="text-sm text-crd-lightGray mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-crd-mediumGray/30 text-crd-lightGray text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
