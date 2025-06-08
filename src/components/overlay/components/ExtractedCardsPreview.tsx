
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import type { ExtractedCard } from '@/services/cardExtractor';

interface ExtractedCardsPreviewProps {
  extractedCards: ExtractedCard[];
  isProcessing: boolean;
}

export const ExtractedCardsPreview: React.FC<ExtractedCardsPreviewProps> = ({
  extractedCards,
  isProcessing
}) => {
  if (isProcessing) {
    return (
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="text-white font-medium">Extracting Cards...</div>
              <div className="text-crd-lightGray text-sm">
                Applying perspective correction and optimization...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Extracted Cards ({extractedCards.length})
          </h3>
          
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {extractedCards.map((card, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-editor-border bg-editor-surface"
                >
                  <img
                    src={card.originalImage}
                    alt={`Extracted card ${index + 1}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Card {index + 1} • {Math.round(card.confidence * 100)}%
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-sm font-medium">
                        {card.bounds.width}×{card.bounds.height}px
                      </div>
                      <div className="text-xs text-gray-300">
                        Quality: {Math.round(card.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {extractedCards.length === 0 && (
            <div className="text-center py-12">
              <div className="text-crd-lightGray">
                No cards extracted yet. Please adjust the regions and try again.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
