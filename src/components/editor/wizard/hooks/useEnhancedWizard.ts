
import { useState } from 'react';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { DEFAULT_TEMPLATES, WIZARD_STEPS, TemplateConfig } from '../wizardConfig';
import type { WizardState, WizardHandlers } from '../types';

interface UseEnhancedWizardProps {
  onComplete: (cardData: any) => void;
}

export const useEnhancedWizard = ({ onComplete }: UseEnhancedWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    selectedPhoto: '',
    selectedTemplate: DEFAULT_TEMPLATES[0],
    aiAnalysisComplete: false
  });
  const [isCreating, setIsCreating] = useState(false);

  const cardEditor = useCardEditor({
    initialData: {
      title: 'My Custom Card',
      rarity: 'common',
      tags: ['custom', 'card'],
      design_metadata: {
        ...DEFAULT_TEMPLATES[0].template_data
      },
      template_id: DEFAULT_TEMPLATES[0].id,
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    autoSave: true
  });

  const handlers: WizardHandlers = {
    handlePhotoSelect: (photo: string) => {
      setWizardState(prev => ({ ...prev, selectedPhoto: photo }));
      cardEditor.updateCardField('image_url', photo);
      setCurrentStep(2); // Move to combined adjust & template step
    },

    handleImageAdjusted: (adjustedImageUrl: string) => {
      setWizardState(prev => ({ ...prev, selectedPhoto: adjustedImageUrl }));
      cardEditor.updateCardField('image_url', adjustedImageUrl);
      cardEditor.updateCardField('thumbnail_url', adjustedImageUrl);
      setCurrentStep(3); // Move to card details
      toast.success('Image adjusted and template selected! Now add your card details.');
    },

    handleTemplateSelect: (template: TemplateConfig) => {
      setWizardState(prev => ({ ...prev, selectedTemplate: template }));
      cardEditor.updateCardField('template_id', template.id);
      cardEditor.updateCardField('design_metadata', template.template_data);
    },

    handleAiAnalysis: (analysis: any) => {
      setWizardState(prev => ({ ...prev, aiAnalysisComplete: true }));
      if (analysis?.name) {
        cardEditor.updateCardField('title', analysis.name);
      }
    },

    updateCardField: (field: string, value: any) => {
      cardEditor.updateCardField(field as keyof typeof cardEditor.cardData, value);
    },

    updateCreatorAttribution: (attribution: any) => {
      cardEditor.updateCardField('creator_attribution', attribution);
    },

    updatePublishingOptions: (options: any) => {
      cardEditor.updateCardField('publishing_options', options);
    },

    handleNext: () => {
      if (canProceed() && currentStep < WIZARD_STEPS.length) {
        setCurrentStep(prev => prev + 1);
      }
    },

    handleBack: () => {
      if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
    },

    handleComplete: async () => {
      setIsCreating(true);
      try {
        await cardEditor.saveCard();
        toast.success('Card created successfully!');
        onComplete(cardEditor.cardData);
      } catch (error) {
        console.error('Error creating card:', error);
        toast.error('Failed to create card. Please try again.');
      } finally {
        setIsCreating(false);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardState.selectedPhoto !== '';
      case 2:
        return wizardState.selectedPhoto !== '' && !!wizardState.selectedTemplate;
      case 3:
        return cardEditor.cardData.title?.trim() !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < WIZARD_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsCreating(true);
    try {
      await cardEditor.saveCard();
      toast.success('Card created successfully!');
      onComplete(cardEditor.cardData);
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return {
    currentStep,
    wizardState,
    cardEditor,
    handlers,
    isCreating,
    canProceed,
    handleNext,
    handlePrevious,
    handleComplete
  };
};
