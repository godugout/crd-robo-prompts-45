
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Scissors, Grid, Camera } from 'lucide-react';
import { useOverlay } from '@/components/overlay/index';
import { ExtractedCard } from '@/services/cardExtractor';
import { toast } from 'sonner';

interface CardCollectionUploadProps {
  onCardsAdded: (cards: ExtractedCard[]) => void;
}

export const CardCollectionUpload = ({ onCardsAdded }: CardCollectionUploadProps) => {
  const { openOverlay } = useOverlay();
  const [recentExtractions, setRecentExtractions] = useState<ExtractedCard[]>([]);

  const handleOpenDetection = () => {
    openOverlay('enhanced-card-detection', { 
      onCardsExtracted: (cards: ExtractedCard[]) => {
        setRecentExtractions(cards);
        onCardsAdded(cards);
        toast.success(`Added ${cards.length} cards to your collection!`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Upload Area */}
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-editor-tool flex items-center justify-center mx-auto">
              <Scissors className="w-10 h-10 text-crd-green" />
            </div>
            
            <div>
              <h3 className="text-white font-medium text-xl mb-2">
                Smart Card Detection
              </h3>
              <p className="text-crd-lightGray text-sm max-w-md mx-auto">
                Upload photos of your card collection and our AI will automatically detect 
                and extract individual trading cards, even from photos with backgrounds.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleOpenDetection}
                className="bg-crd-green hover:bg-crd-green/80 text-black px-8 py-3 rounded-full text-lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Card Detection
              </Button>
              
              <div className="text-xs text-crd-lightGray">
                Works with Instagram screenshots, collection photos, or individual card images
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-editor-tool border-editor-border">
          <CardContent className="p-4 text-center">
            <Upload className="w-8 h-8 text-crd-green mx-auto mb-2" />
            <h4 className="text-white font-medium text-sm mb-1">Any Image Format</h4>
            <p className="text-crd-lightGray text-xs">
              JPG, PNG, WebP supported. Works with phone photos, scans, or screenshots.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-editor-tool border-editor-border">
          <CardContent className="p-4 text-center">
            <Grid className="w-8 h-8 text-crd-green mx-auto mb-2" />
            <h4 className="text-white font-medium text-sm mb-1">Multiple Cards</h4>
            <p className="text-crd-lightGray text-xs">
              Detects multiple 2.5x3.5 cards in a single image with precise cropping.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-editor-tool border-editor-border">
          <CardContent className="p-4 text-center">
            <Scissors className="w-8 h-8 text-crd-green mx-auto mb-2" />
            <h4 className="text-white font-medium text-sm mb-1">Smart Extraction</h4>
            <p className="text-crd-lightGray text-xs">
              AI-powered background removal and perspective correction for clean results.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Extractions Preview */}
      {recentExtractions.length > 0 && (
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-6">
            <h4 className="text-white font-medium mb-4">
              Recently Extracted ({recentExtractions.length} cards)
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {recentExtractions.slice(0, 8).map((card, index) => (
                <div key={index} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={URL.createObjectURL(card.imageBlob)}
                    alt={`Extracted card ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {recentExtractions.length > 8 && (
                <div className="aspect-[3/4] rounded-lg bg-editor-tool flex items-center justify-center">
                  <span className="text-crd-lightGray text-xs text-center">
                    +{recentExtractions.length - 8}<br />more
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
