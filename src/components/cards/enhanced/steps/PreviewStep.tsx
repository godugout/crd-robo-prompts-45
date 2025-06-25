
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { Typography, CRDButton } from '@/components/ui/design-system';
import { CardPreview } from '@/components/card/CardPreview';
import type { CardData } from '@/types/card';

interface PreviewStepProps {
  cardData: CardData;
  selectedFrame: string;
  isSaving: boolean;
  user: any;
  onImageUpdate: (newImageUrl: string) => void;
  onSaveCard: () => Promise<boolean>;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  cardData,
  selectedFrame,
  isSaving,
  user,
  onImageUpdate,
  onSaveCard
}) => {
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!user) {
      toast.error('Please sign in to publish cards');
      navigate('/auth');
      return;
    }
    const saved = await onSaveCard();
    if (saved) {
      toast.success('Card published successfully!');
    }
  };

  const handleAdvancedStudio = () => {
    localStorage.setItem('draft-card', JSON.stringify({
      ...cardData,
      selectedFrame,
    }));
    navigate('/studio');
    toast.success('Opening in advanced studio...');
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <Typography variant="h3" className="mb-2">
          Your Enhanced Card is Ready!
        </Typography>
        <Typography variant="body" className="text-crd-lightGray">
          Created with the enhanced professional studio
        </Typography>
      </div>

      <div className="flex justify-center">
        <CardPreview
          cardData={{
            title: cardData.title,
            description: cardData.description,
            rarity: cardData.rarity,
            template_id: selectedFrame
          }}
          imageUrl={cardData.image_url}
          onImageUpdate={onImageUpdate}
        />
      </div>

      <div className="bg-[#23262F] rounded-xl p-4 max-w-md mx-auto">
        <h3 className="text-white font-bold text-xl mb-1">{cardData.title}</h3>
        {cardData.description && (
          <p className="text-gray-200 text-sm mb-2">{cardData.description}</p>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <CRDButton
          onClick={handlePublish}
          disabled={isSaving}
        >
          {isSaving ? 'Publishing...' : 'Publish Now'}
        </CRDButton>
        <CRDButton
          variant="secondary"
          onClick={handleAdvancedStudio}
          className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Advanced Studio
        </CRDButton>
      </div>
    </div>
  );
};
