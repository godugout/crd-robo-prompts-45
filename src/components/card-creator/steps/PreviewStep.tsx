
import React from 'react';
import { Sparkles } from 'lucide-react';
import { CRDButton, Typography } from '@/components/ui/design-system';
import type { CardRarity } from '@/types/card';

const RARITIES: { value: CardRarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-400' },
  { value: 'rare', label: 'Rare', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
];

interface PreviewStepProps {
  cardTitle: string;
  cardDescription: string;
  cardRarity: CardRarity;
  imageUrl?: string;
  isSaving: boolean;
  onQuickPublish: () => void;
  onContinueInStudio: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  cardTitle,
  cardDescription,
  cardRarity,
  imageUrl,
  isSaving,
  onQuickPublish,
  onContinueInStudio
}) => {
  return (
    <div className="text-center space-y-8">
      <div>
        <Typography variant="h3" className="mb-2">
          Your Card is Ready!
        </Typography>
        <Typography variant="body" className="text-crd-lightGray">
          You can publish it now or continue editing in our full studio
        </Typography>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center">
        <div className="relative w-80 h-[28rem] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={cardTitle} 
              className="w-full h-3/4 object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <h3 className="text-white font-bold text-xl mb-1">{cardTitle}</h3>
            {cardDescription && (
              <p className="text-gray-200 text-sm mb-2">{cardDescription}</p>
            )}
            <span className={`text-sm font-medium ${RARITIES.find(r => r.value === cardRarity)?.color}`}>
              {RARITIES.find(r => r.value === cardRarity)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <CRDButton
          onClick={onQuickPublish}
          disabled={isSaving}
        >
          {isSaving ? 'Publishing...' : 'Publish Now'}
        </CRDButton>
        <CRDButton
          variant="secondary"
          onClick={onContinueInStudio}
          className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Continue in Studio
        </CRDButton>
      </div>
    </div>
  );
};
