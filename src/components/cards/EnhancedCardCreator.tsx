
import React, { useState, useCallback, useEffect } from 'react';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components/ui/design-system';
import { StepProgressIndicator } from '@/components/card-creator/components/StepProgressIndicator';
import { StepNavigation } from '@/components/card-creator/components/StepNavigation';
import { CustomizeStep } from '@/components/card-creator/steps/CustomizeStep';
import { PolishStep } from '@/components/card-creator/steps/PolishStep';
import { FrameAndImageStep } from './enhanced/steps/FrameAndImageStep';
import { PreviewStep } from './enhanced/steps/PreviewStep';
import { canContinueStep, getStepTitle, navigateSteps, validateTheme } from './enhanced/utils';
import type { EnhancedCardCreatorProps, Step } from './enhanced/types';

export const EnhancedCardCreator: React.FC<EnhancedCardCreatorProps> = ({
  initialImage,
  initialTitle,
  theme = 'default',
  primaryColor = '#00ff88',
  mode = 'full'
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cardData, updateField, saveCard, isSaving } = useSimpleCardEditor();
  const [step, setStep] = useState<Step>('frameAndImage');
  const [selectedFrame, setSelectedFrame] = useState<string>('');

  const validTheme = validateTheme(theme);

  // Initialize with URL parameters
  useEffect(() => {
    if (initialImage) {
      updateField('image_url', initialImage);
    }
    if (initialTitle) {
      updateField('title', initialTitle);
    }
  }, [initialImage, initialTitle, updateField]);

  // Apply theme colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
  }, [primaryColor]);

  console.log('EnhancedCardCreator rendering:', {
    step,
    selectedFrame,
    cardDataImage: cardData.image_url,
    cardTitle: cardData.title,
    theme: validTheme,
    primaryColor,
    mode
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
    return canContinueStep(step, selectedFrame, cardData);
  };

  const handlePrevious = () => {
    setStep(navigateSteps(step, 'previous'));
  };

  const handleNext = () => {
    setStep(navigateSteps(step, 'next'));
  };

  const renderStepContent = () => {
    console.log('Enhanced rendering step content for:', step);
    
    switch (step) {
      case 'frameAndImage':
        return (
          <FrameAndImageStep
            selectedFrame={selectedFrame}
            uploadedImage={cardData.image_url}
            onFrameSelect={handleFrameSelect}
            onImageUpload={handleImageUpload}
            theme={validTheme}
            primaryColor={primaryColor}
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
            cardData={cardData}
            selectedFrame={selectedFrame}
            isSaving={isSaving}
            user={user}
            onImageUpdate={handleImageUpdate}
            onSaveCard={saveCard}
          />
        );

      default:
        return null;
    }
  };

  // For compact mode, render just the studio
  if (mode === 'compact') {
    return renderStepContent();
  }

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
          <div 
            className="inline-block text-black px-4 py-2 rounded-full text-sm font-bold mb-4"
            style={{ backgroundColor: primaryColor }}
          >
            ENHANCED CARD CREATOR
          </div>
        </div>

        {mode === 'full' && (
          <StepProgressIndicator 
            currentStep={step}
            getStepDescription={() => 'Creating your perfect card'}
          />
        )}

        <div className="bg-[#23262F] rounded-2xl overflow-hidden">
          <div className="p-4 lg:p-6 text-center border-b border-gray-700">
            <Typography variant="h2" className="mb-2">
              {getStepTitle(step)}
            </Typography>
          </div>
          
          <div className="min-h-[700px]">
            {renderStepContent()}
          </div>
        </div>

        {mode === 'full' && (
          <StepNavigation
            currentStep={step}
            canContinue={canContinue()}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};
