
import React, { useState } from 'react';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components/ui/design-system';
import type { CardRarity } from '@/types/card';
import { StepProgressIndicator } from '@/components/card-creator/components/StepProgressIndicator';
import { StepNavigation } from '@/components/card-creator/components/StepNavigation';
import { FrameAndImageStep } from '@/components/card-creator/steps/FrameAndImageStep';
import { CustomizeStep } from '@/components/card-creator/steps/CustomizeStep';
import { PolishStep } from '@/components/card-creator/steps/PolishStep';
import { PreviewStep } from '@/components/card-creator/steps/PreviewStep';

type Step = 'frameAndImage' | 'customize' | 'polish' | 'preview';

export const EmbeddedCardCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cardData, updateField, saveCard, isSaving } = useSimpleCardEditor();
  const [step, setStep] = useState<Step>('frameAndImage');
  const [selectedFrame, setSelectedFrame] = useState<string>('');

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId);
    updateField('template_id', frameId);
  };

  const handleImageUpload = (imageUrl: string) => {
    updateField('image_url', imageUrl);
  };

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
      // Reset to first step
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
        return 'Choose Frame & Upload Image';
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
        return 'Select a frame style and upload your image to get started';
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
    switch (step) {
      case 'frameAndImage':
        return (
          <FrameAndImageStep
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
          <PreviewStep
            cardTitle={cardData.title}
            cardDescription={cardData.description || ''}
            cardRarity={cardData.rarity}
            imageUrl={cardData.image_url}
            isSaving={isSaving}
            onQuickPublish={handleQuickPublish}
            onContinueInStudio={handleContinueInStudio}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#141416] py-12 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-none mx-auto">
        <StepProgressIndicator 
          currentStep={step}
          getStepDescription={getStepDescription}
        />

        {/* Step Content */}
        <div className="bg-[#23262F] rounded-2xl p-4 lg:p-6 min-h-[500px]">
          <div className="mb-6 text-center">
            <Typography variant="h2" className="mb-2">
              {getStepTitle()}
            </Typography>
          </div>
          
          {renderStepContent()}
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
