import React, { useState, useCallback } from 'react';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Typography, CRDButton } from '@/components/ui/design-system';
import type { CardRarity } from '@/types/card';
import { StepProgressIndicator } from '@/components/card-creator/components/StepProgressIndicator';
import { StepNavigation } from '@/components/card-creator/components/StepNavigation';
import { CustomizeStep } from '@/components/card-creator/steps/CustomizeStep';
import { PolishStep } from '@/components/card-creator/steps/PolishStep';
import { CardPreview } from '@/components/card/CardPreview';
import { EnhancedCardStudio } from '@/components/studio/enhanced/EnhancedCardStudio';
import { Sparkles } from 'lucide-react';

type Step = 'frameAndImage' | 'customize' | 'polish' | 'preview';

const RARITIES: { value: CardRarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: 'text-gray-400' },
  { value: 'uncommon', label: 'Uncommon', color: 'text-green-400' },
  { value: 'rare', label: 'Rare', color: 'text-blue-400' },
  { value: 'epic', label: 'Epic', color: 'text-purple-400' },
  { value: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
];

export const EnhancedCardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cardData, updateField, saveCard, isSaving } = useSimpleCardEditor();
  const [step, setStep] = useState<Step>('frameAndImage');
  const [selectedFrame, setSelectedFrame] = useState<string>('');

  console.log('EnhancedCardCreator rendering - ENHANCED STUDIO VERSION:', {
    step,
    selectedFrame,
    cardDataImage: cardData.image_url,
    cardTitle: cardData.title
  });

  const handleFrameSelect = useCallback((frameId: string) => {
    console.log('Enhanced Frame selected:', frameId);
    setSelectedFrame(frameId);
    updateField('template_id', frameId);
  }, [updateField]);

  const handleImageUpload = useCallback((imageUrl: string) => {
    console.log('Enhanced Image uploaded:', imageUrl);
    updateField('image_url', imageUrl);
  }, [updateField]);

  const handleImageUpdate = useCallback((newImageUrl: string) => {
    updateField('image_url', newImageUrl);
  }, [updateField]);

  const handleContinueInStudio = () => {
    localStorage.setItem('draft-card', JSON.stringify({
      ...cardData,
      selectedFrame,
    }));
    navigate('/cards/create');
    toast.success('Opening card in studio...');
  };

  const handleQuickPublish = async () => {
    if (!user) {
      toast.error('Please sign in to publish cards');
      navigate('/auth');
      return;
    }

    if (!cardData.title.trim()) {
      toast.error('Please enter a card title');
      return;
    }

    const saved = await saveCard();
    if (saved) {
      toast.success('Card created successfully!');
      setStep('frameAndImage');
      updateField('title', '');
      updateField('description', '');
      updateField('image_url', '');
      updateField('rarity', 'common');
      setSelectedFrame('');
    }
  };

  const canContinue = (): boolean => {
    switch (step) {
      case 'frameAndImage':
        return Boolean(selectedFrame && cardData.image_url);
      case 'customize':
        return Boolean(cardData.title.trim().length > 0);
      case 'polish':
        return true;
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'frameAndImage':
        return 'Enhanced Professional Studio';
      case 'customize':
        return 'Customize Your Card';
      case 'polish':
        return 'Add Finishing Touches';
      case 'preview':
        return 'Preview & Publish';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'frameAndImage':
        return 'Professional card creation with premium frames and advanced preview';
      case 'customize':
        return 'Add your card title, description, and set the rarity';
      case 'polish':
        return 'Fine-tune your card with effects and adjustments';
      case 'preview':
        return 'Review your card and publish when ready';
      default:
        return '';
    }
  };

  const handlePrevious = () => {
    const steps: Step[] = ['frameAndImage', 'customize', 'polish', 'preview'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const steps: Step[] = ['frameAndImage', 'customize', 'polish', 'preview'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const renderStepContent = () => {
    console.log('Enhanced rendering step content for:', step);
    
    switch (step) {
      case 'frameAndImage':
        console.log('Enhanced Studio with:', { selectedFrame, uploadedImage: cardData.image_url });
        return (
          <EnhancedCardStudio
            selectedFrame={selectedFrame}
            uploadedImage={cardData.image_url}
            onFrameSelect={handleFrameSelect}
            onImageUpload={handleImageUpload}
          />
        );

      case 'customize':
        return (
          <CustomizeStep
            cardTitle={cardData.title}
            cardDescription={cardData.description || ''}
            cardRarity={cardData.rarity}
            onTitleChange={(title) => updateField('title', title)}
            onDescriptionChange={(description) => updateField('description', description)}
            onRarityChange={(rarity) => updateField('rarity', rarity)}
          />
        );

      case 'polish':
        return <PolishStep />;

      case 'preview':
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
                onImageUpdate={handleImageUpdate}
              />
            </div>

            <div className="bg-[#23262F] rounded-xl p-4 max-w-md mx-auto">
              <h3 className="text-white font-bold text-xl mb-1">{cardData.title}</h3>
              {cardData.description && (
                <p className="text-gray-200 text-sm mb-2">{cardData.description}</p>
              )}
              <span className={`text-sm font-medium ${RARITIES.find(r => r.value === cardData.rarity)?.color}`}>
                {RARITIES.find(r => r.value === cardData.rarity)?.label}
              </span>
            </div>

            <div className="flex gap-4 justify-center">
              <CRDButton
                onClick={handleQuickPublish}
                disabled={isSaving}
              >
                {isSaving ? 'Publishing...' : 'Publish Now'}
              </CRDButton>
              <CRDButton
                variant="secondary"
                onClick={handleContinueInStudio}
                className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue in Studio
              </CRDButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // For the frameAndImage step, render full-screen studio
  if (step === 'frameAndImage') {
    return (
      <div className="min-h-screen">
        {renderStepContent()}
      </div>
    );
  }

  // For other steps, use the standard layout
  return (
    <div className="bg-[#141416] py-8 px-4 md:px-6 lg:px-8 min-h-screen">
      <div className="w-full max-w-none mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-block bg-crd-green text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
            ENHANCED PROFESSIONAL STUDIO
          </div>
        </div>

        <StepProgressIndicator 
          currentStep={step}
          getStepDescription={getStepDescription}
        />

        <div className="bg-[#23262F] rounded-2xl overflow-hidden">
          <div className="p-4 lg:p-6 text-center border-b border-gray-700">
            <Typography variant="h2" className="mb-2">
              {getStepTitle()}
            </Typography>
          </div>
          
          <div className="min-h-[700px]">
            {renderStepContent()}
          </div>
        </div>

        <StepNavigation
          currentStep={step}
          canContinue={canContinue()}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};
