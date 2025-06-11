import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { CheckCircle, Eye, RotateCcw, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ExtractedCard {
  id: string;
  imageBlob: Blob;
  imageUrl: string;
  confidence: number;
  sourceImageName: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
}

interface CardsSuccessPhaseProps {
  extractedCards: ExtractedCard[];
  collectionId: string | null;
  onStartNew: () => void;
  onViewCollection: () => void;
}

const RARITY_COLORS = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400'
};

export const CardsSuccessPhase: React.FC<CardsSuccessPhaseProps> = ({
  extractedCards,
  collectionId,
  onStartNew,
  onViewCollection
}) => {
  const navigate = useNavigate();
  
  const rarityBreakdown = extractedCards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleShare = () => {
    const shareText = `I just added ${extractedCards.length} cards to my collection! ${Object.entries(rarityBreakdown).map(([rarity, count]) => `${count} ${rarity}`).join(', ')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Card Collection Update',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard!');
    }
  };

  const handleViewCollection = () => {
    if (collectionId) {
      navigate(`/collection/${collectionId}`);
    } else {
      // Fallback to the original onViewCollection prop
      onViewCollection();
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-crd-green rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-black" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-crd-white mb-2">
            Cards Successfully Saved!
          </h3>
          <p className="text-lg text-crd-lightGray">
            {extractedCards.length} cards have been added to your collection
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6">
        <h4 className="text-lg font-semibold text-crd-white mb-4 text-center">
          Collection Summary
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(rarityBreakdown).map(([rarity, count]) => (
            <div key={rarity} className="text-center">
              <div className={`text-2xl font-bold ${RARITY_COLORS[rarity as keyof typeof RARITY_COLORS]}`}>
                {count}
              </div>
              <div className="text-sm text-crd-lightGray capitalize">
                {rarity}
              </div>
            </div>
          ))}
        </div>

        {/* Card Grid Preview */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {extractedCards.map((card) => (
            <div key={card.id} className="group relative">
              <div className="aspect-[3/4] bg-crd-darkGray rounded overflow-hidden">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${
                card.rarity === 'legendary' ? 'bg-yellow-400' :
                card.rarity === 'epic' ? 'bg-purple-400' :
                card.rarity === 'rare' ? 'bg-blue-400' :
                card.rarity === 'uncommon' ? 'bg-green-400' :
                'bg-gray-400'
              }`}></div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {card.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Stats */}
      <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6">
        <h4 className="text-lg font-semibold text-crd-white mb-4">Processing Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-crd-green mb-1">
              {new Set(extractedCards.map(card => card.sourceImageName)).size}
            </div>
            <div className="text-sm text-crd-lightGray">Images Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-crd-green mb-1">
              {Math.round(extractedCards.reduce((sum, card) => sum + card.confidence, 0) / extractedCards.length * 100)}%
            </div>
            <div className="text-sm text-crd-lightGray">Average Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-crd-green mb-1">
              {extractedCards.length}
            </div>
            <div className="text-sm text-crd-lightGray">Cards Extracted</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CRDButton
          variant="primary"
          onClick={handleViewCollection}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Collection
        </CRDButton>
        
        <CRDButton
          variant="outline"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </CRDButton>
        
        <CRDButton
          variant="outline"
          onClick={onStartNew}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Process More Images
        </CRDButton>
      </div>

      {/* Tips for Next Time */}
      <div className="bg-editor-tool rounded-xl p-6">
        <h4 className="text-lg font-semibold text-crd-white mb-3">Tips for Better Results</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-crd-lightGray">
          <div>
            <h5 className="font-medium text-crd-white mb-1">Image Quality</h5>
            <p>Use high-resolution images with good lighting for better card detection</p>
          </div>
          <div>
            <h5 className="font-medium text-crd-white mb-1">Card Arrangement</h5>
            <p>Spread cards out with clear borders for improved detection accuracy</p>
          </div>
          <div>
            <h5 className="font-medium text-crd-white mb-1">Background</h5>
            <p>Use a plain, contrasting background to help cards stand out</p>
          </div>
          <div>
            <h5 className="font-medium text-crd-white mb-1">Organization</h5>
            <p>Group similar cards and use consistent naming for easier management</p>
          </div>
        </div>
      </div>
    </div>
  );
};
